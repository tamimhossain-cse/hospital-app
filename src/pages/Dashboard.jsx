import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import Card, { CardBody } from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import StatsCard from "../components/ui/StatsCard";
import { formatAppointmentDate } from "../services/appointmentService";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [visitAlerts, setVisitAlerts] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const alertedAppointments = useRef(new Set());
  const alertShownRef = useRef(new Set());

  // Play notification sound
  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  // Check if it's time for appointment
  const checkAppointmentTime = () => {
    const now = new Date();
    const currentTime = now.toTimeString('en-US', { hour12: false }).slice(0, 5); // "HH:MM" format
    const todayDate = now.toISOString().split('T')[0]; // "YYYY-MM-DD" format

    const newAlerts = [];

    appointments.forEach((app) => {
      // Only check confirmed appointments for today
      if (
        app.status === 'confirmed' &&
        app.date === todayDate &&
        app.time &&
        !alertShownRef.current.has(app.id)
      ) {
        // Compare time (with 5 minute window before and after)
        const [appHour, appMinute] = app.time.split(':').map(Number);
        const [nowHour, nowMinute] = currentTime.split(':').map(Number);

        const appTotalMinutes = appHour * 60 + appMinute;
        const nowTotalMinutes = nowHour * 60 + nowMinute;

        // Alert if within 5 minutes of appointment time
        if (Math.abs(appTotalMinutes - nowTotalMinutes) <= 5) {
          alertShownRef.current.add(app.id);
          newAlerts.push({
            id: app.id,
            doctorName: app.doctorName,
            time: app.time,
            message: `You can visit now! Your appointment with ${app.doctorName} is at ${app.time}`
          });
        }
      }
    });

    if (newAlerts.length > 0) {
      setVisitAlerts(newAlerts);
      playNotificationSound();
    }
  };

  // Dismiss alert
  const dismissAlert = (alertId) => {
    setVisitAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  };

  // Timer effect - check every minute
  useEffect(() => {
    const interval = setInterval(() => {
      checkAppointmentTime();
    }, 60000); // Check every minute

    // Initial check
    checkAppointmentTime();

    return () => clearInterval(interval);
  }, [appointments]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await updateDoc(doc(db, "appointments", id), { status: "cancelled" });
        setAppointments(
          appointments.map((app) =>
            app.id === id ? { ...app, status: "cancelled" } : app
          )
        );
      } catch (error) {
        console.error(error);
        alert("Error cancelling appointment: " + error.message);
      }
    }
  };

  const handleBookNew = () => {
    navigate("/");
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.email) return;

      try {
        const q = query(
          collection(db, "appointments"),
          where("userEmail", "==", user.email)
        );

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort by date (newest first)
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  const filteredAppointments = appointments.filter((app) => {
    if (filter === "all") return true;
    return app.status === filter;
  });

  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === "pending").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };

  // Merge confirmed with completed for display
  const completedCount = stats.completed + stats.confirmed;

  // Chart data
  const chartData = [
    { name: "Pending", value: stats.pending, color: "#f59e0b" },
    { name: "Confirmed", value: stats.confirmed, color: "#10b981" },
    { name: "Completed", value: stats.completed, color: "#3b82f6" },
    { name: "Cancelled", value: stats.cancelled, color: "#ef4444" },
  ];

  // Icon components for stats cards
  const TotalIcon = () => (
    <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );

  const PendingIcon = () => (
    <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const CompletedIcon = () => (
    <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const CancelledIcon = () => (
    <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hour, minute] = timeString.split(':');
    const h = parseInt(hour);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minute} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Visit Time Alerts */}
      {visitAlerts.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
          {visitAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-green-50 border-2 border-green-500 rounded-lg p-4 shadow-lg animate-[slideIn_0.3s_ease-out]"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-green-800">Visit Time!</h4>
                  <p className="text-sm text-green-700 mt-1">{alert.message}</p>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="text-green-600 hover:text-green-800"
                >
                  <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-500 mt-1">Manage your upcoming and past appointments</p>
        </div>
        <Button variant="primary" onClick={handleBookNew}>
          Book New Appointment
        </Button>
      </div>

      {/* Enhanced Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Appointments"
          value={stats.total}
          color="primary"
          icon={<TotalIcon />}
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          color="warning"
          icon={<PendingIcon />}
        />
        <StatsCard
          title="Confirmed"
          value={stats.confirmed}
          color="success"
          icon={<CompletedIcon />}
        />
        <StatsCard
          title="Cancelled"
          value={stats.cancelled}
          color="danger"
          icon={<CancelledIcon />}
        />
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Overview</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === "all" ? "primary" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All ({stats.total})
        </Button>
        <Button
          variant={filter === "pending" ? "primary" : "outline"}
          size="sm"
          onClick={() => setFilter("pending")}
        >
          Pending ({stats.pending})
        </Button>
        <Button
          variant={filter === "confirmed" ? "primary" : "outline"}
          size="sm"
          onClick={() => setFilter("confirmed")}
        >
          Confirmed ({stats.confirmed})
        </Button>
        <Button
          variant={filter === "completed" ? "primary" : "outline"}
          size="sm"
          onClick={() => setFilter("completed")}
        >
          Completed ({stats.completed})
        </Button>
        <Button
          variant={filter === "cancelled" ? "primary" : "outline"}
          size="sm"
          onClick={() => setFilter("cancelled")}
        >
          Cancelled ({stats.cancelled})
        </Button>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <EmptyState
          title={filter === "all" ? "No appointments yet" : `No ${filter} appointments`}
          description={
            filter === "all"
              ? "You haven't booked any appointments yet. Start by booking an appointment with one of our doctors."
              : `You don't have any ${filter} appointments.`
          }
          action={
            filter === "all" && (
              <Button variant="primary" onClick={handleBookNew}>
                Book First Appointment
              </Button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAppointments.map((app) => (
            <Card key={app.id} hover className={app.status === 'confirmed' && app.date === new Date().toISOString().split('T')[0] ? 'ring-2 ring-green-500' : ''}>
              <CardBody>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
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
                        <path d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{app.doctorName}</h3>
                      <p className="text-sm text-gray-500">{app.specialty}</p>
                    </div>
                  </div>
                  <Badge
                    variant={app.status === 'confirmed' ? 'success' : app.status === 'pending' ? 'warning' : app.status === 'cancelled' ? 'danger' : 'default'}
                  >
                    {app.status}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatAppointmentDate(app.date)}
                  </div>
                  {app.time && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatTime(app.time)}
                    </div>
                  )}
                  {app.notes && (
                    <div className="text-gray-600 line-clamp-2">
                      <span className="font-medium">Notes:</span> {app.notes}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  {app.status !== "cancelled" && app.status !== "completed" && (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(app.id)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/appointments/${app.id}`)}
                    className="flex-1"
                  >
                    Details
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
