import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout, isAdmin, isDoctor, isPatient, userProfile } = useAuth();
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Smooth scroll to section when hash changes
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const handleScrollTo = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    // Close mobile menu if open
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Doctors', href: '#doctors' },
    { name: 'Contact', href: '#contact' },
  ];

  const isHomePage = location.pathname === '/' || location.pathname === '/#';

  return (
    <nav className="bg-primary-600 text-white px-4 sm:px-6 py-3 shadow-md sticky top-0 z-50">
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

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Homepage Section Links */}
          {isHomePage && navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href.slice(1))}
              className="hover:text-primary-100 transition-colors"
            >
              {link.name}
            </a>
          ))}

          {/* Admin Login Link (visible to everyone) */}
          <Link
            to="/admin/login"
            className="hover:text-primary-100 transition-colors text-sm font-medium text-primary-200"
          >
            Admin
          </Link>
        </div>

        {/* Auth Section - Desktop */}
        <div className="hidden lg:flex items-center gap-4">
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
                        to="/admin/users"
                        onClick={() => setAdminDropdownOpen(false)}
                        className="block px-4 py-2 text-gray-800 hover:bg-primary-50 hover:text-primary-600"
                      >
                        Users
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-4 pb-4 border-t border-primary-500 pt-4 space-y-3">
          {/* Homepage Section Links */}
          {isHomePage && navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href.slice(1))}
              className="block hover:text-primary-100 transition-colors py-2"
            >
              {link.name}
            </a>
          ))}

          <div className="border-t border-primary-500 pt-3 mt-3">
            {!user ? (
              <div className="space-y-3">
                <Link
                  to="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block hover:text-primary-100 transition-colors py-2 text-primary-200"
                >
                  Admin
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block hover:text-primary-100 transition-colors py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block bg-white text-primary-600 px-4 py-2 rounded-lg font-medium text-center"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {isPatient && (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block hover:text-primary-100 transition-colors py-2"
                  >
                    Dashboard
                  </Link>
                )}

                {isDoctor && (
                  <>
                    <Link
                      to="/doctor"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block hover:text-primary-100 transition-colors py-2"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/doctor/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block hover:text-primary-100 transition-colors py-2"
                    >
                      Profile
                    </Link>
                  </>
                )}

                {isAdmin && (
                  <>
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block hover:text-primary-100 transition-colors py-2"
                    >
                      Admin Dashboard
                    </Link>
                    <Link
                      to="/admin/doctors"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block hover:text-primary-100 transition-colors py-2"
                    >
                      Doctors
                    </Link>
                    <Link
                      to="/admin/users"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block hover:text-primary-100 transition-colors py-2"
                    >
                      Users
                    </Link>
                    <Link
                      to="/admin/appointments"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block hover:text-primary-100 transition-colors py-2"
                    >
                      Appointments
                    </Link>
                  </>
                )}

                <div className="flex items-center gap-3 py-2 border-t border-primary-500">
                  <span className="text-sm bg-primary-500 px-3 py-1 rounded-full">
                    {userProfile?.name || user.email?.split("@")[0] || "User"}
                  </span>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="bg-danger-500 hover:bg-danger-600 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
