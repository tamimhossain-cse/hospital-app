/**
 * Validation utilities for form inputs
 */

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

/**
 * Validates phone number (supports international formats)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if phone number has 10-15 digits
 */
export const validatePhone = (phone) => {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
};

/**
 * Validates that appointment date is not in the past
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if date is today or in the future
 */
export const validateAppointmentDate = (dateString) => {
  if (!dateString) return false;
  const selected = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected >= today;
};

/**
 * Checks password strength
 * @param {string} password - Password to check
 * @returns {object} Strength info with level (0-4) and label
 */
export const getPasswordStrength = (password) => {
  if (!password) return { level: 0, label: 'Enter a password' };

  let score = 0;

  // Length check
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // Character variety
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  // Normalize to 0-4 scale
  const level = Math.min(4, Math.floor(score * 0.8));

  const labels = {
    0: 'Weak',
    1: 'Weak',
    2: 'Fair',
    3: 'Good',
    4: 'Strong'
  };

  return { level, label: labels[level] };
};

/**
 * Validates password strength (minimum requirements)
 * @param {string} password - Password to validate
 * @returns {object} Validation result with isValid and errors array
 */
export const validatePassword = (password) => {
  const errors = [];

  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }

  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates that two passwords match
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {boolean} True if passwords match
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!password || !confirmPassword) return false;
  return password === confirmPassword;
};

/**
 * Generic required field validation
 * @param {string} value - Value to validate
 * @returns {boolean} True if value is not empty
 */
export const validateRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};
