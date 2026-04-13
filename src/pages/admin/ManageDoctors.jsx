import { useEffect, useState } from 'react';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import EmptyState from '../../components/ui/EmptyState';
import { getAllDoctors, createDoctorProfile, updateDoctorProfile, deleteDoctorProfile, approveDoctor, rejectDoctor } from '../../services/firestoreService';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    experience: '',
    fee: '',
    bio: '',
    image: '',
    userId: '',
    status: 'pending',
  });

  const specialties = [
    'Cardiologist',
    'Dermatologist',
    'Neurologist',
    'Pediatrician',
    'Orthopedic Surgeon',
    'Gynecologist',
    'Ophthalmologist',
    'Psychiatrist',
    'Gastroenterologist',
    'Endocrinologist',
    'Urologist',
    'Oncologist',
    'Pulmonologist',
    'Rheumatologist',
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const data = await getAllDoctors();
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (doctor = null) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setFormData({
        name: doctor.name || '',
        specialty: doctor.specialty || '',
        experience: doctor.experience || '',
        fee: doctor.fee || '',
        bio: doctor.bio || '',
        image: doctor.image || '',
        userId: doctor.userId || '',
        status: doctor.status || 'pending',
      });
    } else {
      setEditingDoctor(null);
      setFormData({
        name: '',
        specialty: '',
        experience: '',
        fee: '',
        bio: '',
        image: 'https://randomuser.me/api/portraits/lego/1.jpg',
        userId: '',
        status: 'pending',
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingDoctor(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        fee: Number(formData.fee),
      };

      if (editingDoctor) {
        await updateDoctorProfile(editingDoctor.id, data);
      } else {
        await createDoctorProfile(data);
      }

      handleCloseModal();
      fetchDoctors();
    } catch (error) {
      console.error('Error saving doctor:', error);
      alert('Error saving doctor: ' + error.message);
    }
  };

  const handleDelete = async (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await deleteDoctorProfile(doctorId);
        fetchDoctors();
      } catch (error) {
        console.error('Error deleting doctor:', error);
        alert('Error deleting doctor: ' + error.message);
      }
    }
  };

  const handleApprove = async (doctorId) => {
    try {
      await approveDoctor(doctorId);
      fetchDoctors();
    } catch (error) {
      console.error('Error approving doctor:', error);
    }
  };

  const handleReject = async (doctorId) => {
    try {
      await rejectDoctor(doctorId);
      fetchDoctors();
    } catch (error) {
      console.error('Error rejecting doctor:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Manage Doctors</h2>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          <PlusIcon className="w-5 h-5" />
          Add Doctor
        </Button>
      </div>

      {doctors.length === 0 ? (
        <EmptyState
          title="No doctors found"
          description="Get started by adding a new doctor to the system."
          action={<Button variant="primary" onClick={() => handleOpenModal()}>Add First Doctor</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <Card key={doctor.id} hover>
              <CardBody>
                <div className="flex items-start gap-4">
                  <img
                    src={doctor.image || 'https://via.placeholder.com/100'}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                        <p className="text-sm text-gray-500">{doctor.specialty}</p>
                      </div>
                      <Badge variant={doctor.status === 'approved' ? 'success' : doctor.status === 'rejected' ? 'danger' : 'warning'}>
                        {doctor.status}
                      </Badge>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <p>Experience: {doctor.experience}</p>
                      <p>Fee: ${doctor.fee}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleOpenModal(doctor)}>
                    Edit
                  </Button>
                  {doctor.status === 'pending' && (
                    <>
                      <Button size="sm" variant="success" onClick={() => handleApprove(doctor.id)}>
                        Approve
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleReject(doctor.id)}>
                        Reject
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="ghost-danger" onClick={() => handleDelete(doctor.id)}>
                    Delete
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={handleCloseModal} title={editingDoctor ? 'Edit Doctor' : 'Add Doctor'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Doctor Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Select
            label="Specialty"
            name="specialty"
            value={formData.specialty}
            onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
            options={specialties.map((s) => ({ value: s, label: s }))}
            required
          />

          <Input
            label="Experience"
            name="experience"
            placeholder="e.g., 10 years"
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            required
          />

          <Input
            label="Consultation Fee ($)"
            name="fee"
            type="number"
            value={formData.fee}
            onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
            required
          />

          <Input
            label="Image URL"
            name="image"
            placeholder="https://..."
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows="3"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          {editingDoctor && (
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' },
              ]}
            />
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingDoctor ? 'Update' : 'Create'} Doctor
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageDoctors;
