import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const RoleProtectedRoute = ({
  children,
  allowedRoles = [],
  requireApproved = false,
}) => {
  const { user, userRole, loading, userProfile } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      setIsChecking(false);
    }
  }, [loading]);

  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    // Check if this is an admin route - redirect to admin login
    const isAdminRoute = allowedRoles.includes('admin');
    return <Navigate to={isAdminRoute ? '/admin/login' : '/login'} replace />;
  }

  // User is blocked
  if (userProfile?.isBlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-8 rounded-xl shadow-md max-w-md">
          <svg
            className="w-16 h-16 text-danger-500 mx-auto mb-4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Blocked</h2>
          <p className="text-gray-600 mb-4">
            Your account has been blocked. Please contact support for assistance.
          </p>
        </div>
      </div>
    );
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-8 rounded-xl shadow-md max-w-md">
          <svg
            className="w-16 h-16 text-warning-500 mx-auto mb-4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
          </p>
          <Navigate to="/dashboard" replace />
        </div>
      </div>
    );
  }

  // Check if doctor is approved (for doctor routes)
  if (requireApproved && userRole === 'doctor' && userProfile?.status !== 'approved') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-8 rounded-xl shadow-md max-w-md">
          <svg
            className="w-16 h-16 text-warning-500 mx-auto mb-4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Pending Approval</h2>
          <p className="text-gray-600 mb-4">
            Your doctor account is pending approval from an administrator.
            You'll be notified once your account is approved.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default RoleProtectedRoute;
