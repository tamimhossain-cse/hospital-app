import { useEffect, useState } from 'react';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { getAllDoctors, approveDoctor, rejectDoctor } from '../../services/firestoreService';

// Dummy data for fallback
const DUMMY_DOCTORS = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    experience: '12 years',
    fee: 150,
    bio: 'Expert in interventional cardiology and preventive heart care.',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    status: 'approved'
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Neurologist',
    experience: '8 years',
    fee: 200,
    bio: 'Specializes in neurological disorders and brain imaging.',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    status: 'approved'
  },
  {
    id: '3',
    name: 'Dr. Emily Williams',
    specialty: 'Pediatrician',
    experience: '5 years',
    fee: 100,
    bio: 'Dedicated to providing comprehensive care for children of all ages.',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
    status: 'pending'
  },
  {
    id: '4',
    name: 'Dr. James Anderson',
    specialty: 'Orthopedic Surgeon',
    experience: '15 years',
    fee: 250,
    bio: 'Expert in sports medicine and joint replacement surgery.',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
    status: 'pending'
  },
];

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const data = await getAllDoctors();
      // Use Firestore data if available, otherwise use dummy data
      setDoctors(data.length > 0 ? data : DUMMY_DOCTORS);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Use dummy data on error
      setDoctors(DUMMY_DOCTORS);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (doctorId) => {
    try {
      await approveDoctor(doctorId);
      fetchDoctors();
    } catch (error) {
      console.error('Error approving doctor:', error);
      // Update local state optimistically
      setDoctors(doctors.map(d =>
        d.id === doctorId ? { ...d, status: 'approved' } : d
      ));
    }
  };

  const handleReject = async (doctorId) => {
    try {
      await rejectDoctor(doctorId);
      fetchDoctors();
    } catch (error) {
      console.error('Error rejecting doctor:', error);
      // Update local state optimistically
      setDoctors(doctors.map(d =>
        d.id === doctorId ? { ...d, status: 'rejected' } : d
      ));
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
    };
    return styles[status] || styles.pending;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Manage Doctors</h2>
          <p className="text-sm text-gray-500 mt-1">View and manage doctor profiles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <Card key={doctor.id} hover>
            <CardBody>
              <div className="flex items-start gap-4">
                <img
                  src={doctor.image || 'https://via.placeholder.com/100'}
                  alt={doctor.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                      <p className="text-sm text-gray-500">{doctor.specialty}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusBadge(doctor.status)}`}>
                      {doctor.status}
                    </span>
                  </div>
                  <div className="mt-3 space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Experience:</span> {doctor.experience}</p>
                    <p><span className="font-medium">Fee:</span> ${doctor.fee}</p>
                  </div>
                </div>
              </div>

              {doctor.bio && (
                <p className="mt-4 text-sm text-gray-600 line-clamp-2">{doctor.bio}</p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {doctor.status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleApprove(doctor.id)}
                      className="text-xs"
                    >
                      ✓ Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleReject(doctor.id)}
                      className="text-xs"
                    >
                      ✕ Reject
                    </Button>
                  </>
                )}
                {doctor.status === 'approved' && (
                  <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Approved
                  </span>
                )}
                {doctor.status === 'rejected' && (
                  <span className="text-xs text-red-600 font-medium">Rejected</span>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ManageDoctors;
