import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';

const AdminLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="lg:pl-64 transition-all duration-300">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                  {getPageTitle(location.pathname)}
                </h1>
                <p className="text-xs lg:text-sm text-gray-500 mt-0.5 hidden sm:block">
                  Welcome back, {user?.email?.split('@')[0] || 'Admin'}
                </p>
              </div>
            </div>
            <Link
              to="/"
              className="text-sm lg:text-base text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">Back to Site</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </div>
        </header>

        {/* Main content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const getPageTitle = (pathname) => {
  const titles = {
    '/admin': 'Dashboard',
    '/admin/doctors': 'Manage Doctors',
    '/admin/patients': 'Manage Patients',
    '/admin/users': 'Manage Users',
    '/admin/appointments': 'Manage Appointments',
  };
  return titles[pathname] || 'Admin Panel';
};

export default AdminLayout;
