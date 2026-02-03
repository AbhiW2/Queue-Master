import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import "../styles/AdminDashboard.scss";

/* Icons */
import {
  FiMenu,
  FiGrid,
  FiUsers,
  FiActivity,
  FiSettings,
  FiBell,
  FiLogOut,
  FiSearch,
  FiChevronRight,
  FiAlertCircle
} from "react-icons/fi";

/* Assets */
import adminImg from "../assets/user.png";

const AdminDashboard = () => {
  // CHANGED: Initial state is now false so it stays hidden on load
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock Data for the Table
  const counters = [
    { id: 1, token: "A102", status: "Priority", type: "orange" },
    { id: 2, token: "B053", status: "", type: "blue" },
    { id: 3, token: "C021", status: "", type: "blue" },
    { id: 4, token: "Offline", status: "Offline", type: "red" },
  ];

  return (
    <div className="admin-wrapper">
      {/* ================= TOP NAVBAR ================= */}
      <nav className="admin-navbar">
        <div className="nav-left">
          {/* This button toggles the sidebar state */}
          <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FiMenu />
          </button>
          <div className="app-logo">
            <span>Q</span>
            <strong>QueueMaster</strong>
          </div>
        </div>

        <div className="nav-center">
          <div className="search-bar">
            <FiSearch />
            <input type="text" placeholder="Search queues, services..." />
          </div>
        </div>

        <div className="nav-right">
          <div className="system-status">
            System Status: <span className="online-dot">Online</span>
          </div>
          <div className="admin-profile">
            <img src={adminImg} alt="admin" />
            <span>Admin</span>
          </div>
        </div>
      </nav>

      {/* ================= SIDEBAR ================= */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="profile-mini">
          <img src={adminImg} alt="admin" />
          <h4>Admin</h4>
          <span>Queue Manager</span>
        </div>

        <ul className="nav-links">
          <li className="active"><FiGrid /> Dashboard</li>
          <li><FiActivity /> Services & Queues</li>
          <li><FiUsers /> Manage Counters</li>
          <li><FiSettings /> Priority Policies</li>
          <li><FiActivity /> Reports & Analytics</li>
          <li className="logout"><FiLogOut /> Logout</li>
        </ul>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      {/* The "full-width" class is applied when sidebarOpen is false, 
          which removes the left margin defined in your SCSS.
      */}
      <main className={`admin-main ${!sidebarOpen ? "full-width" : ""}`}>
        <div className="welcome-header">
          <h2>Welcome back, Admin!</h2>
          <p>Manage queues, counters, and optimize your services.</p>
        </div>

        {/* Stats Row */}
        <div className="admin-stats-grid">
          <div className="stat-card blue">
            <div className="stat-val"><h3>5</h3><span>Active Queues</span></div>
            <div className="stat-bg-icon"><FiActivity /></div>
          </div>
          <div className="stat-card cyan">
            <div className="stat-val"><h3>52</h3><span>Waiting Tokens</span></div>
            <div className="stat-bg-icon"><FiUsers /></div>
          </div>
          <div className="stat-card orange">
            <div className="stat-val"><h3>13:45 <span>min</span></h3><span>Avg Wait Time</span></div>
            <div className="stat-bg-icon"><FiActivity /></div>
          </div>
          <div className="stat-card green">
            <div className="stat-val"><h3>8</h3><span>Counters Online</span></div>
            <div className="stat-bg-icon"><FiUsers /></div>
          </div>
        </div>

        <div className="management-grid">
          {/* Live Management Table */}
          <section className="live-mgmt">
            <div className="section-header">
              <h3>Live Queue Management</h3>
              <button className="manage-btn">Manage Counters</button>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Counter</th>
                    <th>Token</th>
                    <th>Status</th>
                    <th>Options</th>
                  </tr>
                </thead>
                <tbody>
                  {counters.map((c) => (
                    <tr key={c.id}>
                      <td>Counter {c.id}</td>
                      <td>
                        <span className={`token-pill ${c.type}`}>{c.token}</span>
                      </td>
                      <td>
                        {c.status && <span className={`status-tag ${c.status.toLowerCase()}`}>{c.status}</span>}
                      </td>
                      <td className="actions">
                        {c.token !== "Offline" && (
                          <>
                            <button className="btn-skip">Skip</button>
                            <button className="btn-hold">Hold</button>
                            <button className="btn-next">Next</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Alerts Panel */}
          <aside className="alerts-section">
            <div className="section-header">
              <h3>Alerts</h3>
            </div>
            <div className="alert-card danger">
              <FiAlertCircle className="alert-icon" />
              <div>
                <h4>High Load in Queue A</h4>
                <p>52 waiting! Consider adding staff.</p>
              </div>
            </div>
            <div className="alert-card warning">
              <FiAlertCircle className="alert-icon" />
              <div>
                <h4>Long Wait Time Alert</h4>
                <p>Wait exceeds 20 minutes.</p>
              </div>
            </div>
            <div className="alert-card error">
              <FiAlertCircle className="alert-icon" />
              <div>
                <h4>Counter 4 Disconnected</h4>
                <p>Reconnect required.</p>
              </div>
            </div>
          </aside>
        </div>
        
        <footer className="admin-footer">
           © 2026 QueueMaster · All rights reserved
        </footer>
      </main>
    </div>
  );
};

export default AdminDashboard;