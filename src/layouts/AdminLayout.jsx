import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';

const AdminLayout = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {getPageTitle(location.pathname)}
              </h1>
              <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.email}</p>
            </div>
            <Link
              to="/"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Back to Site
            </Link>
          </div>
        </header>

        {/* Main content */}
        <main className="p-6">
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
    '/admin/appointments': 'Manage Appointments',
  };
  return titles[pathname] || 'Admin Panel';
};

export default AdminLayout;
