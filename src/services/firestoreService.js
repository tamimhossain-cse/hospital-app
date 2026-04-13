import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getFirestore,
} from 'firebase/firestore';
import { db } from '../firebase/config';

// ==================== USERS ====================

export const createUserProfile = async (userData) => {
  try {
    const docRef = await addDoc(collection(db, 'users'), {
      ...userData,
      createdAt: serverTimestamp(),
    });
    return docRef;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (uid) => {
  try {
    const q = query(collection(db, 'users'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, data) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, data);
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const getAllUsers = async (role = null) => {
  try {
    let q = collection(db, 'users');
    if (role) {
      q = query(collection(db, 'users'), where('role', '==', role));
    }
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

export const blockUser = async (userId, isBlocked) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { isBlocked });
    return true;
  } catch (error) {
    console.error('Error blocking user:', error);
    throw error;
  }
};

// ==================== DOCTORS ====================

export const createDoctorProfile = async (doctorData) => {
  try {
    const docRef = await addDoc(collection(db, 'doctors'), {
      ...doctorData,
      createdAt: serverTimestamp(),
    });
    return docRef;
  } catch (error) {
    console.error('Error creating doctor profile:', error);
    throw error;
  }
};

export const getDoctorProfile = async (doctorId) => {
  try {
    const docRef = doc(db, 'doctors', doctorId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting doctor profile:', error);
    throw error;
  }
};

export const getDoctorByUserId = async (userId) => {
  try {
    const q = query(collection(db, 'doctors'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('Error getting doctor by user ID:', error);
    throw error;
  }
};

export const getAllDoctors = async (status = null) => {
  try {
    let q = collection(db, 'doctors');
    if (status) {
      q = query(collection(db, 'doctors'), where('status', '==', status));
    }
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting all doctors:', error);
    throw error;
  }
};

export const updateDoctorProfile = async (doctorId, data) => {
  try {
    const doctorRef = doc(db, 'doctors', doctorId);
    await updateDoc(doctorRef, data);
    return true;
  } catch (error) {
    console.error('Error updating doctor profile:', error);
    throw error;
  }
};

export const deleteDoctorProfile = async (doctorId) => {
  try {
    await deleteDoc(doc(db, 'doctors', doctorId));
    return true;
  } catch (error) {
    console.error('Error deleting doctor profile:', error);
    throw error;
  }
};

export const approveDoctor = async (doctorId) => {
  return updateDoctorProfile(doctorId, { status: 'approved' });
};

export const rejectDoctor = async (doctorId) => {
  return updateDoctorProfile(doctorId, { status: 'rejected' });
};

// ==================== APPOINTMENTS ====================

export const createAppointment = async (appointmentData) => {
  try {
    const docRef = await addDoc(collection(db, 'appointments'), {
      ...appointmentData,
      status: appointmentData.status || 'pending',
      createdAt: serverTimestamp(),
    });
    return docRef;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

export const getAppointment = async (appointmentId) => {
  try {
    const docRef = doc(db, 'appointments', appointmentId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting appointment:', error);
    throw error;
  }
};

export const getAppointmentsByPatient = async (patientEmail) => {
  try {
    const q = query(
      collection(db, 'appointments'),
      where('userEmail', '==', patientEmail)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting patient appointments:', error);
    throw error;
  }
};

export const getAppointmentsByDoctor = async (doctorName) => {
  try {
    const q = query(
      collection(db, 'appointments'),
      where('doctorName', '==', doctorName)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting doctor appointments:', error);
    throw error;
  }
};

export const getAllAppointments = async (filters = {}) => {
  try {
    let q = collection(db, 'appointments');

    // Apply filters if provided
    const constraints = [];
    if (filters.status) {
      constraints.push(where('status', '==', filters.status));
    }
    if (filters.doctorName) {
      constraints.push(where('doctorName', '==', filters.doctorName));
    }
    if (filters.userEmail) {
      constraints.push(where('userEmail', '==', filters.userEmail));
    }

    if (constraints.length > 0) {
      q = query(collection(db, 'appointments'), ...constraints);
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting all appointments:', error);
    throw error;
  }
};

export const updateAppointment = async (appointmentId, data) => {
  try {
    const appointmentRef = doc(db, 'appointments', appointmentId);
    await updateDoc(appointmentRef, data);
    return true;
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
};

export const deleteAppointment = async (appointmentId) => {
  try {
    await deleteDoc(doc(db, 'appointments', appointmentId));
    return true;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
};

// Appointment status helpers
export const confirmAppointment = (appointmentId) => {
  return updateAppointment(appointmentId, { status: 'confirmed' });
};

export const completeAppointment = (appointmentId) => {
  return updateAppointment(appointmentId, { status: 'completed' });
};

export const cancelAppointment = (appointmentId) => {
  return updateAppointment(appointmentId, { status: 'cancelled' });
};

// Real-time listeners
export const subscribeToAppointments = (patientEmail, callback) => {
  const q = query(
    collection(db, 'appointments'),
    where('userEmail', '==', patientEmail)
  );
  return onSnapshot(q, (snapshot) => {
    const appointments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(appointments);
  });
};

export const subscribeToDoctorAppointments = (doctorName, callback) => {
  const q = query(
    collection(db, 'appointments'),
    where('doctorName', '==', doctorName)
  );
  return onSnapshot(q, (snapshot) => {
    const appointments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(appointments);
  });
};

// ==================== STATS ====================

export const getStats = async () => {
  try {
    const [usersSnapshot, doctorsSnapshot, appointmentsSnapshot] = await Promise.all([
      getDocs(collection(db, 'users')),
      getDocs(collection(db, 'doctors')),
      getDocs(collection(db, 'appointments')),
    ]);

    const users = usersSnapshot.docs.map((doc) => doc.data());
    const doctors = doctorsSnapshot.docs.map((doc) => doc.data());
    const appointments = appointmentsSnapshot.docs.map((doc) => doc.data());

    const pendingDoctors = doctors.filter((d) => d.status === 'pending').length;
    const pendingAppointments = appointments.filter((a) => a.status === 'pending').length;

    return {
      totalUsers: users.length,
      totalDoctors: doctors.length,
      totalAppointments: appointments.length,
      pendingDoctors,
      pendingAppointments,
    };
  } catch (error) {
    console.error('Error getting stats:', error);
    throw error;
  }
};
