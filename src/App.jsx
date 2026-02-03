
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

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


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(""); // ✅ NEW

  const handleLogin = (userRole) => {
    setIsLoggedIn(true);
    setRole(userRole);
  };

  return (
    <Router>
      <Routes>
        {/* SIGN UP */}
        <Route path="/signup" element={<SignUpPage />} />

        {/* LOGIN */}
        <Route
          path="/"
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

        {/* USER DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn && role === "user" ? (
              <UserDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* STAFF DASHBOARD */}
        <Route
          path="/staff-dashboard"
          element={
            isLoggedIn && role === "staff" ? (
              <StaffDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin-dashboard"
          element={
            isLoggedIn && role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* OTHER ROUTES */}
        <Route
          path="/hospitals"
          element={isLoggedIn ? <HospitalList /> : <Navigate to="/" replace />}
        />
        <Route
          path="/hotels"
          element={isLoggedIn ? <HotelList /> : <Navigate to="/" replace />}
        />
        <Route
          path="/banks"
          element={isLoggedIn ? <BankList /> : <Navigate to="/" replace />}
        />
        <Route
          path="/government-offices"
          element={isLoggedIn ? <GovtOfficeList /> : <Navigate to="/" replace />}
        />
        {/* DOCTOR LIST FOR SELECTED HOSPITAL */}
<Route
  path="/hospitals/:hospitalId/doctors"
  element={isLoggedIn ? <DoctorList /> : <Navigate to="/" replace />}
/>
<Route
  path="/banks/:bankName/services"
  element={isLoggedIn ? <BankServices /> : <Navigate to="/" replace />}
/>
<Route
  path="/government-offices/:officeName/services"
  element={isLoggedIn ? <GovernmentServices /> : <Navigate to="/" replace />}
/>

<Route path="/queue-status" element={<QueueStatus />} />
<Route path="/ticket-history" element={<TicketHistory />} />
      </Routes>
    </Router>
  );
}

export default App;




