import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card, { CardHeader, CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { getAppointment, cancelAppointment } from '../services/firestoreService';
import { formatAppointmentDate, getStatusBadgeVariant } from '../services/appointmentService';

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isDoctor } = useAuth();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  const fetchAppointment = async () => {
    try {
      const data = await getAppointment(id);
      setAppointment(data);
    } catch (error) {
      console.error('Error fetching appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await cancelAppointment(id);
        setAppointment({ ...appointment, status: 'cancelled' });
      } catch (error) {
        console.error('Error cancelling appointment:', error);
        alert('Error cancelling appointment: ' + error.message);
      }
    }
  };

  const canCancel = () => {
    if (isDoctor) return true;
    if (user?.email === appointment?.userEmail) return true;
    return false;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <EmptyState
        title="Appointment Not Found"
        description="The appointment you're looking for doesn't exist or you don't have permission to view it."
        action={<Button variant="primary" onClick={() => navigate(-1)}>Go Back</Button>}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        ← Back
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Appointment Details</h1>
              <p className="text-gray-500 mt-1">ID: {appointment.id}</p>
            </div>
            <Badge variant={getStatusBadgeVariant(appointment.status)}>
              {appointment.status}
            </Badge>
          </div>
        </CardHeader>

        <CardBody>
          <div className="space-y-6">
            {/* Doctor Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-primary-600"
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
                <h3 className="font-semibold text-gray-900">{appointment.doctorName}</h3>
                <p className="text-sm text-gray-500">{appointment.specialty}</p>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Date</label>
                <p className="text-gray-900 mt-1">{formatAppointmentDate(appointment.date)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Time</label>
                <p className="text-gray-900 mt-1">To be confirmed</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Patient Email</label>
                <p className="text-gray-900 mt-1">{appointment.userEmail}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Specialty</label>
                <p className="text-gray-900 mt-1">{appointment.specialty}</p>
              </div>
            </div>

            {/* Notes */}
            {appointment.notes && (
              <div>
                <label className="text-sm font-medium text-gray-500">Notes</label>
                <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">{appointment.notes}</p>
              </div>
            )}

            {/* Created At */}
            <div className="text-sm text-gray-400 pt-4 border-t border-gray-100">
              Booked on: {appointment.createdAt?.toDate?.()?.toLocaleString() || 'N/A'}
            </div>

            {/* Actions */}
            {appointment.status !== 'cancelled' && appointment.status !== 'completed' && canCancel() && (
              <div className="pt-4 border-t border-gray-100">
                <Button
                  variant="danger"
                  onClick={handleCancel}
                  className="w-full md:w-auto"
                >
                  Cancel Appointment
                </Button>
              </div>
            )}

            {appointment.status === 'cancelled' && (
              <div className="p-4 bg-danger-50 rounded-lg">
                <p className="text-danger-700 text-center">This appointment has been cancelled.</p>
              </div>
            )}

            {appointment.status === 'completed' && (
              <div className="p-4 bg-success-50 rounded-lg">
                <p className="text-success-700 text-center">This appointment has been completed.</p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default AppointmentDetails;
