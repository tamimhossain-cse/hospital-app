import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = ({ isOpen = false, setIsOpen = () => {} }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: DashboardIcon },
    { path: '/admin/appointments', label: 'Appointments', icon: AppointmentsIcon },
    { path: '/admin/doctors', label: 'Doctors', icon: DoctorsIcon },
    { path: '/admin/patients', label: 'Patients', icon: PatientsIcon },
    { path: '/admin/users', label: 'Users', icon: UsersIcon },
  ];

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={`
          fixed inset-0 z-50 lg:hidden
          ${isOpen ? 'block' : 'hidden'}
        `}
      >
        <div
          className={`
            fixed inset-0 bg-gray-900/50 backdrop-blur-sm
            ${isOpen ? 'block' : 'hidden'}
          `}
          onClick={() => setIsOpen(false)}
        ></div>
        <div
          className={`
            fixed inset-y-0 left-0 w-72 bg-gray-900
            transform transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <SidebarContent menuItems={menuItems} location={location} logout={logout} setIsOpen={setIsOpen} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-72">
        <SidebarContent menuItems={menuItems} location={location} logout={logout} setIsOpen={setIsOpen} />
      </aside>
    </>
  );
};

const SidebarContent = ({ menuItems, location, logout, setIsOpen }) => (
  <div className="flex flex-col h-full bg-gray-900">
    {/* Logo */}
    <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
      <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H9m2 0h5M9 7h1m-1 4h1m4-4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <span className="text-lg font-bold text-white">Hospital Admin</span>
    </div>

    {/* Navigation */}
    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
              ${isActive
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }
            `}
          >
            <span className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
              <item.icon />
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>

    {/* Logout */}
    <div className="px-4 pb-6 pt-4 border-t border-gray-800">
      <button
        onClick={() => {
          logout();
          setIsOpen(false);
        }}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
      >
        <span className="w-5 h-5 text-gray-400 group-hover:text-red-400 flex-shrink-0">
          <LogoutIcon />
        </span>
        Logout
      </button>
    </div>

    {/* User info */}
    <div className="px-6 pb-6 pt-4 border-t border-gray-800">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">Admin User</p>
          <p className="text-xs text-gray-500 truncate">Administrator</p>
        </div>
      </div>
    </div>
  </div>
);

// Icons (optimized size - w-5 h-5 = 20x20)
const DashboardIcon = () => (
  <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const DoctorsIcon = () => (
  <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PatientsIcon = () => (
  <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const AppointmentsIcon = () => (
  <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UsersIcon = () => (
  <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const LogoutIcon = () => (
  <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export default AdminSidebar;
