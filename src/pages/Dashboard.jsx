import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import Card, { CardBody } from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import { formatAppointmentDate } from "../services/appointmentService";

function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-warning-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Confirmed</p>
          <p className="text-2xl font-bold text-success-600">{stats.confirmed}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-primary-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Cancelled</p>
          <p className="text-2xl font-bold text-danger-600">{stats.cancelled}</p>
        </div>
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
            <Card key={app.id} hover>
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
                  <Badge variant={app.status}>{app.status}</Badge>
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