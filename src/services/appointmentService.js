import {
  createAppointment,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
  getAllAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  confirmAppointment,
  completeAppointment,
  cancelAppointment,
  subscribeToAppointments,
  subscribeToDoctorAppointments,
} from './firestoreService';

// Re-export all appointment functions
export {
  createAppointment,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
  getAllAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  confirmAppointment,
  completeAppointment,
  cancelAppointment,
  subscribeToAppointments,
  subscribeToDoctorAppointments,
};

// Helper function to check if a date is valid for booking (not in the past)
export const isValidAppointmentDate = (dateString) => {
  const selectedDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
};

// Helper function to format appointment date for display
export const formatAppointmentDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Helper function to get status badge variant
export const getStatusBadgeVariant = (status) => {
  const statusMap = {
    pending: 'pending',
    confirmed: 'confirmed',
    completed: 'completed',
    cancelled: 'cancelled',
  };
  return statusMap[status] || 'default';
};

// Helper function to get status color
export const getStatusColor = (status) => {
  const colorMap = {
    pending: 'text-warning-600',
    confirmed: 'text-success-600',
    completed: 'text-primary-600',
    cancelled: 'text-danger-600',
  };
  return colorMap[status] || 'text-gray-600';
};

// Helper function to get status background color
export const getStatusBgColor = (status) => {
  const colorMap = {
    pending: 'bg-warning-50',
    confirmed: 'bg-success-50',
    completed: 'bg-primary-50',
    cancelled: 'bg-danger-50',
  };
  return colorMap[status] || 'bg-gray-50';
};
