import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout, isAdmin, isDoctor, isPatient, userProfile } = useAuth();
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="bg-primary-600 text-white px-4 sm:px-6 py-3 shadow-md">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <svg
            className="w-8 h-8"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-bold text-lg hidden sm:inline">Hospital App</span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <Link to="/" className="hover:text-primary-100 transition-colors">
            Home
          </Link>

          {!user ? (
            <>
              <Link
                to="/login"
                className="hover:text-primary-100 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {/* Patient Links */}
              {isPatient && (
                <Link
                  to="/dashboard"
                  className="hover:text-primary-100 transition-colors"
                >
                  Dashboard
                </Link>
              )}

              {/* Doctor Links */}
              {isDoctor && (
                <>
                  <Link
                    to="/doctor"
                    className="hover:text-primary-100 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/doctor/profile"
                    className="hover:text-primary-100 transition-colors"
                  >
                    Profile
                  </Link>
                </>
              )}

              {/* Admin Dropdown */}
              {isAdmin && (
                <div className="relative">
                  <button
                    onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                    className="flex items-center gap-1 hover:text-primary-100 transition-colors"
                  >
                    <span>Admin Panel</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {adminDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                      <Link
                        to="/admin"
                        onClick={() => setAdminDropdownOpen(false)}
                        className="block px-4 py-2 text-gray-800 hover:bg-primary-50 hover:text-primary-600"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/admin/doctors"
                        onClick={() => setAdminDropdownOpen(false)}
                        className="block px-4 py-2 text-gray-800 hover:bg-primary-50 hover:text-primary-600"
                      >
                        Doctors
                      </Link>
                      <Link
                        to="/admin/patients"
                        onClick={() => setAdminDropdownOpen(false)}
                        className="block px-4 py-2 text-gray-800 hover:bg-primary-50 hover:text-primary-600"
                      >
                        Patients
                      </Link>
                      <Link
                        to="/admin/appointments"
                        onClick={() => setAdminDropdownOpen(false)}
                        className="block px-4 py-2 text-gray-800 hover:bg-primary-50 hover:text-primary-600"
                      >
                        Appointments
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* User Info & Logout */}
              <div className="flex items-center gap-3">
                <span className="text-sm bg-primary-500 px-3 py-1 rounded-full hidden sm:inline">
                  {userProfile?.name || user.email?.split("@")[0] || "User"}
                </span>

                <button
                  onClick={handleLogout}
                  className="bg-danger-500 hover:bg-danger-600 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;