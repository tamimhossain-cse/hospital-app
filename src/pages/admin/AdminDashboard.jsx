import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    pendingAppointments: 0,
    todayAppointments: 0,
    totalAppointments: 0,
    totalPatients: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all appointments
        const appointmentsSnapshot = await getDocs(collection(db, 'appointments'));
        const appointments = appointmentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch all patients (users with role 'patient' or all users)
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const patients = usersSnapshot.docs
          .map((doc) => doc.data())
          .filter((user) => user.role === 'patient' || !user.role);

        // Calculate stats
        const pendingAppointments = appointments.filter(
          (a) => a.status === 'pending'
        ).length;

        // Today's appointments
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayAppointments = appointments.filter((a) => {
          const appointmentDate = new Date(a.date);
          return appointmentDate >= today && appointmentDate < tomorrow;
        }).length;

        const totalAppointments = appointments.length;
        const totalPatients = patients.length;

        setStats({
          pendingAppointments,
          todayAppointments,
          totalAppointments,
          totalPatients,
        });

        // Get recent appointments (last 6)
        const sortedAppointments = appointments
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 6);

        setRecentAppointments(sortedAppointments);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Format time for display
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status badge color
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Icons
  const PendingIcon = () => (
    <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const TodayIcon = () => (
    <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const TotalIcon = () => (
    <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );

  const PatientsIcon = () => (
    <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome to your hospital admin panel
          </p>
        </div>
        <Link
          to="/admin/appointments"
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
        >
          View All Appointments
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Appointments - Red */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Pending Appointments
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.pendingAppointments}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-xl">
              <PendingIcon />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-red-600 font-medium">
              {stats.pendingAppointments > 0 ? 'Needs attention' : 'All caught up'}
            </span>
          </div>
        </div>

        {/* Today's Appointments - Blue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Today's Appointments
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.todayAppointments}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl">
              <TodayIcon />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-blue-600 font-medium">
              {stats.todayAppointments > 0 ? 'Scheduled today' : 'No appointments today'}
            </span>
          </div>
        </div>

        {/* Total Appointments - Green */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Total Appointments
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalAppointments}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl">
              <TotalIcon />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">All time</span>
          </div>
        </div>

        {/* Total Patients - Orange */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Total Patients
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalPatients}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl">
              <PatientsIcon />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-orange-600 font-medium">Registered patients</span>
          </div>
        </div>
      </div>

      {/* Recent Appointments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Appointments
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Latest appointments across all doctors
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Doctor Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentAppointments.length > 0 ? (
                recentAppointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-teal-600"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {appointment.doctorName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {appointment.specialty || 'General'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(appointment.date)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatTime(appointment.date)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusBadgeClass(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <svg
                        className="w-12 h-12 text-gray-300"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p>No appointments found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {recentAppointments.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <Link
              to="/admin/appointments"
              className="text-teal-600 hover:text-teal-700 text-sm font-medium"
            >
              View all appointments →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
