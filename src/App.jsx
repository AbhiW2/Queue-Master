

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Welcome from "./welcome/welcome";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import UserDashboard from "./components/UserDashboard";
import StaffDashboard from "./components/StaffDashboard";
import AdminDashboard from "./components/AdminDashboard";
import HospitalList from "./components/HospitalList";
import HotelList from "./components/HotelList";
import BankList from "./components/BankList";
import GovtOfficeList from "./components/GovtOfficeList";
import DoctorList from "./components/DoctorList";
import BankServices from "./components/BankServices";
import GovernmentServices from "./components/GovermentServices";
import QueueStatus from "./components/QueueStatus";
import TicketHistory from "./components/TicketHistory";
import EstimatedWait from "./components/EstimatedWait";
import Appointments from "./components/Appointments";
import About from "./components/About";
import ViewQueue from "./components/ViewQueue";
import ServicesAndQueues from "./components/ServicesAndQueues";
import ManageCounters from "./components/ManageCounter";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  const handleLogin = (userRole) => {
    setIsLoggedIn(true);
    setRole(userRole);
  };

  return (
    <Router>
      <Routes>

        {/* 🌟 Welcome Page (First Page) */}
        <Route path="/" element={<Welcome />} />

        {/* 🔑 Login */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              role === "admin" ? (
                <Navigate to="/admin-dashboard" replace />
              ) : role === "staff" ? (
                <Navigate to="/staff-dashboard" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />

        {/* 📝 Signup */}
        <Route path="/signup" element={<SignUpPage />} />

        {/* 👤 User Dashboard */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn && role === "user"
              ? <UserDashboard />
              : <Navigate to="/login" replace />
          }
        />

        {/* 👨‍💼 Staff Dashboard */}
        <Route
          path="/staff-dashboard"
          element={
            isLoggedIn && role === "staff"
              ? <StaffDashboard />
              : <Navigate to="/login" replace />
          }
        />

        {/* 🛠 Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            isLoggedIn && role === "admin"
              ? <AdminDashboard />
              : <Navigate to="/login" replace />
          }
        />

        {/* 🏥 Services */}
        <Route path="/hospitals" element={isLoggedIn ? <HospitalList /> : <Navigate to="/login" />} />
        <Route path="/hotels" element={isLoggedIn ? <HotelList /> : <Navigate to="/login" />} />
        <Route path="/banks" element={isLoggedIn ? <BankList /> : <Navigate to="/login" />} />
        <Route path="/government-offices" element={isLoggedIn ? <GovtOfficeList /> : <Navigate to="/login" />} />

        <Route path="/hospitals/:hospitalId/doctors" element={isLoggedIn ? <DoctorList /> : <Navigate to="/login" />} />
        <Route path="/banks/:bankName/services" element={isLoggedIn ? <BankServices /> : <Navigate to="/login" />} />
        <Route path="/government-offices/:officeName/services" element={isLoggedIn ? <GovernmentServices /> : <Navigate to="/login" />} />

        {/* 📊 Other Pages */}
        <Route path="/queue-status" element={<QueueStatus />} />
        <Route path="/ticket-history" element={<TicketHistory />} />
        <Route path="/estimated-wait" element={<EstimatedWait />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/about" element={<About />} />
        <Route path="/view-queue" element={<ViewQueue />} />
        <Route path="/services-and-queues" element={<ServicesAndQueues />} />
        <Route path="/manage-counters" element={<ManageCounters />} />

      </Routes>
    </Router>
  );
}

export default App;
