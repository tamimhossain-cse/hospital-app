import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DoctorLayout = () => {
  const { user, userProfile } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="lg:flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64">
          <div className="flex flex-col flex-grow bg-success-900 pt-5 pb-4 overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center justify-center px-6 mb-6">
              <div className="flex items-center gap-2">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xl font-bold text-white">Doctor Portal</span>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="px-6 mb-6">
              <div className="bg-success-800 rounded-lg p-4">
                <p className="text-success-100 text-sm">Welcome,</p>
                <p className="text-white font-semibold">{userProfile?.name || 'Doctor'}</p>
                <p className="text-success-200 text-sm">{userProfile?.specialty || 'Specialist'}</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1">
              <Link
                to="/doctor"
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${location.pathname === '/doctor'
                    ? 'bg-success-800 text-white'
                    : 'text-success-100 hover:bg-success-800 hover:text-white'
                  }
                `}
              >
                <DashboardIcon className="w-5 h-5" />
                Dashboard
              </Link>
              <Link
                to="/doctor/profile"
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${location.pathname === '/doctor/profile'
                    ? 'bg-success-800 text-white'
                    : 'text-success-100 hover:bg-success-800 hover:text-white'
                  }
                `}
              >
                <ProfileIcon className="w-5 h-5" />
                My Profile
              </Link>
            </nav>

            {/* Logout */}
            <div className="px-3 pt-4 mt-4 border-t border-success-800">
              <Link
                to="/"
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-success-100 hover:bg-success-800 hover:text-white transition-colors"
              >
                <HomeIcon className="w-5 h-5" />
                Back to Home
              </Link>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 lg:ml-64">
          <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                {location.pathname === '/doctor' ? 'Dashboard' : 'My Profile'}
              </h1>
            </div>
          </header>
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

// Icons
const DashboardIcon = () => (
  <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ProfileIcon = () => (
  <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const HomeIcon = () => (
  <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

export default DoctorLayout;
