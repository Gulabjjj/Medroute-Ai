import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import VerifyEmail from "../pages/VerifyEmail";
import Profile from "../pages/Profile";
import Dashboard from "../pages/Dashboard";
import Hospitals from "../pages/Hospitals";
import Doctors from "../pages/Doctors";
import Appointments from "../pages/Appointments";
import ChatBot from "../pages/ChatBot";
import UploadReport from "../pages/UploadReport";
import ChatHistory from "../pages/ChatHistory";
import ReportHistory from "../pages/ReportHistory";
import Emergency from "../pages/Emergency";
import DoctorDashboard from "../pages/DoctorDashboard";
import DoctorPatients from "../pages/DoctorPatients";
import AdminDashboard from "../pages/AdminDashboard";
import ManageDoctors from "../pages/ManageDoctors";
import ManageHospitals from "../pages/ManageHospitals";
import ManageUsers from "../pages/ManageUsers";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/register"
        element={<Register />}
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hospitals"
        element={
          <ProtectedRoute>
            <Hospitals />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctors"
        element={
          <ProtectedRoute>
            <Doctors />
          </ProtectedRoute>
        }
      />

      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <Appointments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatBot />
          </ProtectedRoute>
        }
      />

      <Route
        path="/upload-report"
        element={
          <ProtectedRoute>
            <UploadReport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat-history"
        element={
          <ProtectedRoute>
          <ChatHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/report-history"
        element={
         <ProtectedRoute>
           <ReportHistory />
         </ProtectedRoute>
        }
      />
      <Route
         path="/emergency"
        element={
         <ProtectedRoute>
          <Emergency />
        </ProtectedRoute>
       }
      />
      <Route
  path="/doctor-dashboard"
  element={
    <ProtectedRoute>
      <DoctorDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/doctor-patients"
  element={
    <ProtectedRoute>
      <DoctorPatients />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin-dashboard"
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/manage-doctors"
  element={<ManageDoctors />}
/>

<Route
  path="/manage-hospitals"
  element={<ManageHospitals />}
/>

<Route
  path="/manage-users"
  element={<ManageUsers />}
/>
    </Routes>
  );
}

export default AppRoutes;