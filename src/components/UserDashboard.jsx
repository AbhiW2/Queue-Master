

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UserDashboard.scss";

/* Icons */
import {
  FiMenu,
  FiClipboard,
  FiList,
  FiClock,
  FiFileText,
  FiBell,
  FiCalendar,
  FiLogOut
} from "react-icons/fi";

/* Images */
import hospitalImg from "../assets/hospital.jpg";
import hotelImg from "../assets/hotel.jpg";
import bankImg from "../assets/bank.jpg";
import govtImg from "../assets/govt.jpg";
import userImg from "../assets/user.png";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const services = [
    { title: "Hospital Services", image: hospitalImg },
    { title: "Banking Services", image: bankImg },
    { title: "Government Office", image: govtImg },
    { title: "Hotel Services", image: hotelImg }
  ];

  const handleLogout = () => {
    navigate("/logout");
  };

  const handleGetToken = (service) => {
    if (service === "Hospital Services") navigate("/hospitals");
    if (service === "Banking Services") navigate("/banks");
    if (service === "Government Office") navigate("/government-offices");
    if (service === "Hotel Services") navigate("/hotels");
  };

  return (
    <div className="dashboard-wrapper">
      {/* ================= TOP NAVBAR ================= */}
      <nav className="top-navbar">
        <div className="nav-left">
          <button
            className="menu-btn"
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FiMenu />
          </button>

          <div className="app-logo">
            <strong>QueueMaster</strong>
          </div>
        </div>

        <div className="nav-center">
          <input type="text" placeholder="Search queues..." />
        </div>

        <div className="nav-right">
          <FiBell className="nav-icon" />
          <img src={userImg} alt="user" />
          <span>Abhi</span>
        </div>
      </nav>

      {/* ================= SIDEBAR ================= */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">Q</div>
          <h3>QueueMaster</h3>
        </div>

        <div className="profile">
          <img src={userImg} alt="user" />
          <h4>Abhi</h4>
          <span>Active User</span>
        </div>

        <ul>
          <li onClick={() => navigate("/queue-status")}>
            <FiClipboard /> Queue Status
          </li>

          <li onClick={() => navigate("/ticket-history")}>
            <FiList /> Ticket History
          </li>

          <li onClick={() => navigate("/estimated-wait")}>
            <FiClock /> Estimated Wait
          </li>

          <li onClick={() => navigate("/appointments")}>
            <FiCalendar /> Appointments
          </li>

          <li className="logout" onClick={handleLogout}>
            <FiLogOut /> Logout
          </li>
        </ul>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className={`main-content ${sidebarOpen ? "shift" : ""}`}>
        <div className="welcome-box">
          <h2>Welcome to Queue Master 👋</h2>
          <p>Manage your queues, tokens and appointments easily</p>
        </div>

        <div className="summary-grid">
          <div className="summary-card blue">
            <FiClipboard className="icon" />
            <div>
              <h4>Current Queue</h4>
              <span>A21</span>
            </div>
          </div>

          <div className="summary-card green">
            <FiList className="icon" />
            <div>
              <h4>Pending Tickets</h4>
              <span>14</span>
            </div>
          </div>

          <div className="summary-card yellow">
            <FiClock className="icon" />
            <div>
              <h4>Estimated Wait</h4>
              <span>25 mins</span>
            </div>
          </div>

          <div className="summary-card pink">
            <FiFileText className="icon" />
            <div>
              <h4>Total Visits</h4>
              <span>12</span>
            </div>
          </div>
        </div>

        <div className="extra-info">
          <div className="info-card">
            <FiBell />
            <div>
              <h4>Notifications</h4>
              <p>No new alerts</p>
            </div>
          </div>

          <div className="info-card">
            <FiCalendar />
            <div>
              <h4>Next Appointment</h4>
              <p>Tomorrow · 11:30 AM</p>
            </div>
          </div>
        </div>

        <h3 className="section-title">Available Services</h3>

        <div className="services-grid">
          {services.map((s) => (
            <div className="service-card" key={s.title}>
              <img src={s.image} alt={s.title} />
              <h4>{s.title}</h4>
              <button onClick={() => handleGetToken(s.title)}>
                Get Token
              </button>
            </div>
          ))}
        </div>

        {/* ================= FOOTER ================= */}
        <footer className="pro-footer">
          <div className="footer-container">
            <div className="footer-top">
              <div className="footer-brand">
                <h2>QueueMaster</h2>
                <p>Enterprise Queue & Appointment Management System</p>
                <p className="footer-tagline">
                  Streamlining public and private service experiences.
                </p>
              </div>

              <div className="footer-links">
                <div className="footer-column">
                  <h4>Company</h4>
                  <a href="#">About Us</a>
                  <a href="#">Careers</a>
                  <a href="#">Press</a>
                  <a href="#">Blog</a>
                </div>

                <div className="footer-column">
                  <h4>Services</h4>
                  <a href="#">Hospitals</a>
                  <a href="#">Banks</a>
                  <a href="#">Government</a>
                  <a href="#">Hotels</a>
                </div>

                <div className="footer-column">
                  <h4>Support</h4>
                  <a href="#">Help Center</a>
                  <a href="#">Contact Support</a>
                  <a href="#">System Status</a>
                  <a href="#">FAQs</a>
                </div>

                <div className="footer-column">
                  <h4>Legal</h4>
                  <a href="#">Privacy Policy</a>
                  <a href="#">Terms of Service</a>
                  <a href="#">Security</a>
                  <a href="#">Compliance</a>
                </div>
              </div>
            </div>

            <div className="footer-divider"></div>

            <div className="footer-bottom">
              <p>
                © {new Date().getFullYear()} <strong>QueueMaster Technologies Pvt. Ltd.</strong> All rights reserved.
              </p>

              <div className="footer-badges">
                <span>🔒 Secure Platform</span>
                <span>✔ ISO 27001 Certified</span>
                <span>🌐 Trusted by Organizations</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default UserDashboard;
