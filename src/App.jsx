import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DoctorDetails from "./pages/DoctorDetails";
import AppointmentDetails from "./pages/AppointmentDetails";

// Admin Pages
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import ManageDoctors from "./pages/admin/ManageDoctors";
import ManagePatients from "./pages/admin/ManagePatients";
import ManageAppointments from "./pages/admin/ManageAppointments";
import ManageUsers from "./pages/admin/ManageUsers";

// Doctor Pages
import DoctorLayout from "./layouts/DoctorLayout";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorProfile from "./pages/doctor/DoctorProfile";

// Main Layout Component (with Navbar)
function MainLayout() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctor/:id" element={<DoctorDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />
          <Route
            path="/appointments/:id"
            element={<ProtectedRoute><AppointmentDetails /></ProtectedRoute>}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Admin Login - Full page without Navbar */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Routes - Separate layout without Navbar */}
      <Route
        path="/admin"
        element={
          <RoleProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </RoleProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="doctors" element={<ManageDoctors />} />
        <Route path="patients" element={<ManagePatients />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="appointments" element={<ManageAppointments />} />
      </Route>

      {/* Doctor Routes - Separate layout without Navbar */}
      <Route
        path="/doctor"
        element={
          <RoleProtectedRoute allowedRoles={["doctor"]} requireApproved={true}>
            <DoctorLayout />
          </RoleProtectedRoute>
        }
      >
        <Route index element={<DoctorDashboard />} />
        <Route path="profile" element={<DoctorProfile />} />
      </Route>

      {/* Main App Routes - With Navbar */}
      <Route path="/*" element={<MainLayout />} />
    </Routes>
  );
}

export default App;
