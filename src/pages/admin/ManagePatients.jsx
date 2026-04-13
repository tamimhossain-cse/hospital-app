import { useEffect, useState } from 'react';
import Card, { CardBody } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { getAllUsers, blockUser } from '../../services/firestoreService';

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, blocked

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const data = await getAllUsers();
      const patientsOnly = data.filter((u) => u.role === 'patient');
      setPatients(patientsOnly);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (patient) => {
    const action = patient.isBlocked ? 'unblock' : 'block';
    if (window.confirm(`Are you sure you want to ${action} this patient?`)) {
      try {
        await blockUser(patient.id, !patient.isBlocked);
        fetchPatients();
      } catch (error) {
        console.error(`Error ${action}ing patient:`, error);
        alert(`Error ${action}ing patient: ` + error.message);
      }
    }
  };

  const filteredPatients = patients.filter((patient) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !patient.isBlocked;
    if (filter === 'blocked') return patient.isBlocked;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Manage Patients</h2>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({patients.length})
          </Button>
          <Button
            variant={filter === 'active' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('active')}
          >
            Active ({patients.filter((p) => !p.isBlocked).length})
          </Button>
          <Button
            variant={filter === 'blocked' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('blocked')}
          >
            Blocked ({patients.filter((p) => p.isBlocked).length})
          </Button>
        </div>
      </div>

      {filteredPatients.length === 0 ? (
        <EmptyState
          title={filter === 'all' ? 'No patients found' : `No ${filter} patients`}
          description="Patients will appear here once they register on the platform."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} hover>
              <CardBody>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-primary-600"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {patient.displayName || patient.email?.split('@')[0] || 'Patient'}
                        </h3>
                        <p className="text-sm text-gray-500">{patient.email}</p>
                      </div>
                      <Badge variant={patient.isBlocked ? 'danger' : 'success'}>
                        {patient.isBlocked ? 'Blocked' : 'Active'}
                      </Badge>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      <p>Joined: {patient.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    variant={patient.isBlocked ? 'success' : 'warning'}
                    onClick={() => handleToggleBlock(patient)}
                  >
                    {patient.isBlocked ? 'Unblock' : 'Block'}
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagePatients;
