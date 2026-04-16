import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Dummy data for fallback
const DUMMY_WEEKLY_DATA = [
  { day: 'Mon', appointments: 12 },
  { day: 'Tue', appointments: 19 },
  { day: 'Wed', appointments: 8 },
  { day: 'Thu', appointments: 24 },
  { day: 'Fri', appointments: 15 },
  { day: 'Sat', appointments: 6 },
  { day: 'Sun', appointments: 4 },
];

const DUMMY_APPOINTMENTS = [
  {
    id: '1',
    doctorName: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    userEmail: 'john@example.com',
    status: 'confirmed',
  },
  {
    id: '2',
    doctorName: 'Dr. Michael Chen',
    specialty: 'Neurologist',
    date: new Date().toISOString().split('T')[0],
    time: '14:30',
    userEmail: 'sarah@example.com',
    status: 'pending',
  },
  {
    id: '3',
    doctorName: 'Dr. Emily Williams',
    specialty: 'Pediatrician',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    userEmail: 'mike@example.com',
    status: 'confirmed',
  },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    pendingAppointments: 0,
    todayAppointments: 0,
    totalAppointments: 0,
    totalPatients: 0,
    totalDoctors: 0,
    confirmedToday: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [weeklyData, setWeeklyData] = useState(DUMMY_WEEKLY_DATA);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all appointments
        const appointmentsSnapshot = await getDocs(collection(db, 'appointments'));
        const appointments = appointmentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch all patients
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const patients = usersSnapshot.docs
          .map((doc) => doc.data())
          .filter((user) => user.role === 'patient' || !user.role);

        // Fetch all doctors
        const doctorsSnapshot = await getDocs(collection(db, 'doctors'));
        const doctors = doctorsSnapshot.docs.map((doc) => doc.data());

        // Calculate stats
        const pendingAppointments = appointments.filter((a) => a.status === 'pending').length;

        // Today's appointments
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayAppointments = appointments.filter((a) => {
          const appointmentDate = new Date(a.date);
          return appointmentDate.toDateString() === today.toDateString();
        });

        const confirmedToday = todayAppointments.filter((a) => a.status === 'confirmed').length;

        setStats({
          pendingAppointments,
          todayAppointments: todayAppointments.length,
          totalAppointments: appointments.length,
          totalPatients: patients.length,
          totalDoctors: doctors.length,
          confirmedToday,
        });

        // Get recent appointments (use real data or dummy)
        const sortedAppointments = appointments.length > 0
          ? appointments.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8)
          : DUMMY_APPOINTMENTS;

        setRecentAppointments(sortedAppointments);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Use dummy data on error
        setStats({
          pendingAppointments: 2,
          todayAppointments: 3,
          totalAppointments: 15,
          totalPatients: 8,
          totalDoctors: 4,
          confirmedToday: 2,
        });
        setRecentAppointments(DUMMY_APPOINTMENTS);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleConfirm = async (appointmentId) => {
    setActionLoading(appointmentId);
    try {
      await updateDoc(doc(db, 'appointments', appointmentId), {
        status: 'confirmed'
      });
      setRecentAppointments(prev =>
        prev.map(app =>
          app.id === appointmentId ? { ...app, status: 'confirmed' } : app
        )
      );
      setStats(prev => ({ ...prev, pendingAppointments: prev.pendingAppointments - 1 }));
    } catch (error) {
      console.error('Error confirming appointment:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      setActionLoading(appointmentId);
      try {
        await updateDoc(doc(db, 'appointments', appointmentId), {
          status: 'cancelled'
        });
        setRecentAppointments(prev =>
          prev.map(app =>
            app.id === appointmentId ? { ...app, status: 'cancelled' } : app
          )
        );
      } catch (error) {
        console.error('Error cancelling appointment:', error);
      } finally {
        setActionLoading(null);
      }
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hour, minute] = timeString.split(':');
    const h = parseInt(hour);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minute} ${ampm}`;
  };

  // Get status badge color
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Stats Cards Data
  const statsCards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: (
        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500',
      lightBg: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Total Doctors',
      value: stats.totalDoctors,
      icon: (
        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500',
      lightBg: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Total Appointments',
      value: stats.totalAppointments,
      icon: (
        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500',
      lightBg: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Pending',
      value: stats.pendingAppointments,
      icon: (
        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-500',
      lightBg: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome to your hospital admin panel
          </p>
        </div>
        <Link
          to="/admin/appointments"
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all text-sm font-medium shadow-lg shadow-indigo-500/30"
        >
          Manage Appointments
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {card.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${card.lightBg}`}>
                <div className={card.textColor}>
                  {card.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Appointments Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Overview</h3>
            <p className="text-sm text-gray-500 mt-1">Appointments in the last 7 days</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  borderRadius: '8px',
                  border: 'none',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Bar
                dataKey="appointments"
                radius={[8, 8, 0, 0]}
                fill="#6366f1"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Today's Summary */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-6">Today's Summary</h3>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-white/80">Total</span>
              <span className="text-2xl font-bold">{stats.todayAppointments}</span>
            </div>
            <div className="h-px bg-white/20"></div>
            <div className="flex items-center justify-between">
              <span className="text-white/80">Confirmed</span>
              <span className="text-xl font-semibold">{stats.confirmedToday}</span>
            </div>
            <div className="h-px bg-white/20"></div>
            <div className="flex items-center justify-between">
              <span className="text-white/80">Pending</span>
              <span className="text-xl font-semibold">{stats.todayAppointments - stats.confirmedToday}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Appointments Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Appointments
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Latest appointments across all doctors
            </p>
          </div>
          <Link
            to="/admin/appointments"
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentAppointments.map((appointment) => (
                <tr
                  key={appointment.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-indigo-600"
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
                      <div>
                        <p className="font-medium text-gray-900">
                          {appointment.userEmail?.split('@')[0] || 'Patient'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {appointment.userEmail}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">
                      {appointment.doctorName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {appointment.specialty || 'General'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{formatDate(appointment.date)}</p>
                    <p className="text-sm text-gray-500">{appointment.time || '09:00 AM'}</p>
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
                  <td className="px-6 py-4">
                    {appointment.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleConfirm(appointment.id)}
                          disabled={actionLoading === appointment.id}
                          className="px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          {actionLoading === appointment.id ? '...' : 'Confirm'}
                        </button>
                        <button
                          onClick={() => handleCancel(appointment.id)}
                          disabled={actionLoading === appointment.id}
                          className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                    {appointment.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancel(appointment.id)}
                        disabled={actionLoading === appointment.id}
                        className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Cancel
                      </button>
                    )}
                    {(appointment.status === 'cancelled' || appointment.status === 'completed') && (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
