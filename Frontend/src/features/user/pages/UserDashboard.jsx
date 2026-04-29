// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import  usePushNotification from "../../../hooks/usePushNotification";
// import "../styles/UserDashboard.scss";

// import {
//   FiMenu, FiClipboard, FiList, FiClock,
//   FiFileText, FiBell, FiCalendar, FiLogOut,
//   FiXCircle, FiChevronDown, FiUser, FiSettings
// } from "react-icons/fi";

// import hospitalImg from "../../../assets/hospital.jpg";
// import hotelImg    from "../../../assets/hotel.jpg";
// import bankImg     from "../../../assets/bank.jpg";
// import govtImg     from "../../../assets/govt.jpg";
// import userImg     from "../../../assets/user.png";

// const UserDashboard = () => {
//   const navigate = useNavigate();

//   const [sidebarOpen, setSidebarOpen]   = useState(false);
//   const [services, setServices]         = useState([]);
//   const [loading, setLoading]           = useState(true);
//   const [error, setError]               = useState(null);
//   const [dropdownOpen, setDropdownOpen] = useState(false); // ← user dropdown
//   const dropdownRef                     = useRef(null);

//   const [activeTokens, setActiveTokens] = useState([]);
//   const [tokenHistory, setTokenHistory] = useState([]);
//   const [statsLoading, setStatsLoading] = useState(true);

//   const username = localStorage.getItem("username") || "User";
//   const userId   = localStorage.getItem("userId");
//   const token    = localStorage.getItem("token");

//   const authHeaders = {
//     "Content-Type" : "application/json",
//     "Authorization": `Bearer ${token}`
//   };

//   // ── Close dropdown on outside click ───────────────────
//   useEffect(() => {
//     const handleOutsideClick = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleOutsideClick);
//     return () => document.removeEventListener("mousedown", handleOutsideClick);
//   }, []);

//   // ── Redirect if not logged in ──────────────────────────
//   useEffect(() => {
//     if (!token) navigate("/login");
//   }, []);

//   // ── Fetch services ─────────────────────────────────────
//   useEffect(() => {
//     fetch("http://localhost:8080/api/categories", {
//       method : "GET",
//       headers: authHeaders
//     })
//       .then(res => {
//         if (!res.ok) throw new Error("Failed to fetch services");
//         return res.json();
//       })
//       .then(data => { setServices(data); setLoading(false); })
//       .catch(err => {
//         console.error("Error fetching services:", err);
//         setError("Could not load services. Make sure backend is running.");
//         setLoading(false);
//       });
//   }, []);

//   // ── Fetch live stats ───────────────────────────────────
//   useEffect(() => {
//     if (!userId || !token) return;

//     const fetchStats = async () => {
//       setStatsLoading(true);
//       try {
//         const activeRes = await fetch(
//           `http://localhost:8080/api/v1/tokens/user/${userId}/active`,
//           { headers: authHeaders }
//         );
//         const activeData = activeRes.ok ? await activeRes.json() : [];
//         setActiveTokens(activeData);

//         const histRes = await fetch(
//           `http://localhost:8080/api/v1/tokens/user/${userId}/history`,
//           { headers: authHeaders }
//         );
//         const histData = histRes.ok ? await histRes.json() : [];
//         setTokenHistory(histData);
//       } catch (err) {
//         console.error("Stats fetch error:", err);
//       } finally {
//         setStatsLoading(false);
//       }
//     };

//     fetchStats();
//     const interval = setInterval(fetchStats, 30000);
//     return () => clearInterval(interval);
//   }, [userId]);

//   // ── Derived stats ──────────────────────────────────────
//   const currentQueue  = activeTokens.length > 0
//     ? activeTokens[0].displayToken : "—";

//   const pendingCount  = activeTokens.filter(t =>
//     t.status === "BOOKED" || t.status === "CALLED"
//   ).length;

//   const totalWait     = activeTokens.reduce((sum, t) =>
//     sum + (t.estimatedWaitTimeMinutes ?? 0), 0
//   );
//   const estimatedWait = totalWait > 0 ? `${totalWait} mins` : "0 mins";

//   const totalVisits   = tokenHistory.filter(t =>
//     t.status === "COMPLETED"
//   ).length;

//   const nextAppointment = (() => {
//     const today = new Date().toISOString().split("T")[0];
//     const future = activeTokens
//       .filter(t => t.bookingDate >= today && t.status === "BOOKED")
//       .sort((a, b) => a.bookingDate.localeCompare(b.bookingDate));
//     if (!future.length) return null;
//     const next       = future[0];
//     const isTomorrow = (() => {
//       const tom = new Date();
//       tom.setDate(tom.getDate() + 1);
//       return next.bookingDate === tom.toISOString().split("T")[0];
//     })();
//     const label = next.bookingDate === today
//       ? "Today"
//       : isTomorrow ? "Tomorrow"
//       : new Date(next.bookingDate).toLocaleDateString("en-IN", {
//           day: "numeric", month: "short"
//         });
//     return `${label} · ${next.doctorName || next.branchServiceName || "Appointment"}`;
//   })();

//   const getServiceImage = (code) => {
//     switch (code?.toUpperCase()) {
//       case "HOSP": return hospitalImg;
//       case "BANK": return bankImg;
//       case "GOVT": return govtImg;
//       case "HOTL": return hotelImg;
//       default:     return hospitalImg;
//     }
//   };

//   const handleGetToken = (code) => {
//     switch (code?.toUpperCase()) {
//       case "HOSP": navigate("/hospitals");          break;
//       case "BANK": navigate("/banks");              break;
//       case "GOVT": navigate("/government-offices"); break;
//       case "HOTL": navigate("/hotels");             break;
//       default: break;
//     }
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/");
//   };

//   return (
//     <div className="dashboard-wrapper">

//       {/* ── TOP NAVBAR ─────────────────────────────────── */}
//       <nav className="top-navbar">

//         {/* LEFT */}
//         <div className="nav-left">
//           <button
//             className="menu-btn"
//             type="button"
//             onClick={() => setSidebarOpen(prev => !prev)}
//           >
//             <FiMenu />
//           </button>
//           <div className="app-logo">
//             <strong>QueueMaster</strong>
//           </div>
//         </div>

//         {/* CENTER */}
//         <div className="nav-center">
//           <input type="text" placeholder="Search queues, services..." />
//         </div>

//         {/* RIGHT */}
//         <div className="nav-right">

//           {/* Notification Bell */}
//           <div className="nav-bell">
//             <FiBell className="nav-icon" />
//             {activeTokens.length > 0 && (
//               <span className="bell-badge">{activeTokens.length}</span>
//             )}
//           </div>

//           {/* User Dropdown */}
//           <div className="user-dropdown-wrapper" ref={dropdownRef}>
//             <button
//               className="user-trigger"
//               onClick={() => setDropdownOpen(prev => !prev)}
//             >
//               <img src={userImg} alt="user" className="user-avatar" />
//               <div className="user-info">
//                 <span className="user-name">{username}</span>
//                 <span className="user-role">Customer</span>
//               </div>
//               <FiChevronDown
//                 className={`chevron ${dropdownOpen ? "open" : ""}`}
//               />
//             </button>

//             {/* Dropdown Menu */}
//             {dropdownOpen && (
//               <div className="user-dropdown-menu">
//                 <div className="dropdown-header">
//                   <img src={userImg} alt="user" />
//                   <div>
//                     <p className="dh-name">{username}</p>
//                     <p className="dh-role">Customer Account</p>
//                   </div>
//                 </div>

//                 <div className="dropdown-divider" />

//                 <ul className="dropdown-list">
//                   <li onClick={() => { navigate("/queue-status"); setDropdownOpen(false); }}>
//                     <FiClipboard /> My Queue Status
//                   </li>
//                   <li onClick={() => { navigate("/ticket-history"); setDropdownOpen(false); }}>
//                     <FiList /> Token History
//                   </li>
//                   <li onClick={() => { navigate("/appointments"); setDropdownOpen(false); }}>
//                     <FiCalendar /> Appointments
//                   </li>
//                 </ul>

//                 <div className="dropdown-divider" />

//                 <button className="dropdown-logout" onClick={handleLogout}>
//                   <FiLogOut /> Logout
//                 </button>
//               </div>
//             )}
//           </div>

//         </div>
//       </nav>

//       {/* ── SIDEBAR ────────────────────────────────────── */}
//       <aside className="sidebar" style={{ left: sidebarOpen ? "0px" : "-260px" }}>
//         <div className="sidebar-header">
//           <div className="sidebar-logo">Q</div>
//           <h3>QueueMaster</h3>
//         </div>

//         <div className="profile">
//           <img src={userImg} alt="user" />
//           <h4>{username}</h4>
//           <span>Active User</span>
//         </div>

//         <ul>
//           <li onClick={() => navigate("/queue-status")}>
//             <FiClipboard /> Queue Status
//           </li>
//           <li onClick={() => navigate("/ticket-history")}>
//             <FiList /> Token History
//           </li>
//           <li onClick={() => navigate("/estimated-wait")}>
//             <FiClock /> Estimated Wait
//           </li>
//           <li onClick={() => navigate("/appointments")}>
//             <FiCalendar /> Appointments
//           </li>
//           <li onClick={() => navigate("/cancel-token")}>
//             <FiXCircle /> Cancel Token
//           </li>
//           <li onClick={handleLogout}>
//             <FiLogOut /> Logout
//           </li>
//         </ul>
//       </aside>

//       {/* ── MAIN CONTENT ───────────────────────────────── */}
//       <main className={`main-content ${sidebarOpen ? "shift" : ""}`}>

//         <div className="welcome-box">
//           <h2>Welcome, {username} 👋</h2>
//           <p>Manage your queues, tokens and appointments easily</p>
//         </div>

//         <div className="summary-grid">
//           <div className="summary-card blue">
//             <FiClipboard className="icon" />
//             <div>
//               <h4>Current Queue</h4>
//               <span>{statsLoading ? "..." : currentQueue}</span>
//             </div>
//           </div>
//           <div className="summary-card green">
//             <FiList className="icon" />
//             <div>
//               <h4>Pending Tickets</h4>
//               <span>{statsLoading ? "..." : pendingCount}</span>
//             </div>
//           </div>
//           <div className="summary-card yellow">
//             <FiClock className="icon" />
//             <div>
//               <h4>Estimated Wait</h4>
//               <span>{statsLoading ? "..." : estimatedWait}</span>
//             </div>
//           </div>
//           <div className="summary-card pink">
//             <FiFileText className="icon" />
//             <div>
//               <h4>Total Visits</h4>
//               <span>{statsLoading ? "..." : totalVisits}</span>
//             </div>
//           </div>
//         </div>

//         <div className="extra-info">
//           <div className="info-card">
//             <FiBell />
//             <div>
//               <h4>Notifications</h4>
//               <p>
//                 {statsLoading ? "Loading..."
//                   : activeTokens.length > 0
//                   ? `${activeTokens.length} active token${activeTokens.length > 1 ? "s" : ""}`
//                   : "No active bookings"}
//               </p>
//             </div>
//           </div>
//           <div className="info-card">
//             <FiCalendar />
//             <div>
//               <h4>Next Appointment</h4>
//               <p>
//                 {statsLoading ? "Loading..."
//                   : nextAppointment || "No upcoming appointments"}
//               </p>
//             </div>
//           </div>
//         </div>

//         <h3 className="section-title">Available Services</h3>

//         {loading && <p style={{ textAlign: "center" }}>Loading services...</p>}
//         {error   && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}
//         {!loading && !error && services.length === 0 && (
//           <p style={{ textAlign: "center" }}>No services found.</p>
//         )}

//         <div className="services-grid">
//           {services.map((s) => (
//             <div className="service-card" key={s.id}>
//               <img src={getServiceImage(s.code)} alt={s.name} />
//               <h4>{s.name}</h4>
//               <p>{s.description}</p>
//               <button onClick={() => handleGetToken(s.code)}>Get Token</button>
//             </div>
//           ))}
//         </div>

//         <footer className="pro-footer">
//           <div className="footer-container">
//             <div className="footer-top">
//               <div className="footer-brand">
//                 <h2>QueueMaster</h2>
//                 <p>Enterprise Queue & Appointment Management System</p>
//                 <p className="footer-tagline">
//                   Streamlining public and private service experiences.
//                 </p>
//               </div>
//             </div>
//             <div className="footer-divider" />
//             <div className="footer-bottom">
//               <p>
//                 © {new Date().getFullYear()}{" "}
//                 <strong>QueueMaster Technologies Pvt. Ltd.</strong>{" "}
//                 All rights reserved.
//               </p>
//               <div className="footer-badges">
//                 <span>🔒 Secure Platform</span>
//                 <span>✔ ISO 27001 Certified</span>
//                 <span>🌐 Trusted by Organizations</span>
//               </div>
//             </div>
//           </div>
//         </footer>

//       </main>
//     </div>
//   );
// };

// export default UserDashboard;




import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useNotifications from "../../../hooks/useNotifications";
import "../styles/UserDashboard.scss";

import {
  FiMenu, FiClipboard, FiList, FiClock,
  FiFileText, FiBell, FiCalendar, FiLogOut,
  FiXCircle, FiChevronDown,
  FiTrash2, FiAlertCircle, FiInfo,
  FiCheckCircle, FiAlertTriangle, FiCheck, FiX
} from "react-icons/fi";

import hospitalImg from "../../../assets/hospital.jpg";
import hotelImg    from "../../../assets/hotel.jpg";
import bankImg     from "../../../assets/bank.jpg";
import govtImg     from "../../../assets/govt.jpg";
import userImg     from "../../../assets/user.png";

const UserDashboard = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [services, setServices]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen]       = useState(false);
  const [tokenHistory,  setTokenHistory]  = useState([]);
  const [activeTokens,  setActiveTokens]  = useState([]);
  const [statsLoading,  setStatsLoading]  = useState(true);

  const dropdownRef = useRef(null);
  const notifRef    = useRef(null);

  const username = localStorage.getItem("username") || "User";
  const userId   = localStorage.getItem("userId");

  const getAuthHeaders = () => ({
    "Content-Type" : "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  });

  // ── Notifications hook ─────────────────────────────────
  const {
    notifications,
    unreadCount,
    markAllRead,
    markRead,
    dismissOne,
    clearAll,
    refresh
  } = useNotifications(userId);

  // No window.__queueNotify needed — backend handles all notification logic

  // ── Fetch history for "Total Visits" stat ─────────────
  useEffect(() => {
    if (!userId) return;
    const fetch_ = async () => {
      try {
        const [histRes, activeRes] = await Promise.all([
          fetch(`http://localhost:8080/api/v1/tokens/user/${userId}/history`, { headers: getAuthHeaders() }),
          fetch(`http://localhost:8080/api/v1/tokens/user/${userId}/active`,  { headers: getAuthHeaders() })
        ]);
        setTokenHistory(histRes.ok   ? await histRes.json()   : []);
        setActiveTokens(activeRes.ok ? await activeRes.json() : []);
      } catch (e) { console.error(e); }
      finally { setStatsLoading(false); }
    };
    fetch_();
    const id = setInterval(fetch_, 30000);
    return () => clearInterval(id);
  }, [userId]);

  // ── Derived stats ──────────────────────────────────────
  const currentQueue  = activeTokens.length > 0 ? activeTokens[0].displayToken : "—";
  const pendingCount  = activeTokens.filter(t => t.status === "BOOKED" || t.status === "CALLED").length;
  const totalWait     = activeTokens.reduce((s, t) => s + (t.estimatedWaitTimeMinutes ?? 0), 0);
  const estimatedWait = totalWait > 0 ? `${totalWait} mins` : "0 mins";
  const totalVisits   = tokenHistory.filter(t => t.status === "COMPLETED").length;

  const nextAppointment = (() => {
    const today  = new Date().toISOString().split("T")[0];
    const future = activeTokens
      .filter(t => t.bookingDate >= today && t.status === "BOOKED")
      .sort((a, b) => a.bookingDate.localeCompare(b.bookingDate));
    if (!future.length) return null;
    const next = future[0];
    const tom  = new Date(); tom.setDate(tom.getDate() + 1);
    const label = next.bookingDate === today ? "Today"
      : next.bookingDate === tom.toISOString().split("T")[0] ? "Tomorrow"
      : new Date(next.bookingDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    return `${label} · ${next.doctorName || next.branchServiceName || "Appointment"}`;
  })();

  // ── Close on outside click ─────────────────────────────
  useEffect(() => {
    const h = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (notifRef.current    && !notifRef.current.contains(e.target))    setNotifOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // ── Auth guard ─────────────────────────────────────────
  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, []);

  // ── Fetch categories ───────────────────────────────────
  useEffect(() => {
    fetch("http://localhost:8080/api/categories", { headers: getAuthHeaders() })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => { setServices(d); setLoading(false); })
      .catch(() => { setError("Could not load services."); setLoading(false); });
  }, []);

  const getServiceImage = (code) => {
    switch (code?.toUpperCase()) {
      case "HOSP": return hospitalImg;
      case "BANK": return bankImg;
      case "GOVT": return govtImg;
      case "HOTL": return hotelImg;
      default:     return hospitalImg;
    }
  };

  const handleGetToken = (code) => {
    switch (code?.toUpperCase()) {
      case "HOSP": navigate("/hospitals");          break;
      case "BANK": navigate("/banks");              break;
      case "GOVT": navigate("/government-offices"); break;
      case "HOTL": navigate("/hotels");             break;
    }
  };

  const handleLogout = () => { localStorage.clear(); navigate("/"); };

  // ── Notification helpers ───────────────────────────────
  const notifIcon = (type) => {
    switch (type) {
      case "success": return <FiCheckCircle   className="ni ni-success" />;
      case "warning": return <FiAlertTriangle className="ni ni-warning" />;
      case "danger":  return <FiAlertCircle   className="ni ni-danger"  />;
      default:        return <FiInfo          className="ni ni-info"    />;
    }
  };

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60)   return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  const handleBellClick = () => {
    const opening = !notifOpen;
    setNotifOpen(opening);
    setDropdownOpen(false);
    if (opening) {
      refresh();       // fetch latest from backend immediately
      markAllRead();   // mark all read when drawer opens
    }
  };

  return (
    <div className="dashboard-wrapper">

      {/* ── TOP NAVBAR ─────────────────────────────────── */}
      <nav className="top-navbar">

        <div className="nav-left">
          <button className="menu-btn" type="button" onClick={() => setSidebarOpen(p => !p)}>
            <FiMenu />
          </button>
          <div className="app-logo"><strong>QueueMaster</strong></div>
        </div>

        <div className="nav-center">
          <input type="text" placeholder="Search queues, services..." />
        </div>

        <div className="nav-right">

          {/* ── Bell + Drawer ── */}
          <div className="nav-bell-wrapper" ref={notifRef}>
            <button className="nav-bell" onClick={handleBellClick} aria-label="Notifications">
              <FiBell className="nav-icon" />
              {unreadCount > 0 && (
                <span className="bell-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
              )}
            </button>

            {notifOpen && (
              <div className="notif-drawer">

                {/* ── Header ── */}
                <div className="notif-drawer-header">
                  <div className="notif-drawer-header-left">
                    <FiBell className="notif-header-icon" />
                    <div>
                      <h4 className="notif-heading">Notifications</h4>
                      <p className="notif-subheading">
                        {notifications.length === 0
                          ? "You're all caught up"
                          : `${unreadCount > 0 ? `${unreadCount} unread · ` : ""}${notifications.length} total`}
                      </p>
                    </div>
                  </div>
                  {notifications.length > 0 && (
                    <button className="notif-clear-all" onClick={clearAll} title="Clear all">
                      <FiTrash2 /> Clear all
                    </button>
                  )}
                </div>

                {/* ── Mark all read bar ── */}
                {unreadCount > 0 && (
                  <div className="notif-mark-bar">
                    <button onClick={markAllRead}>
                      <FiCheck /> Mark all as read
                    </button>
                  </div>
                )}

                {/* ── List ── */}
                <div className="notif-list">
                  {notifications.length === 0 ? (
                    <div className="notif-empty">
                      <div className="notif-empty-icon-wrap">
                        <FiBell />
                      </div>
                      <p className="notif-empty-title">No notifications yet</p>
                      <p className="notif-empty-sub">We'll notify you when your token is booked, cancelled, or your turn is near.</p>
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        className={`notif-item ${n.read ? "is-read" : "is-unread"} ntype-${n.type}`}
                      >
                        {/* colour strip */}
                        <div className="notif-strip" />

                        {/* icon */}
                        <div className="notif-item-icon">
                          {notifIcon(n.type)}
                        </div>

                        {/* content */}
                        <div className="notif-content" onClick={() => markRead(n.id)}>
                          <p className="notif-msg-title">{n.title}</p>
                          <p className="notif-msg-body">{n.message}</p>
                          <span className="notif-msg-time">
                            <FiClock style={{ fontSize: 10, marginRight: 3 }} />
                            {timeAgo(n.createdAt || n.time)}
                          </span>
                        </div>

                        {/* right side */}
                        <div className="notif-item-right">
                          {!n.read && <span className="notif-unread-dot" />}
                          <div className="notif-item-actions">
                            {!n.read && (
                              <button
                                className="notif-action-btn read-btn"
                                onClick={e => { e.stopPropagation(); markRead(n.id); }}
                                title="Mark as read"
                              >
                                <FiCheck />
                              </button>
                            )}
                            <button
                              className="notif-action-btn delete-btn"
                              onClick={e => { e.stopPropagation(); dismissOne(n.id); }}
                              title="Delete"
                            >
                              <FiX />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* ── Footer ── */}
                {notifications.length > 0 && (
                  <div className="notif-drawer-footer">
                    <button
                      className="notif-view-history"
                      onClick={() => { navigate("/ticket-history"); setNotifOpen(false); }}
                    >
                      View token history
                    </button>
                  </div>
                )}

              </div>
            )}
          </div>

          {/* ── User Dropdown ── */}
          <div className="user-dropdown-wrapper" ref={dropdownRef}>
            <button className="user-trigger" onClick={() => setDropdownOpen(p => !p)}>
              <img src={userImg} alt="user" className="user-avatar" />
              <div className="user-info">
                <span className="user-name">{username}</span>
                <span className="user-role">Customer</span>
              </div>
              <FiChevronDown className={`chevron ${dropdownOpen ? "open" : ""}`} />
            </button>

            {dropdownOpen && (
              <div className="user-dropdown-menu">
                <div className="dropdown-header">
                  <img src={userImg} alt="user" />
                  <div>
                    <p className="dh-name">{username}</p>
                    <p className="dh-role">Customer Account</p>
                  </div>
                </div>
                <div className="dropdown-divider" />
                <ul className="dropdown-list">
                  <li onClick={() => { navigate("/queue-status");   setDropdownOpen(false); }}><FiClipboard /> My Queue Status</li>
                  <li onClick={() => { navigate("/ticket-history"); setDropdownOpen(false); }}><FiList />      Token History</li>
                  <li onClick={() => { navigate("/appointments");   setDropdownOpen(false); }}><FiCalendar />  Appointments</li>
                </ul>
                <div className="dropdown-divider" />
                <button className="dropdown-logout" onClick={handleLogout}><FiLogOut /> Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── SIDEBAR ────────────────────────────────────── */}
      <aside className="sidebar" style={{ left: sidebarOpen ? "0px" : "-260px" }}>
        <div className="sidebar-header">
          <div className="sidebar-logo">Q</div>
          <h3>QueueMaster</h3>
        </div>
        <div className="profile">
          <img src={userImg} alt="user" />
          <h4>{username}</h4>
          <span>Active User</span>
        </div>
        <ul>
          <li onClick={() => navigate("/queue-status")}>   <FiClipboard /> Queue Status   </li>
          <li onClick={() => navigate("/ticket-history")}> <FiList />      Token History  </li>
          <li onClick={() => navigate("/estimated-wait")}> <FiClock />     Estimated Wait </li>
          <li onClick={() => navigate("/appointments")}>   <FiCalendar />  Appointments   </li>
          <li onClick={() => navigate("/cancel-token")}>   <FiXCircle />   Cancel Token   </li>
          <li onClick={handleLogout}>                      <FiLogOut />    Logout         </li>
        </ul>
      </aside>

      {/* ── MAIN CONTENT ───────────────────────────────── */}
      <main className={`main-content ${sidebarOpen ? "shift" : ""}`}>

        <div className="welcome-box">
          <h2>Welcome, {username} 👋</h2>
          <p>Manage your queues, tokens and appointments easily</p>
        </div>

        <div className="summary-grid">
          <div className="summary-card blue">
            <FiClipboard className="icon" />
            <div><h4>Current Queue</h4><span>{statsLoading ? "..." : currentQueue}</span></div>
          </div>
          <div className="summary-card green">
            <FiList className="icon" />
            <div><h4>Pending Tickets</h4><span>{statsLoading ? "..." : pendingCount}</span></div>
          </div>
          <div className="summary-card yellow">
            <FiClock className="icon" />
            <div><h4>Estimated Wait</h4><span>{statsLoading ? "..." : estimatedWait}</span></div>
          </div>
          <div className="summary-card pink">
            <FiFileText className="icon" />
            <div><h4>Total Visits</h4><span>{statsLoading ? "..." : totalVisits}</span></div>
          </div>
        </div>

        <div className="extra-info">
          <div className="info-card">
            <FiBell />
            <div>
              <h4>Notifications</h4>
              <p>{activeTokens.length > 0 ? `${activeTokens.length} active token${activeTokens.length > 1 ? "s" : ""}` : "No active bookings"}</p>
            </div>
          </div>
          <div className="info-card">
            <FiCalendar />
            <div>
              <h4>Next Appointment</h4>
              <p>{nextAppointment || "No upcoming appointments"}</p>
            </div>
          </div>
        </div>

        <h3 className="section-title">Available Services</h3>
        {loading && <p style={{ textAlign: "center" }}>Loading services...</p>}
        {error   && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}
        {!loading && !error && services.length === 0 && <p style={{ textAlign: "center" }}>No services found.</p>}

        <div className="services-grid">
          {services.map(s => (
            <div className="service-card" key={s.id}>
              <img src={getServiceImage(s.code)} alt={s.name} />
              <h4>{s.name}</h4>
              <p>{s.description}</p>
              <button onClick={() => handleGetToken(s.code)}>Get Token</button>
            </div>
          ))}
        </div>

        <footer className="pro-footer">
          <div className="footer-container">
            <div className="footer-top">
              <div className="footer-brand">
                <h2>QueueMaster</h2>
                <p>Enterprise Queue &amp; Appointment Management System</p>
                <p className="footer-tagline">Streamlining public and private service experiences.</p>
              </div>
            </div>
            <div className="footer-divider" />
            <div className="footer-bottom">
              <p>© {new Date().getFullYear()} <strong>QueueMaster Technologies Pvt. Ltd.</strong> All rights reserved.</p>
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