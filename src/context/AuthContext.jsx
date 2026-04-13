import { createContext, useContext, useEffect, useState } from "react";
import { onAuthChange, loginUser, logoutUser, registerUser } from "../firebase/auth";
import { getUserProfile } from "../services/firestoreService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const profile = await getUserProfile(currentUser.uid);
          if (profile) {
            setUserProfile(profile);
            setUserRole(profile.role || 'patient');
          } else {
            // Create default profile if none exists
            setUserProfile({
              uid: currentUser.uid,
              email: currentUser.email,
              role: 'patient',
              isBlocked: false,
            });
            setUserRole('patient');
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUserRole('patient');
        }
      } else {
        setUserProfile(null);
        setUserRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    return await loginUser(email, password);
  };

  const logout = async () => {
    return await logoutUser();
  };

  const register = async (email, password) => {
    return await registerUser(email, password);
  };

  const refreshUserProfile = async () => {
    if (user) {
      try {
        const profile = await getUserProfile(user.uid);
        if (profile) {
          setUserProfile(profile);
          setUserRole(profile.role || 'patient');
        }
      } catch (error) {
        console.error('Error refreshing user profile:', error);
      }
    }
  };

  // Role helper functions
  const isAdmin = userRole === 'admin';
  const isDoctor = userRole === 'doctor';
  const isPatient = userRole === 'patient';
  const hasRole = (role) => userRole === role;

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        userRole,
        login,
        logout,
        register,
        loading,
        refreshUserProfile,
        isAdmin,
        isDoctor,
        isPatient,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);