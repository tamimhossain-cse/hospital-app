import { useEffect, useState } from 'react';
import StatsCard from '../../components/ui/StatsCard';
import { getStats } from '../../services/firestoreService';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    pendingDoctors: 0,
    pendingAppointments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const UserIcon = () => (
    <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );

  const DoctorIcon = () => (
    <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const CalendarIcon = () => (
    <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const ClockIcon = () => (
    <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<UserIcon />}
          color="primary"
        />
        <StatsCard
          title="Total Doctors"
          value={stats.totalDoctors}
          icon={<DoctorIcon />}
          color="success"
        />
        <StatsCard
          title="Total Appointments"
          value={stats.totalAppointments}
          icon={<CalendarIcon />}
          color="info"
        />
        <StatsCard
          title="Pending Approvals"
          value={stats.pendingDoctors + stats.pendingAppointments}
          icon={<ClockIcon />}
          color="warning"
        />
      </div>

      {/* Pending Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>Pending Doctor Approvals</CardHeader>
          <CardBody>
            {stats.pendingDoctors > 0 ? (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{stats.pendingDoctors} doctor(s) waiting for approval</span>
                <Badge variant="warning">{stats.pendingDoctors}</Badge>
              </div>
            ) : (
              <p className="text-gray-500">No pending doctor approvals</p>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>Pending Appointments</CardHeader>
          <CardBody>
            {stats.pendingAppointments > 0 ? (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{stats.pendingAppointments} appointment(s) waiting confirmation</span>
                <Badge variant="warning">{stats.pendingAppointments}</Badge>
              </div>
            ) : (
              <p className="text-gray-500">No pending appointments</p>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
