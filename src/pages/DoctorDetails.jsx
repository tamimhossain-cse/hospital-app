import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import doctors from "../services/doctorData";
import { addDoc, collection } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";
import Card, { CardBody } from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import { isValidAppointmentDate } from "../services/appointmentService";

function DoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const doctor = doctors.find((d) => d.id === parseInt(id));
  const { user } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");

  if (!doctor) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Doctor Not Found</h2>
        <p className="text-gray-500">The doctor you're looking for doesn't exist.</p>
        <Button variant="primary" onClick={() => navigate("/")} className="mt-4">
          Back to Home
        </Button>
      </div>
    );
  }

  const handleBooking = async () => {
    if (!user) {
      alert("Please login to book an appointment.");
      navigate("/login");
      return;
    }

    if (!date) {
      setError("Please select a date for your appointment.");
      return;
    }

    if (!isValidAppointmentDate(date)) {
      setError("Please select a future date for your appointment.");
      return;
    }

    setError("");
    setBooking(true);

    try {
      await addDoc(collection(db, "appointments"), {
        doctorName: doctor.name,
        specialty: doctor.specialty,
        date: date,
        userEmail: user.email,
        status: "pending",
        notes: notes.trim(),
        createdAt: new Date(),
      });

      setModalOpen(false);
      setDate("");
      setNotes("");
      alert("Appointment booked successfully! You can view it in your dashboard.");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setError("Failed to book appointment. Please try again.");
    } finally {
      setBooking(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setDate("");
    setNotes("");
    setError("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        ← Back to Doctors
      </Button>

      {/* Doctor Profile Card */}
      <Card>
        <CardBody>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Doctor Image */}
            <div className="flex-shrink-0">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-40 h-40 rounded-2xl object-cover shadow-lg mx-auto md:mx-0"
              />
            </div>

            {/* Doctor Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{doctor.name}</h1>
                  <Badge variant="primary" className="mt-2">{doctor.specialty}</Badge>
                </div>
                <Button variant="primary" onClick={() => setModalOpen(true)}>
                  Book Appointment
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="font-medium text-gray-900">{doctor.experience || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Consultation Fee</p>
                  <p className="font-medium text-gray-900">${doctor.fee || "N/A"}</p>
                </div>
              </div>

              {doctor.bio && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-1">About</p>
                  <p className="text-gray-700">{doctor.bio}</p>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Booking Modal */}
      <Modal isOpen={modalOpen} onClose={handleCloseModal} title="Book Appointment" size="md">
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-900">{doctor.name}</p>
            <p className="text-sm text-gray-500">{doctor.specialty}</p>
            <p className="text-sm text-primary-600 mt-1">Fee: ${doctor.fee || "TBD"}</p>
          </div>

          <Input
            label="Appointment Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            error={error}
            min={new Date().toISOString().split('T')[0]}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows="3"
              placeholder="Describe your symptoms or reason for visit..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-danger-600">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleCloseModal} disabled={booking}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleBooking} disabled={booking}>
              {booking ? "Booking..." : "Confirm Booking"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default DoctorDetails;