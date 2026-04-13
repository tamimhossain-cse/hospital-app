import { useEffect, useState } from 'react';
import Card, { CardBody } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { getAllAppointments } from '../../services/firestoreService';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    doctorName: '',
    userEmail: '',
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await getAllAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    if (filters.status && appointment.status !== filters.status) return false;
    if (filters.doctorName && !appointment.doctorName?.toLowerCase().includes(filters.doctorName.toLowerCase())) return false;
    if (filters.userEmail && !appointment.userEmail?.toLowerCase().includes(filters.userEmail.toLowerCase())) return false;
    return true;
  });

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Manage Appointments</h2>

        {/* Filters */}
        <Card>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Filter by Status"
                name="status"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                options={statusOptions}
              />

              <Input
                label="Search by Doctor"
                name="doctorName"
                placeholder="Doctor name..."
                value={filters.doctorName}
                onChange={(e) => setFilters({ ...filters, doctorName: e.target.value })}
              />

              <Input
                label="Search by Patient Email"
                name="userEmail"
                placeholder="Patient email..."
                value={filters.userEmail}
                onChange={(e) => setFilters({ ...filters, userEmail: e.target.value })}
              />
            </div>
          </CardBody>
        </Card>
      </div>

      {filteredAppointments.length === 0 ? (
        <EmptyState
          title="No appointments found"
          description="Try adjusting your filters or wait for patients to book appointments."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id} hover>
              <CardBody>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{appointment.doctorName}</h3>
                    <p className="text-sm text-gray-500">{appointment.specialty}</p>
                  </div>
                  <Badge variant={appointment.status}>{appointment.status}</Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Patient:</span>
                    <span className="font-medium">{appointment.userEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date:</span>
                    <span className="font-medium">{appointment.date}</span>
                  </div>
                  {appointment.notes && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <span className="text-gray-500">Notes:</span>
                      <p className="text-gray-700 mt-1">{appointment.notes}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 text-xs text-gray-400">
                  Created: {appointment.createdAt?.toDate?.()?.toLocaleString() || 'N/A'}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageAppointments;
