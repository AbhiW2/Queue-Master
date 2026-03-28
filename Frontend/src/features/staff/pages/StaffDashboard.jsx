
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/StaffDashboard.scss";
// import {
//   FiMenu,
//   FiBell,
//   FiUser,
//   FiPlay,
//   FiCheckCircle,
//   FiPause,
//   FiSkipForward,
//   FiList,
//   FiLogOut
// } from "react-icons/fi";

// const StaffDashboard = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const navigate = useNavigate();

//   const handleViewQueue = () => {
//     navigate("/staff/view-queue");
//     setSidebarOpen(false);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("staffToken");
//     localStorage.removeItem("staffData");
//     navigate("/");
//   };

//   return (
//     <div className={`staff-console ${sidebarOpen ? "sidebar-open" : ""}`}>

//       {/* TOP NAVBAR */}
//       <header className="topbar">
//         <div className="top-left">
//           <button
//             className="menu-btn"
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//           >
//             <FiMenu />
//           </button>

//           <div className="brand">
//             <span className="logo">Q</span>
//             <strong>StaffConsole</strong>
//           </div>
//         </div>

//         <div className="top-right">
//           <span className="counter-badge">Counter 04</span>
//           <FiBell />
//           <div className="user">
//             <FiUser />
//             <span>Staff Member</span>
//           </div>
//         </div>
//       </header>

//       {/* SIDEBAR */}
//       <aside className={`sidenav ${sidebarOpen ? "open" : ""}`}>
//         <div className="profile">
//           <div className="avatar">
//             <FiUser />
//           </div>
//           <h4>Abhi Wargad</h4>
//           <span>Staff · Counter 04</span>
//         </div>

//         <nav>
//           <button onClick={handleViewQueue}>
//             <FiList /> View Queue
//           </button>

//           <button className="logout" onClick={handleLogout}>
//             <FiLogOut /> Logout
//           </button>
//         </nav>
//       </aside>

//       {/* MAIN CONTENT */}
//       <main className="content">

//         <div className="page-header">
//           <h2>Counter 04 Console</h2>
//           <p>Manage your active service and queue flow.</p>
//         </div>

//         <section className="dashboard-grid">

//           {/* NOW SERVING */}
//           <div className="card now-serving">
//             <span className="section-label">NOW SERVING</span>
//             <h1>A-102</h1>
//             <h3>John Doe</h3>
//             <p>General Inquiry · Wait: 12 mins</p>

//             <button className="btn primary">
//               <FiPlay /> Call Next
//             </button>

//             <button className="btn success">
//               <FiCheckCircle /> Mark Served
//             </button>

//             <div className="row">
//               <button className="btn info">
//                 <FiPause /> Hold
//               </button>
//               <button className="btn light">
//                 <FiSkipForward /> Skip
//               </button>
//             </div>
//           </div>

//           {/* UPCOMING QUEUE */}
//           <div className="card queue-panel">
//             <div className="queue-header">
//               <h3>Upcoming Queue</h3>
//               <span className="count">12 Left</span>
//             </div>

//             <ul>
//               <li><strong>A-103</strong><span>Account Opening</span></li>
//               <li><strong>A-104</strong><span>General Inquiry</span></li>
//               <li><strong>A-105</strong><span>Consultation</span></li>
//             </ul>
//           </div>

//         </section>

//         {/* FOOTER */}
//         <footer className="footer">
//           © 2026 QueueMaster · Staff Operations Console
//         </footer>

//       </main>
//     </div>
//   );
// };

// export default StaffDashboard;




import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/StaffDashboard.scss";

import StaffSidebar       from "./StaffSidebar";
import StaffTopbar        from "./StaffTopbar";
import StaffSelectorModal from "./StaffSelectorModal";
import StaffStats         from "./StaffStats";
import StaffQueuePanel    from "./StaffQueuePanel";

const API = "http://localhost:8080/api/staff";

const StaffDashboard = () => {
  const navigate    = useNavigate();
  const token       = localStorage.getItem("token");
  const username    = localStorage.getItem("username");
  const authHeaders = {
    "Content-Type": "application/json",
    Authorization : `Bearer ${token}`
  };

  // ── UI State ─────────────────────────────────────────────
  const [activePage,  setActivePage]  = useState("queue");
  const [collapsed,   setCollapsed]   = useState(false);
  const [toast,       setToast]       = useState(null);
  const [loading,     setLoading]     = useState(false);

  // ── Data State ───────────────────────────────────────────
  const [branchInfo,  setBranchInfo]  = useState(null);
  const [options,     setOptions]     = useState([]);   // doctors or services
  const [selected,    setSelected]    = useState(null); // chosen doctor/service
  const [queue,       setQueue]       = useState([]);
  const [stats,       setStats]       = useState(null);

  // ── Auth guard ────────────────────────────────────────────
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!["STAFF","ADMIN","SUPER_ADMIN"].includes(role)) navigate("/login");
  }, []);

  // ── Initial load ──────────────────────────────────────────
  useEffect(() => { init(); }, []);

  // ── Auto-refresh queue every 20s ──────────────────────────
  useEffect(() => {
    if (!selected) return;
    const id = setInterval(refreshQueue, 20000);
    return () => clearInterval(id);
  }, [selected]);

  const init = async () => {
    try {
      const infoRes = await axios.get(`${API}/branch-info`, { headers: authHeaders });
      const info    = infoRes.data;
      setBranchInfo(info);

      const endpoint = info.isHospital ? `${API}/doctors` : `${API}/services`;
      const optRes   = await axios.get(endpoint, { headers: authHeaders });
      setOptions(Array.isArray(optRes.data) ? optRes.data : []);
    } catch(e) {
      showToast("Failed to load branch info.", "error");
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  // ── Select doctor/service ─────────────────────────────────
  const handleSelect = async (opt) => {
    setSelected(opt);
    await loadQueue(opt);
  };

  // ── Load queue + stats ────────────────────────────────────
  const loadQueue = async (opt = selected) => {
    if (!opt || !branchInfo) return;
    setLoading(true);
    try {
      const isHospital  = branchInfo.isHospital;
      const queueUrl    = isHospital
        ? `${API}/queue/doctor/${opt.id}`
        : `${API}/queue/service/${opt.id}`;
      const statsUrl    = isHospital
        ? `${API}/stats/doctor/${opt.id}`
        : `${API}/stats/service/${opt.id}`;

      const [qRes, sRes] = await Promise.all([
        axios.get(queueUrl, { headers: authHeaders }),
        axios.get(statsUrl, { headers: authHeaders }),
      ]);

      setQueue(Array.isArray(qRes.data) ? qRes.data : []);
      setStats(sRes.data);
    } catch(e) {
      showToast("Failed to load queue.", "error");
    } finally {
      setLoading(false);
    }
  };

  const refreshQueue = () => loadQueue();

  // ── Call Next ─────────────────────────────────────────────
  const handleCallNext = async () => {
    if (!selected || !branchInfo) return;
    try {
      const url = branchInfo.isHospital
        ? `${API}/call-next/doctor/${selected.id}`
        : `${API}/call-next/service/${selected.id}`;
      const res = await axios.post(url, {}, { headers: authHeaders });
      showToast(`Now serving: ${res.data.displayToken}`, "info");
      await loadQueue();
    } catch(e) {
      showToast(e.response?.data?.message || "No more tokens.", "error");
    }
  };

  // ── Token status updates ──────────────────────────────────
  const updateStatus = async (tokenId, status) => {
    try {
      await axios.patch(
        `${API}/token/${tokenId}/status`,
        { status },
        { headers: authHeaders }
      );
      showToast(
        status === "COMPLETED" ? "Token completed ✓"
        : status === "SKIPPED"  ? "Token skipped"
        : "Marked as no-show",
        "success"
      );
      await loadQueue();
    } catch(e) {
      showToast(e.response?.data?.message || "Failed to update.", "error");
    }
  };

  const handleComplete = (tokenId) => updateStatus(tokenId, "COMPLETED");
  const handleSkip     = (tokenId) => updateStatus(tokenId, "SKIPPED");
  const handleNoShow   = (tokenId) => updateStatus(tokenId, "NO_SHOW");

  // ── History view — completed tokens ───────────────────────
  const completedTokens = queue.filter(t =>
    ["COMPLETED","CANCELLED","NO_SHOW","SKIPPED"].includes(t.status));

  return (
    <div className={`sf-root ${collapsed ? "collapsed" : ""}`}>

      {/* Toast */}
      {toast && (
        <div className={`sf-toast ${toast.type}`}>
          <span>{toast.type==="success" ? "✓" : toast.type==="info" ? "🔔" : "✕"}</span>
          {toast.message}
        </div>
      )}

      {/* Selector Modal — show until staff picks a doctor/service */}
      {!selected && branchInfo && options.length > 0 && (
        <StaffSelectorModal
          branchInfo={branchInfo}
          options={options}
          selected={selected}
          onSelect={handleSelect}
        />
      )}

      {/* Sidebar */}
      <StaffSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activePage={activePage}
        setActivePage={setActivePage}
        username={username}
        branchInfo={branchInfo}
        onLogout={handleLogout}
      />

      {/* Main */}
      <main className="sf-main">

        {/* Topbar */}
        <StaffTopbar
          activePage={activePage}
          branchInfo={branchInfo}
          selected={selected}
          onRefresh={refreshQueue}
        />

        <div className="sf-content">

          {/* ── QUEUE PAGE ─────────────────────────────── */}
          {activePage === "queue" && (
            <>
              {selected ? (
                <>
                  {/* Change counter button */}
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div style={{ fontSize:"13px", color:"#64748b" }}>
                      Managing: <strong style={{ color:"#0f172a" }}>
                        {branchInfo?.isHospital ? `Dr. ${selected.name}` : selected.name}
                      </strong>
                    </div>
                    <button
                      className="sf-btn-secondary"
                      style={{ fontSize:"12px", padding:"6px 14px" }}
                      onClick={() => { setSelected(null); setQueue([]); setStats(null); }}
                    >
                      ⇄ Change
                    </button>
                  </div>

                  {/* Stats */}
                  <StaffStats
                    stats={stats}
                    selected={selected}
                    branchInfo={branchInfo}
                    onCallNext={handleCallNext}
                  />

                  {/* Queue */}
                  <StaffQueuePanel
                    queue={queue}
                    loading={loading}
                    onComplete={handleComplete}
                    onSkip={handleSkip}
                    onNoShow={handleNoShow}
                  />
                </>
              ) : (
                <div className="sf-empty">
                  <div className="sf-empty-icon">👆</div>
                  Select a {branchInfo?.isHospital ? "doctor" : "service counter"} to start managing the queue
                </div>
              )}
            </>
          )}

          {/* ── HISTORY PAGE ───────────────────────────── */}
          {activePage === "history" && (
            <div className="sf-queue-card">
              <div className="sf-queue-card-head">
                <div>
                  <h3>📋 Queue History — Today</h3>
                  <p>{completedTokens.length} finished tokens</p>
                </div>
              </div>
              <div className="sf-tokens-list">
                {completedTokens.length === 0 ? (
                  <div className="sf-empty">
                    <div className="sf-empty-icon">📋</div>
                    No completed tokens yet today
                  </div>
                ) : (
                  completedTokens.map(t => (
                    <div key={t.tokenId} className={`sf-token-card ${t.status?.toLowerCase()}`}>
                      <div className={`sf-token-card-number ${t.status?.toLowerCase()}`}>
                        {t.displayToken}
                      </div>
                      <div className="sf-token-card-info">
                        <div className="sf-token-card-customer">👤 {t.customerName}</div>
                        <div className="sf-token-card-service">{t.serviceName} · #{t.tokenNumber}</div>
                      </div>
                      <span className={`sf-token-card-badge ${t.status?.toLowerCase()}`}>
                        {t.status?.replace("_"," ")}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;
