import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Card, { CardBody } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, patients, doctors, admins

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getDocs(collection(db, 'users'));
      const usersList = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (user) => {
    const action = user.isBlocked ? 'unblock' : 'block';
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        await updateDoc(doc(db, 'users', user.id), {
          isBlocked: !user.isBlocked
        });
        fetchUsers();
      } catch (error) {
        console.error(`Error ${action}ing user:`, error);
        alert(`Error ${action}ing user: ` + error.message);
      }
    }
  };

  const handleChangeRole = async (user, newRole) => {
    if (window.confirm(`Change ${user.email || 'this user'}'s role to ${newRole}?`)) {
      try {
        await updateDoc(doc(db, 'users', user.id), {
          role: newRole
        });
        fetchUsers();
      } catch (error) {
        console.error('Error changing role:', error);
        alert('Error changing role: ' + error.message);
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    if (filter === 'all') return true;
    if (filter === 'patients') return user.role === 'patient' || !user.role;
    if (filter === 'doctors') return user.role === 'doctor';
    if (filter === 'admins') return user.role === 'admin';
    return true;
  });

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'danger';
      case 'doctor': return 'primary';
      case 'patient': return 'success';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Manage Users</h2>
          <p className="text-sm text-gray-500 mt-1">View and manage all platform users</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({users.length})
          </Button>
          <Button
            variant={filter === 'patients' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('patients')}
          >
            Patients ({users.filter((u) => u.role === 'patient' || !u.role).length})
          </Button>
          <Button
            variant={filter === 'doctors' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('doctors')}
          >
            Doctors ({users.filter((u) => u.role === 'doctor').length})
          </Button>
          <Button
            variant={filter === 'admins' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('admins')}
          >
            Admins ({users.filter((u) => u.role === 'admin').length})
          </Button>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <EmptyState
          title={filter === 'all' ? 'No users found' : `No ${filter} found`}
          description="Users will appear here once they register on the platform."
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-indigo-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.displayName || user.email?.split('@')[0] || 'User'}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role || 'patient'}
                        onChange={(e) => handleChangeRole(user, e.target.value)}
                        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={user.isBlocked ? 'danger' : 'success'}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {user.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        size="sm"
                        variant={user.isBlocked ? 'success' : 'warning'}
                        onClick={() => handleToggleBlock(user)}
                      >
                        {user.isBlocked ? 'Unblock' : 'Block'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
