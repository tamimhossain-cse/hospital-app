import { useEffect, useState } from 'react';
import Card, { CardBody } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import StatsCard from '../../components/ui/StatsCard';
import { getAppointmentsByDoctor, confirmAppointment, completeAppointment, cancelAppointment } from '../../services/firestoreService';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/ui/Modal';
import TextArea from '../../components/ui/TextArea';

const DoctorDashboard = () => {
  const { userProfile } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      if (userProfile?.name) {
        const data = await getAppointmentsByDoctor(userProfile.name);
        setAppointments(data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      if (newStatus === 'confirmed') {
        await confirmAppointment(appointmentId);
      } else if (newStatus === 'completed') {
        await completeAppointment(appointmentId);
      } else if (newStatus === 'cancelled') {
        await cancelAppointment(appointmentId);
      }
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Error updating appointment: ' + error.message);
    }
  };

  const openNotesModal = (appointment) => {
    setSelectedAppointment(appointment);
    setNotes(appointment.notes || '');
    setNotesModalOpen(true);
  };

  const saveNotes = async () => {
    try {
      const { updateAppointment } = await import('../../services/firestoreService');
      await updateAppointment(selectedAppointment.id, { notes });
      setNotesModalOpen(false);
      fetchAppointments();
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
  };

  const CalendarIcon = () => (
    <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-success-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard title="Total" value={stats.total} icon={<CalendarIcon />} color="primary" />
        <StatsCard title="Pending" value={stats.pending} icon={<CalendarIcon />} color="warning" />
        <StatsCard title="Confirmed" value={stats.confirmed} icon={<CalendarIcon />} color="success" />
        <StatsCard title="Completed" value={stats.completed} icon={<CalendarIcon />} color="info" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button variant={filter === 'all' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('all')}>
          All ({stats.total})
        </Button>
        <Button variant={filter === 'pending' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('pending')}>
          Pending ({stats.pending})
        </Button>
        <Button variant={filter === 'confirmed' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('confirmed')}>
          Confirmed ({stats.confirmed})
        </Button>
        <Button variant={filter === 'completed' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('completed')}>
          Completed ({stats.completed})
        </Button>
      </div>

      {/* Appointments */}
      {filteredAppointments.length === 0 ? (
        <EmptyState
          title="No appointments found"
          description={filter === 'all' ? 'You don\'t have any appointments yet.' : `No ${filter} appointments.`}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id} hover>
              <CardBody>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{appointment.userEmail}</h3>
                    <p className="text-sm text-gray-500">Patient</p>
                  </div>
                  <Badge variant={appointment.status}>{appointment.status}</Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date:</span>
                    <span className="font-medium">{appointment.date}</span>
                  </div>
                  {appointment.specialty && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Specialty:</span>
                      <span className="font-medium">{appointment.specialty}</span>
                    </div>
                  )}
                  {appointment.notes && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <span className="text-gray-500">Notes:</span>
                      <p className="text-gray-700 mt-1">{appointment.notes}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {appointment.status === 'pending' && (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                    >
                      Confirm
                    </Button>
                  )}
                  {appointment.status === 'confirmed' && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleStatusChange(appointment.id, 'completed')}
                    >
                      Mark Complete
                    </Button>
                  )}
                  {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openNotesModal(appointment)}
                  >
                    Add Notes
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Notes Modal */}
      <Modal isOpen={notesModalOpen} onClose={() => setNotesModalOpen(false)} title="Add Notes" size="md">
        <TextArea
          label="Appointment Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows="4"
          placeholder="Add any notes about this appointment..."
        />
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => setNotesModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveNotes}>
            Save Notes
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default DoctorDashboard;
