import React, { useState } from "react";
import "../styles/StaffDashboard.scss";

/* Icons */
import {
  FiMenu,
  FiBell,
  FiLogOut,
  FiUser,
  FiPlay,
  FiCheckCircle,
  FiClock,
  FiSkipForward,
  FiUsers,
  FiActivity
} from "react-icons/fi";

/* Assets */
import staffImg from "../assets/user.png"; 

const StaffDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeToken, setActiveToken] = useState({ id: "A-102", name: "John Doe", service: "General Inquiry", waitTime: "12 mins" });

  // Mock data for the local queue
  const upcomingTokens = [
    { id: "A-103", service: "Account Opening" },
    { id: "A-104", service: "General Inquiry" },
    { id: "A-105", service: "Consultation" },
  ];

  return (
    <div className="admin-wrapper staff-view">
      {/* ================= TOP NAVBAR ================= */}
      <nav className="admin-navbar">
        <div className="nav-left">
          <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FiMenu />
          </button>
          <div className="app-logo">
            <span>Q</span>
            <strong>StaffConsole</strong>
          </div>
        </div>

        <div className="nav-right">
          <div className="counter-badge">Counter 04</div>
          <FiBell className="nav-icon" />
          <div className="admin-profile">
            <img src={staffImg} alt="staff" />
            <span>Staff Member</span>
          </div>
        </div>
      </nav>

      {/* ================= SIDEBAR ================= */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="profile-mini">
          <img src={staffImg} alt="staff" />
          <h4>Staff Admin</h4>
          <span>Front Desk Console</span>
        </div>
        <ul className="nav-links">
          <li className="active"><FiActivity /> My Station</li>
          <li><FiUsers /> View Queue</li>
          <li className="logout"><FiLogOut /> Logout</li>
        </ul>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className={`admin-main ${!sidebarOpen ? "full-width" : ""}`}>
        <div className="welcome-header">
          <h2>Counter 04 Console</h2>
          <p>Manage your active service and queue flow.</p>
        </div>

        <div className="staff-layout">
          {/* PRIMARY SERVICE CONSOLE */}
          <section className="service-console">
            <div className="console-card">
              <span className="status-label">Now Serving</span>
              <h1 className="active-token-id">{activeToken.id}</h1>
              <div className="customer-info">
                <h4>{activeToken.name}</h4>
                <p>{activeToken.service} • Wait: {activeToken.waitTime}</p>
              </div>

              <div className="action-grid">
                {/* 1. CALL NEXT TOKEN */}
                <button className="staff-btn call" title="Call Next Token">
                  <FiPlay /> Call Next
                </button>

                {/* 2. MARK SERVED */}
                <button className="staff-btn serve" title="Mark as Served">
                  <FiCheckCircle /> Mark Served
                </button>

                {/* 3. HOLD / SKIP */}
                <button className="staff-btn hold" title="Hold Token">
                  <FiClock /> Hold
                </button>
                <button className="staff-btn skip" title="Skip Token">
                  <FiSkipForward /> Skip
                </button>
              </div>
            </div>
          </section>

          {/* UPCOMING QUEUE PANEL */}
          <aside className="queue-panel">
            <div className="panel-header">
              <h3>Upcoming Queue</h3>
              <span className="count-pill">12 Left</span>
            </div>
            <div className="token-list">
              {upcomingTokens.map((t, i) => (
                <div key={i} className="token-item">
                  <div className="token-id">{t.id}</div>
                  <div className="token-details">
                    <p>{t.service}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;






