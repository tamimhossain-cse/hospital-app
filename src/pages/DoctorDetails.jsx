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
import { isValidAppointmentDate, checkDuplicateAppointment } from "../services/appointmentService";

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
  const [successMessage, setSuccessMessage] = useState("");

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

  const handleOpenBookingModal = () => {
    if (!user) {
      // Store the current URL for redirect after login
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      navigate("/login");
      return;
    }
    setModalOpen(true);
  };

  const handleBooking = async () => {
    setError("");
    setSuccessMessage("");

    if (!date) {
      setError("Please select a date for your appointment.");
      return;
    }

    if (!isValidAppointmentDate(date)) {
      setError("Please select a future date for your appointment.");
      return;
    }

    setBooking(true);

    try {
      // Check for duplicate appointment
      const isDuplicate = await checkDuplicateAppointment(
        user.email,
        doctor.name,
        date
      );

      if (isDuplicate) {
        setError("You already have an appointment with this doctor on this date. Please choose a different date.");
        setBooking(false);
        return;
      }

      // Create the appointment
      await addDoc(collection(db, "appointments"), {
        doctorName: doctor.name,
        specialty: doctor.specialty,
        date: date,
        userEmail: user.email,
        status: "pending",
        notes: notes.trim(),
        createdAt: new Date(),
      });

      // Show success message
      setSuccessMessage("Appointment booked successfully! You can view it in your dashboard.");

      // Close modal and reset form after a short delay
      setTimeout(() => {
        setModalOpen(false);
        setDate("");
        setNotes("");
        setSuccessMessage("");
        navigate("/dashboard");
      }, 1500);
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
    setSuccessMessage("");
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
                <Button variant="primary" onClick={handleOpenBookingModal}>
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

          {successMessage ? (
            <div className="p-4 bg-success-50 text-success-700 rounded-lg flex items-center gap-3 animate-[fadeIn_0.3s_ease-out]">
              <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium">Booking Confirmed!</p>
                <p className="text-sm">{successMessage}</p>
              </div>
            </div>
          ) : (
            <>
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

              {error && !successMessage && (
                <div className="p-3 bg-danger-50 text-danger-700 rounded-lg text-sm flex items-start gap-2">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={handleCloseModal} disabled={booking}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleBooking} disabled={booking}>
                  {booking ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Booking...
                    </span>
                  ) : (
                    "Confirm Booking"
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default DoctorDetails;
