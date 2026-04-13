import { useState, useEffect } from 'react';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Select from '../../components/ui/Select';
import { getDoctorByUserId, updateDoctorProfile } from '../../services/firestoreService';
import { useAuth } from '../../context/AuthContext';

const DoctorProfile = () => {
  const { user, refreshUserProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    experience: '',
    fee: '',
    bio: '',
    image: '',
  });
  const [saving, setSaving] = useState(false);

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
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user?.uid) return;

    try {
      const data = await getDoctorByUserId(user.uid);
      if (data) {
        setProfile(data);
        setFormData({
          name: data.name || '',
          specialty: data.specialty || '',
          experience: data.experience || '',
          fee: data.fee || '',
          bio: data.bio || '',
          image: data.image || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDoctorProfile(profile.id, {
        ...formData,
        fee: Number(formData.fee),
      });
      setProfile({ ...profile, ...formData });
      setEditing(false);
      refreshUserProfile();
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile.name || '',
      specialty: profile.specialty || '',
      experience: profile.experience || '',
      fee: profile.fee || '',
      bio: profile.bio || '',
      image: profile.image || '',
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-success-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
        <p className="text-gray-500">Your doctor profile has not been created yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">My Profile</h2>
            {!editing ? (
              <Button variant="primary" onClick={() => setEditing(true)}>
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel} disabled={saving}>
                  Cancel
                </Button>
                <Button variant="success" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex items-start gap-6 mb-6">
            <img
              src={formData.image || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <Badge variant={profile.status === 'approved' ? 'success' : profile.status === 'rejected' ? 'danger' : 'warning'}>
                {profile.status || 'pending'}
              </Badge>
              <p className="text-sm text-gray-500 mt-2">
                {profile.status === 'approved'
                  ? 'Your account is approved and visible to patients.'
                  : profile.status === 'pending'
                  ? 'Your account is pending admin approval.'
                  : 'Your account has been rejected.'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {editing ? (
              <>
                <Input
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />

                <Select
                  label="Specialty"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  options={specialties.map((s) => ({ value: s, label: s }))}
                />

                <Input
                  label="Experience"
                  placeholder="e.g., 10 years"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                />

                <Input
                  label="Consultation Fee ($)"
                  type="number"
                  value={formData.fee}
                  onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                />

                <Input
                  label="Image URL"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />

                <TextArea
                  label="Bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows="4"
                  placeholder="Tell patients about yourself..."
                />
              </>
            ) : (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="text-gray-900 mt-1">{profile.name || 'N/A'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Specialty</label>
                  <p className="text-gray-900 mt-1">{profile.specialty || 'N/A'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Experience</label>
                  <p className="text-gray-900 mt-1">{profile.experience || 'N/A'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Consultation Fee</label>
                  <p className="text-gray-900 mt-1">${profile.fee || 'N/A'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Bio</label>
                  <p className="text-gray-900 mt-1">{profile.bio || 'No bio provided'}</p>
                </div>
              </>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default DoctorProfile;
