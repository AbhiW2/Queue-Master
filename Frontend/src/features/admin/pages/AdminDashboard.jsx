// // // // import React, { useState } from "react";
// // // // import { useNavigate, NavLink } from "react-router-dom";
// // // // import "../styles/AdminDashboard.scss";

// // // // /* Icons */
// // // // import {
// // // //   FiMenu,
// // // //   FiGrid,
// // // //   FiUsers,
// // // //   FiActivity,
// // // //   FiSettings,
// // // //   FiBell,
// // // //   FiLogOut,
// // // //   FiSearch,
// // // //   FiChevronRight,
// // // //   FiAlertCircle
// // // // } from "react-icons/fi";

// // // // /* Assets */
// // // // import adminImg from "../assets/user.png";

// // // // const AdminDashboard = () => {
// // // //   // CHANGED: Initial state is now false so it stays hidden on load
// // // //   const [sidebarOpen, setSidebarOpen] = useState(false);

// // // //   // Mock Data for the Table
// // // //   const counters = [
// // // //     { id: 1, token: "A102", status: "Priority", type: "orange" },
// // // //     { id: 2, token: "B053", status: "", type: "blue" },
// // // //     { id: 3, token: "C021", status: "", type: "blue" },
// // // //     { id: 4, token: "Offline", status: "Offline", type: "red" },
// // // //   ];

// // // //   return (
// // // //     <div className="admin-wrapper">
// // // //       {/* ================= TOP NAVBAR ================= */}
// // // //       <nav className="admin-navbar">
// // // //         <div className="nav-left">
// // // //           {/* This button toggles the sidebar state */}
// // // //           <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
// // // //             <FiMenu />
// // // //           </button>
// // // //           <div className="app-logo">
// // // //             <span>Q</span>
// // // //             <strong>QueueMaster</strong>
// // // //           </div>
// // // //         </div>

// // // //         <div className="nav-center">
// // // //           <div className="search-bar">
// // // //             <FiSearch />
// // // //             <input type="text" placeholder="Search queues, services..." />
// // // //           </div>
// // // //         </div>

// // // //         <div className="nav-right">
// // // //           <div className="system-status">
// // // //             System Status: <span className="online-dot">Online</span>
// // // //           </div>
// // // //           <div className="admin-profile">
// // // //             <img src={adminImg} alt="admin" />
// // // //             <span>Admin</span>
// // // //           </div>
// // // //         </div>
// // // //       </nav>

// // // //       {/* ================= SIDEBAR ================= */}
// // // //       <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
// // // //         <div className="profile-mini">
// // // //           <img src={adminImg} alt="admin" />
// // // //           <h4>Admin</h4>
// // // //           <span>Queue Manager</span>
// // // //         </div>

// // // //         <ul className="nav-links">
// // // //           <li className="active"><FiGrid /> Dashboard</li>
// // // //           <li><FiActivity /> Services & Queues</li>
// // // //           <li><FiUsers /> Manage Counters</li>
// // // //           <li><FiSettings /> Priority Policies</li>
// // // //           <li><FiActivity /> Reports & Analytics</li>
// // // //           <li className="logout"><FiLogOut /> Logout</li>
// // // //         </ul>
// // // //       </aside>

// // // //       {/* ================= MAIN CONTENT ================= */}
// // // //       {/* The "full-width" class is applied when sidebarOpen is false, 
// // // //           which removes the left margin defined in your SCSS.
// // // //       */}
// // // //       <main className={`admin-main ${!sidebarOpen ? "full-width" : ""}`}>
// // // //         <div className="welcome-header">
// // // //           <h2>Welcome back, Admin!</h2>
// // // //           <p>Manage queues, counters, and optimize your services.</p>
// // // //         </div>

// // // //         {/* Stats Row */}
// // // //         <div className="admin-stats-grid">
// // // //           <div className="stat-card blue">
// // // //             <div className="stat-val"><h3>5</h3><span>Active Queues</span></div>
// // // //             <div className="stat-bg-icon"><FiActivity /></div>
// // // //           </div>
// // // //           <div className="stat-card cyan">
// // // //             <div className="stat-val"><h3>52</h3><span>Waiting Tokens</span></div>
// // // //             <div className="stat-bg-icon"><FiUsers /></div>
// // // //           </div>
// // // //           <div className="stat-card orange">
// // // //             <div className="stat-val"><h3>13:45 <span>min</span></h3><span>Avg Wait Time</span></div>
// // // //             <div className="stat-bg-icon"><FiActivity /></div>
// // // //           </div>
// // // //           <div className="stat-card green">
// // // //             <div className="stat-val"><h3>8</h3><span>Counters Online</span></div>
// // // //             <div className="stat-bg-icon"><FiUsers /></div>
// // // //           </div>
// // // //         </div>

// // // //         <div className="management-grid">
// // // //           {/* Live Management Table */}
// // // //           <section className="live-mgmt">
// // // //             <div className="section-header">
// // // //               <h3>Live Queue Management</h3>
// // // //               <button className="manage-btn">Manage Counters</button>
// // // //             </div>
// // // //             <div className="table-container">
// // // //               <table>
// // // //                 <thead>
// // // //                   <tr>
// // // //                     <th>Counter</th>
// // // //                     <th>Token</th>
// // // //                     <th>Status</th>
// // // //                     <th>Options</th>
// // // //                   </tr>
// // // //                 </thead>
// // // //                 <tbody>
// // // //                   {counters.map((c) => (
// // // //                     <tr key={c.id}>
// // // //                       <td>Counter {c.id}</td>
// // // //                       <td>
// // // //                         <span className={`token-pill ${c.type}`}>{c.token}</span>
// // // //                       </td>
// // // //                       <td>
// // // //                         {c.status && <span className={`status-tag ${c.status.toLowerCase()}`}>{c.status}</span>}
// // // //                       </td>
// // // //                       <td className="actions">
// // // //                         {c.token !== "Offline" && (
// // // //                           <>
// // // //                             <button className="btn-skip">Skip</button>
// // // //                             <button className="btn-hold">Hold</button>
// // // //                             <button className="btn-next">Next</button>
// // // //                           </>
// // // //                         )}
// // // //                       </td>
// // // //                     </tr>
// // // //                   ))}
// // // //                 </tbody>
// // // //               </table>
// // // //             </div>
// // // //           </section>

// // // //           {/* Alerts Panel */}
// // // //           <aside className="alerts-section">
// // // //             <div className="section-header">
// // // //               <h3>Alerts</h3>
// // // //             </div>
// // // //             <div className="alert-card danger">
// // // //               <FiAlertCircle className="alert-icon" />
// // // //               <div>
// // // //                 <h4>High Load in Queue A</h4>
// // // //                 <p>52 waiting! Consider adding staff.</p>
// // // //               </div>
// // // //             </div>
// // // //             <div className="alert-card warning">
// // // //               <FiAlertCircle className="alert-icon" />
// // // //               <div>
// // // //                 <h4>Long Wait Time Alert</h4>
// // // //                 <p>Wait exceeds 20 minutes.</p>
// // // //               </div>
// // // //             </div>
// // // //             <div className="alert-card error">
// // // //               <FiAlertCircle className="alert-icon" />
// // // //               <div>
// // // //                 <h4>Counter 4 Disconnected</h4>
// // // //                 <p>Reconnect required.</p>
// // // //               </div>
// // // //             </div>
// // // //           </aside>
// // // //         </div>
        
// // // //         <footer className="admin-footer">
// // // //            © 2026 QueueMaster · All rights reserved
// // // //         </footer>
// // // //       </main>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default AdminDashboard;



// // import React, { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import "../styles/AdminDashboard.scss";

// // /* Icons */
// // import {
// //   FiMenu,
// //   FiGrid,
// //   FiUsers,
// //   FiActivity,
// //   FiSettings,
// //   FiLogOut,
// //   FiSearch,
// //   FiAlertCircle
// // } from "react-icons/fi";

// // /* Assets */

// // import adminImg from "../../../assets/user.png";

// // const AdminDashboard = () => {
// //   const [sidebarOpen, setSidebarOpen] = useState(false);
// //   const navigate = useNavigate();

// //   // Logout Function
// //   const handleLogout = () => {
// //     localStorage.removeItem("token"); // remove login token if stored
// //     navigate("/"); // redirect to login page
// //   };

// //   // Mock Data for the Table
// //   const counters = [
// //     { id: 1, token: "A102", status: "Priority", type: "orange" },
// //     { id: 2, token: "B053", status: "", type: "blue" },
// //     { id: 3, token: "C021", status: "", type: "blue" },
// //     { id: 4, token: "Offline", status: "Offline", type: "red" },
// //   ];

// //   return (
// //     <div className="admin-wrapper">
      
// //       {/* ================= TOP NAVBAR ================= */}
// //       <nav className="admin-navbar">
// //         <div className="nav-left">
// //           <button
// //             className="menu-btn"
// //             onClick={() => setSidebarOpen(!sidebarOpen)}
// //           >
// //             <FiMenu />
// //           </button>
// //           <div className="app-logo">
// //             <span>Q</span>
// //             <strong>QueueMaster</strong>
// //           </div>
// //         </div>

// //         <div className="nav-center">
// //           <div className="search-bar">
// //             <FiSearch />
// //             <input type="text" placeholder="Search queues, services..." />
// //           </div>
// //         </div>

// //         <div className="nav-right">
// //           <div className="system-status">
// //             System Status: <span className="online-dot">Online</span>
// //           </div>
// //           <div className="admin-profile">
// //             <img src={adminImg} alt="admin" />
// //             <span>Admin</span>
// //           </div>
// //         </div>
// //       </nav>

// //       {/* ================= SIDEBAR ================= */}
// //       <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
// //         <div className="profile-mini">
// //           <img src={adminImg} alt="admin" />
// //           <h4>Admin</h4>
// //           <span>Queue Manager</span>
// //         </div>

// //         <ul className="nav-links">
// //           <li className="active">
// //             <FiGrid /> Dashboard
// //           </li>

// //           <li onClick={() => navigate("/admin/services-and-queues")}>
// //             <FiActivity /> Services & Queues
// //           </li>

// //           <li onClick={() => navigate("/admin/manage-counters")}>
// //             <FiUsers /> Manage Counters
// //           </li>

// //           <li onClick={() => navigate("/admin/reports-and-analytics")}>
// //             <FiActivity /> Reports & Analytics
// //           </li>

// //           <li className="logout" onClick={handleLogout}>
// //             <FiLogOut /> Logout
// //           </li>
// //         </ul>
// //       </aside>

// //       {/* ================= MAIN CONTENT ================= */}
// //       <main className={`admin-main ${!sidebarOpen ? "full-width" : ""}`}>
// //         <div className="welcome-header">
// //           <h2>Welcome back, Admin!</h2>
// //           <p>Manage queues, counters, and optimize your services.</p>
// //         </div>

// //         {/* Stats Row */}
// //         <div className="admin-stats-grid">
// //           <div className="stat-card blue">
// //             <div className="stat-val">
// //               <h3>5</h3>
// //               <span>Active Queues</span>
// //             </div>
// //             <div className="stat-bg-icon">
// //               <FiActivity />
// //             </div>
// //           </div>

// //           <div className="stat-card cyan">
// //             <div className="stat-val">
// //               <h3>52</h3>
// //               <span>Waiting Tokens</span>
// //             </div>
// //             <div className="stat-bg-icon">
// //               <FiUsers />
// //             </div>
// //           </div>

// //           <div className="stat-card orange">
// //             <div className="stat-val">
// //               <h3>
// //                 13:45 <span>min</span>
// //               </h3>
// //               <span>Avg Wait Time</span>
// //             </div>
// //             <div className="stat-bg-icon">
// //               <FiActivity />
// //             </div>
// //           </div>

// //           <div className="stat-card green">
// //             <div className="stat-val">
// //               <h3>8</h3>
// //               <span>Counters Online</span>
// //             </div>
// //             <div className="stat-bg-icon">
// //               <FiUsers />
// //             </div>
// //           </div>
// //         </div>

// //         <div className="management-grid">
// //           {/* Live Management Table */}
// //           <section className="live-mgmt">
// //             <div className="section-header">
// //               <h3>Live Queue Management</h3>
// //               <button className="manage-btn">Manage Counters</button>
// //             </div>

// //             <div className="table-container">
// //               <table>
// //                 <thead>
// //                   <tr>
// //                     <th>Counter</th>
// //                     <th>Token</th>
// //                     <th>Status</th>
// //                     <th>Options</th>
// //                   </tr>
// //                 </thead>

// //                 <tbody>
// //                   {counters.map((c) => (
// //                     <tr key={c.id}>
// //                       <td>Counter {c.id}</td>

// //                       <td>
// //                         <span className={`token-pill ${c.type}`}>
// //                           {c.token}
// //                         </span>
// //                       </td>

// //                       <td>
// //                         {c.status && (
// //                           <span
// //                             className={`status-tag ${c.status.toLowerCase()}`}
// //                           >
// //                             {c.status}
// //                           </span>
// //                         )}
// //                       </td>

// //                       <td className="actions">
// //                         {c.token !== "Offline" && (
// //                           <>
// //                             <button className="btn-skip">Skip</button>
// //                             <button className="btn-hold">Hold</button>
// //                             <button className="btn-next">Next</button>
// //                           </>
// //                         )}
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </section>

// //           {/* Alerts Panel */}
// //           <aside className="alerts-section">
// //             <div className="section-header">
// //               <h3>Alerts</h3>
// //             </div>

// //             <div className="alert-card danger">
// //               <FiAlertCircle className="alert-icon" />
// //               <div>
// //                 <h4>High Load in Queue A</h4>
// //                 <p>52 waiting! Consider adding staff.</p>
// //               </div>
// //             </div>

// //             <div className="alert-card warning">
// //               <FiAlertCircle className="alert-icon" />
// //               <div>
// //                 <h4>Long Wait Time Alert</h4>
// //                 <p>Wait exceeds 20 minutes.</p>
// //               </div>
// //             </div>

// //             <div className="alert-card error">
// //               <FiAlertCircle className="alert-icon" />
// //               <div>
// //                 <h4>Counter 4 Disconnected</h4>
// //                 <p>Reconnect required.</p>
// //               </div>
// //             </div>
// //           </aside>
// //         </div>

// //         <footer className="admin-footer">
// //           © 2026 QueueMaster · All rights reserved
// //         </footer>
// //       </main>
// //     </div>
// //   );
// // };

// // export default AdminDashboard;










// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "../styles/AdminDashboard.scss";

// const API = "http://localhost:8080/api/admin";

// const AdminDashboard = () => {
//   const navigate    = useNavigate();
//   const token       = localStorage.getItem("token");
//   const username    = localStorage.getItem("username");
//   const authHeaders = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

//   const [activePage,       setActivePage]       = useState("dashboard");
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [toast,            setToast]            = useState(null);
//   const [modal,            setModal]            = useState(null);

//   const [stats,    setStats]    = useState(null);
//   const [doctors,  setDoctors]  = useState([]);
//   const [services, setServices] = useState([]);
//   const [staff,    setStaff]    = useState([]);
//   const [queue,    setQueue]    = useState([]);

//   const [doctorSearch,  setDoctorSearch]  = useState("");
//   const [serviceSearch, setServiceSearch] = useState("");
//   const [staffSearch,   setStaffSearch]   = useState("");
//   const [queueSearch,   setQueueSearch]   = useState("");

//   const emptyDoctor  = { name:"", specialization:"", experience:"", timing:"", status:"Available", avgConsultationTime:10 };
//   const emptyService = { name:"", description:"", counter:"", timing:"", status:"Available", avgServiceTimeMinutes:10 };
//   const emptyStaff   = { username:"", email:"", password:"", confirmPassword:"" };

//   const [doctorForm,  setDoctorForm]  = useState(emptyDoctor);
//   const [serviceForm, setServiceForm] = useState(emptyService);
//   const [staffForm,   setStaffForm]   = useState(emptyStaff);

//   useEffect(() => {
//     const role = localStorage.getItem("role");
//     if (role !== "ADMIN" && role !== "SUPER_ADMIN") navigate("/login");
//   }, []);

//   useEffect(() => { fetchAll(); }, []);

//   useEffect(() => {
//     const id = setInterval(fetchQueue, 30000);
//     return () => clearInterval(id);
//   }, []);

//   const fetchAll = async () => {
//     await Promise.all([fetchStats(), fetchDoctors(), fetchServices(), fetchStaff(), fetchQueue()]);
//   };

//   const fetchStats    = async () => { try { const r = await axios.get(`${API}/dashboard-stats`, { headers: authHeaders }); setStats(r.data); } catch(e){} };
//   const fetchDoctors  = async () => { try { const r = await axios.get(`${API}/doctors`,          { headers: authHeaders }); setDoctors(Array.isArray(r.data) ? r.data : []); } catch(e){} };
//   const fetchServices = async () => { try { const r = await axios.get(`${API}/services`,         { headers: authHeaders }); setServices(Array.isArray(r.data) ? r.data : []); } catch(e){} };
//   const fetchStaff    = async () => { try { const r = await axios.get(`${API}/staff`,            { headers: authHeaders }); setStaff(Array.isArray(r.data) ? r.data : []); } catch(e){} };
//   const fetchQueue    = async () => { try { const r = await axios.get(`${API}/queue/today`,      { headers: authHeaders }); setQueue(Array.isArray(r.data) ? r.data : []); } catch(e){} };

//   const showToast = (message, type = "success") => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3500);
//   };

//   const handleLogout = () => { localStorage.clear(); navigate("/login"); };

//   // ── Doctor handlers ────────────────────────────────────────
//   const handleDoctorSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (modal?.data?.id) {
//         await axios.put(`${API}/doctors/${modal.data.id}`, doctorForm, { headers: authHeaders });
//         showToast("Doctor updated!");
//       } else {
//         await axios.post(`${API}/doctors`, doctorForm, { headers: authHeaders });
//         showToast("Doctor added!");
//       }
//       setModal(null); setDoctorForm(emptyDoctor);
//       fetchDoctors(); fetchStats();
//     } catch(e) { showToast(e.response?.data?.message || "Failed.", "error"); }
//   };

//   const handleDeleteDoctor = async (id) => {
//     if (!window.confirm("Delete this doctor?")) return;
//     try { await axios.delete(`${API}/doctors/${id}`, { headers: authHeaders }); showToast("Doctor deleted."); fetchDoctors(); fetchStats(); }
//     catch(e) { showToast(e.response?.data?.message || "Failed.", "error"); }
//   };

//   // ── Service handlers ───────────────────────────────────────
//   const handleServiceSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (modal?.data?.id) {
//         await axios.put(`${API}/services/${modal.data.id}`, serviceForm, { headers: authHeaders });
//         showToast("Service updated!");
//       } else {
//         await axios.post(`${API}/services`, serviceForm, { headers: authHeaders });
//         showToast("Service added!");
//       }
//       setModal(null); setServiceForm(emptyService);
//       fetchServices(); fetchStats();
//     } catch(e) { showToast(e.response?.data?.message || "Failed.", "error"); }
//   };

//   const handleDeleteService = async (id) => {
//     if (!window.confirm("Delete this service?")) return;
//     try { await axios.delete(`${API}/services/${id}`, { headers: authHeaders }); showToast("Service deleted."); fetchServices(); fetchStats(); }
//     catch(e) { showToast(e.response?.data?.message || "Failed.", "error"); }
//   };

//   // ── Staff handlers ─────────────────────────────────────────
//   const handleStaffSubmit = async (e) => {
//     e.preventDefault();
//     if (staffForm.password !== staffForm.confirmPassword) { showToast("Passwords do not match.", "error"); return; }
//     try {
//       await axios.post(`${API}/staff`, { username: staffForm.username, email: staffForm.email, password: staffForm.password }, { headers: authHeaders });
//       showToast("Staff created!"); setModal(null); setStaffForm(emptyStaff); fetchStaff(); fetchStats();
//     } catch(e) { showToast(e.response?.data?.message || "Failed.", "error"); }
//   };

//   const handleDeleteStaff = async (id) => {
//     if (!window.confirm("Remove this staff member?")) return;
//     try { await axios.delete(`${API}/staff/${id}`, { headers: authHeaders }); showToast("Staff removed."); fetchStaff(); fetchStats(); }
//     catch(e) { showToast(e.response?.data?.message || "Failed.", "error"); }
//   };

//   const openEditDoctor  = (d) => { setDoctorForm({ name:d.name, specialization:d.specialization, experience:d.experience, timing:d.timing, status:d.status, avgConsultationTime:d.avgConsultationTime }); setModal({type:"doctor",data:d}); };
//   const openEditService = (s) => { setServiceForm({ name:s.name, description:s.description, counter:s.counter, timing:s.timing, status:s.status, avgServiceTimeMinutes:s.avgServiceTimeMinutes }); setModal({type:"service",data:s}); };

//   const filteredDoctors  = doctors.filter(d  => d.name?.toLowerCase().includes(doctorSearch.toLowerCase())  || d.specialization?.toLowerCase().includes(doctorSearch.toLowerCase()));
//   const filteredServices = services.filter(s => s.name?.toLowerCase().includes(serviceSearch.toLowerCase()) || s.counter?.toLowerCase().includes(serviceSearch.toLowerCase()));
//   const filteredStaff    = staff.filter(s    => s.username?.toLowerCase().includes(staffSearch.toLowerCase()) || s.email?.toLowerCase().includes(staffSearch.toLowerCase()));
//   const filteredQueue    = queue.filter(t    => t.displayToken?.toLowerCase().includes(queueSearch.toLowerCase()) || t.username?.toLowerCase().includes(queueSearch.toLowerCase()) || t.status?.toLowerCase().includes(queueSearch.toLowerCase()));

//   const renderStars = (r) => "★".repeat(Math.floor(r)) + (r%1>=.5?"½":"") + "☆".repeat(5-Math.floor(r)-(r%1>=.5?1:0));

//   const statusColor = (s) => {
//     const m = { BOOKED:"available", CALLED:"busy", IN_PROGRESS:"in_progress", COMPLETED:"completed", CANCELLED:"cancelled", AVAILABLE:"available", ACTIVE:"active", OPEN:"open", CLOSED:"closed", BUSY:"busy" };
//     return m[s?.toUpperCase()] || "available";
//   };

//   const activeQueueCount = queue.filter(t => ["BOOKED","CALLED","IN_PROGRESS"].includes(t.status)).length;

//   const navItems = [
//     { id:"dashboard", label:"Dashboard",    icon:"⊞",  section:"OVERVIEW" },
//     { id:"doctors",   label:"Doctors",      icon:"🩺", section:"MANAGE"   },
//     { id:"services",  label:"Services",     icon:"⚙️",  section:null       },
//     { id:"staff",     label:"Staff",        icon:"👥", section:null       },
//     { id:"queue",     label:"Queue Monitor",icon:"🎫", section:"LIVE", badge: activeQueueCount || null },
//   ];

//   return (
//     <div className={`ad-root ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>

//       {toast && (
//         <div className={`ad-toast ${toast.type}`}>
//           <span>{toast.type==="success"?"✓":"✕"}</span> {toast.message}
//         </div>
//       )}

//       {/* SIDEBAR */}
//       <aside className="ad-sidebar">
//         <div className="ad-sidebar-top">
//           <div className="ad-logo">
//             <div className="ad-logo-mark">Q</div>
//             <div className="ad-logo-text">
//               <span className="ad-logo-name">Queue Master</span>
//               <span className="ad-logo-role">Admin Panel</span>
//             </div>
//           </div>
//           <button className="ad-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
//             {sidebarCollapsed ? "▶" : "◀"}
//           </button>
//         </div>

//         <nav className="ad-nav">
//           {navItems.map(item => (
//             <React.Fragment key={item.id}>
//               {item.section && <div className="ad-nav-section">{item.section}</div>}
//               <button className={`ad-nav-item ${activePage===item.id?"active":""}`} onClick={() => setActivePage(item.id)}>
//                 <span className="ad-nav-icon">{item.icon}</span>
//                 <span className="ad-nav-label">{item.label}</span>
//                 {item.badge > 0 && <span className="ad-nav-badge">{item.badge}</span>}
//               </button>
//             </React.Fragment>
//           ))}
//         </nav>

//         <div className="ad-sidebar-bottom">
//           <div className="ad-user-card">
//             <div className="ad-user-avatar">{username?.charAt(0)?.toUpperCase()||"A"}</div>
//             <div className="ad-user-info">
//               <span className="ad-user-name">{username||"admin"}</span>
//               <span className="ad-user-role">{stats?.branchName||"Branch Admin"}</span>
//             </div>
//           </div>
//           <button className="ad-logout-btn" onClick={handleLogout}><span>⏻</span><span>Logout</span></button>
//         </div>
//       </aside>

//       {/* MAIN */}
//       <main className="ad-main">
//         <header className="ad-topbar">
//           <div className="ad-topbar-left">
//             <h1 className="ad-page-title">{navItems.find(n=>n.id===activePage)?.label||"Dashboard"}</h1>
//             <span className="ad-breadcrumb">Queue Master / {stats?.branchName||"Branch"} / {navItems.find(n=>n.id===activePage)?.label}</span>
//           </div>
//           <div className="ad-topbar-right">
//             <div className="ad-branch-badge"><span className="ad-online-dot"/>{stats?.branchName||"Branch"} — {stats?.branchStatus||"Active"}</div>
//             <button className="ad-refresh-btn" onClick={fetchAll}>↻ Refresh</button>
//           </div>
//         </header>

//         <div className="ad-content">

//           {/* DASHBOARD */}
//           {activePage==="dashboard" && (
//             <>
//               <div className="ad-stats-grid">
//                 {[
//                   {icon:"🩺",cls:"doctors",  val:stats?.totalDoctors??0,          lbl:"Total Doctors",   sub:"In your branch",         page:"doctors" },
//                   {icon:"⚙️", cls:"services", val:stats?.totalServices??0,         lbl:"Branch Services", sub:"Active service counters", page:"services"},
//                   {icon:"👥",cls:"staff",    val:stats?.totalStaff??0,            lbl:"Staff Members",   sub:"Assigned to branch",     page:"staff"   },
//                   {icon:"🎫",cls:"active",   val:stats?.activeTokensToday??0,     lbl:"Active Tokens",   sub:"Today in queue",         page:"queue"   },
//                   {icon:"✅",cls:"completed",val:stats?.completedTokensToday??0,  lbl:"Completed",       sub:"Today",                  page:"queue"   },
//                   {icon:"❌",cls:"cancelled",val:stats?.cancelledTokensToday??0,  lbl:"Cancelled",       sub:"Today",                  page:"queue"   },
//                 ].map(s => (
//                   <div key={s.lbl} className="ad-stat-card" onClick={() => setActivePage(s.page)}>
//                     <div className={`ad-stat-icon ${s.cls}`}>{s.icon}</div>
//                     <div><div className="ad-stat-val">{s.val}</div><div className="ad-stat-lbl">{s.lbl}</div><div className="ad-stat-sub">{s.sub}</div></div>
//                   </div>
//                 ))}
//               </div>

//               <div>
//                 <div className="ad-section-title">Quick Actions</div>
//                 <div className="ad-quick-actions">
//                   {[
//                     {icon:"🩺",label:"Add Doctor",  action:()=>{setModal({type:"doctor",data:null});  setDoctorForm(emptyDoctor);}},
//                     {icon:"⚙️", label:"Add Service", action:()=>{setModal({type:"service",data:null}); setServiceForm(emptyService);}},
//                     {icon:"👤",label:"Add Staff",   action:()=>{setModal({type:"staff",data:null});   setStaffForm(emptyStaff);}},
//                     {icon:"🎫",label:"View Queue",  action:()=> setActivePage("queue")},
//                   ].map(a => (
//                     <button key={a.label} className="ad-quick-btn" onClick={a.action}>
//                       <span className="ad-quick-icon">{a.icon}</span>
//                       <span className="ad-quick-label">{a.label}</span>
//                       <span className="ad-quick-arrow">→</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <div className="ad-section-title">Recent Doctors</div>
//                 <div className="ad-card">
//                   <div className="ad-table-wrap">
//                     <table className="ad-table">
//                       <thead><tr><th>Doctor</th><th>Specialization</th><th>Timing</th><th>Status</th><th>Rating</th></tr></thead>
//                       <tbody>
//                         {doctors.slice(0,5).map(d => (
//                           <tr key={d.id}>
//                             <td><div className="ad-cell-main">🩺 {d.name}</div></td>
//                             <td className="ad-cell-muted">{d.specialization}</td>
//                             <td className="ad-cell-muted">{d.timing||"—"}</td>
//                             <td><span className={`ad-badge ${statusColor(d.status)}`}>{d.status}</span></td>
//                             <td><span className="ad-stars">{renderStars(d.rating)}</span></td>
//                           </tr>
//                         ))}
//                         {doctors.length===0 && <tr><td colSpan={5} className="ad-empty-row">No doctors added yet</td></tr>}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <div className="ad-section-title">Today's Queue — Live</div>
//                 <div className="ad-queue-stats">
//                   {[
//                     {cls:"",         lbl:"Total Today", val:queue.length},
//                     {cls:"active",   lbl:"Active",      val:queue.filter(t=>["BOOKED","CALLED","IN_PROGRESS"].includes(t.status)).length},
//                     {cls:"completed",lbl:"Completed",   val:queue.filter(t=>t.status==="COMPLETED").length},
//                     {cls:"cancelled",lbl:"Cancelled",   val:queue.filter(t=>t.status==="CANCELLED").length},
//                   ].map(s => (
//                     <div key={s.lbl} className={`ad-queue-stat ${s.cls}`}>
//                       <div className="val">{s.val}</div><div className="lbl">{s.lbl}</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </>
//           )}

//           {/* DOCTORS */}
//           {activePage==="doctors" && (
//             <>
//               <div className="ad-page-actions">
//                 <div className="ad-search-box"><span className="ad-search-icon">🔍</span><input placeholder="Search doctors..." value={doctorSearch} onChange={e=>setDoctorSearch(e.target.value)}/></div>
//                 <button className="ad-btn-primary" onClick={()=>{setModal({type:"doctor",data:null});setDoctorForm(emptyDoctor);}}>+ Add Doctor</button>
//               </div>
//               <div className="ad-card">
//                 <div className="ad-card-head"><div><h3>All Doctors</h3><p>{filteredDoctors.length} doctors in your branch</p></div></div>
//                 <div className="ad-table-wrap">
//                   <table className="ad-table">
//                     <thead><tr><th>#</th><th>Doctor</th><th>Specialization</th><th>Experience</th><th>Timing</th><th>Avg. Time</th><th>Status</th><th>Rating</th><th>Actions</th></tr></thead>
//                     <tbody>
//                       {filteredDoctors.map((d,i) => (
//                         <tr key={d.id}>
//                           <td className="ad-cell-muted">{i+1}</td>
//                           <td><div className="ad-cell-user"><div className="ad-cell-avatar">🩺</div><span style={{fontWeight:600}}>{d.name}</span></div></td>
//                           <td className="ad-cell-muted">{d.specialization}</td>
//                           <td className="ad-cell-muted">{d.experience||"—"}</td>
//                           <td className="ad-cell-muted">{d.timing||"—"}</td>
//                           <td className="ad-cell-muted">{d.avgConsultationTime} min</td>
//                           <td><span className={`ad-badge ${statusColor(d.status)}`}>{d.status}</span></td>
//                           <td><span className="ad-stars">{renderStars(d.rating)}</span> {d.rating.toFixed(1)}</td>
//                           <td><div className="ad-btn-actions"><button className="ad-btn-icon edit" onClick={()=>openEditDoctor(d)}>✏️</button><button className="ad-btn-icon del" onClick={()=>handleDeleteDoctor(d.id)}>🗑️</button></div></td>
//                         </tr>
//                       ))}
//                       {filteredDoctors.length===0 && <tr><td colSpan={9} className="ad-empty-row">No doctors found</td></tr>}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </>
//           )}

//           {/* SERVICES */}
//           {activePage==="services" && (
//             <>
//               <div className="ad-page-actions">
//                 <div className="ad-search-box"><span className="ad-search-icon">🔍</span><input placeholder="Search services..." value={serviceSearch} onChange={e=>setServiceSearch(e.target.value)}/></div>
//                 <button className="ad-btn-primary" onClick={()=>{setModal({type:"service",data:null});setServiceForm(emptyService);}}>+ Add Service</button>
//               </div>
//               <div className="ad-card">
//                 <div className="ad-card-head"><div><h3>Branch Services</h3><p>{filteredServices.length} services configured</p></div></div>
//                 <div className="ad-table-wrap">
//                   <table className="ad-table">
//                     <thead><tr><th>#</th><th>Service Name</th><th>Counter</th><th>Timing</th><th>Avg. Time</th><th>Status</th><th>Actions</th></tr></thead>
//                     <tbody>
//                       {filteredServices.map((s,i) => (
//                         <tr key={s.id}>
//                           <td className="ad-cell-muted">{i+1}</td>
//                           <td><div className="ad-cell-user"><div className="ad-cell-avatar">⚙️</div><div><div style={{fontWeight:600}}>{s.name}</div>{s.description&&<div style={{fontSize:"12px",color:"#94a3b8"}}>{s.description}</div>}</div></div></td>
//                           <td className="ad-cell-muted">{s.counter||"—"}</td>
//                           <td className="ad-cell-muted">{s.timing||"—"}</td>
//                           <td className="ad-cell-muted">{s.avgServiceTimeMinutes} min</td>
//                           <td><span className={`ad-badge ${statusColor(s.status)}`}>{s.status}</span></td>
//                           <td><div className="ad-btn-actions"><button className="ad-btn-icon edit" onClick={()=>openEditService(s)}>✏️</button><button className="ad-btn-icon del" onClick={()=>handleDeleteService(s.id)}>🗑️</button></div></td>
//                         </tr>
//                       ))}
//                       {filteredServices.length===0 && <tr><td colSpan={7} className="ad-empty-row">No services found</td></tr>}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </>
//           )}

//           {/* STAFF */}
//           {activePage==="staff" && (
//             <>
//               <div className="ad-page-actions">
//                 <div className="ad-search-box"><span className="ad-search-icon">🔍</span><input placeholder="Search staff..." value={staffSearch} onChange={e=>setStaffSearch(e.target.value)}/></div>
//                 <button className="ad-btn-primary" onClick={()=>{setModal({type:"staff",data:null});setStaffForm(emptyStaff);}}>+ Add Staff</button>
//               </div>
//               <div className="ad-card">
//                 <div className="ad-card-head"><div><h3>Staff Members</h3><p>{filteredStaff.length} staff in your branch</p></div></div>
//                 <div className="ad-table-wrap">
//                   <table className="ad-table">
//                     <thead><tr><th>#</th><th>Staff Member</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
//                     <tbody>
//                       {filteredStaff.map((s,i) => (
//                         <tr key={s.id}>
//                           <td className="ad-cell-muted">{i+1}</td>
//                           <td><div className="ad-cell-user"><div className="ad-cell-avatar">{s.username?.charAt(0)?.toUpperCase()}</div><span style={{fontWeight:600}}>{s.username}</span></div></td>
//                           <td className="ad-cell-muted">{s.email}</td>
//                           <td><span className="ad-badge role-staff">{s.role}</span></td>
//                           <td><button className="ad-btn-icon del" onClick={()=>handleDeleteStaff(s.id)}>🗑️</button></td>
//                         </tr>
//                       ))}
//                       {filteredStaff.length===0 && <tr><td colSpan={5} className="ad-empty-row">No staff members yet</td></tr>}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </>
//           )}

//           {/* QUEUE */}
//           {activePage==="queue" && (
//             <>
//               <div className="ad-queue-stats">
//                 {[
//                   {cls:"",         lbl:"Total Today", val:queue.length},
//                   {cls:"active",   lbl:"Active",      val:queue.filter(t=>["BOOKED","CALLED","IN_PROGRESS"].includes(t.status)).length},
//                   {cls:"completed",lbl:"Completed",   val:queue.filter(t=>t.status==="COMPLETED").length},
//                   {cls:"cancelled",lbl:"Cancelled",   val:queue.filter(t=>t.status==="CANCELLED").length},
//                 ].map(s => (
//                   <div key={s.lbl} className={`ad-queue-stat ${s.cls}`}>
//                     <div className="val">{s.val}</div><div className="lbl">{s.lbl}</div>
//                   </div>
//                 ))}
//               </div>
//               <div className="ad-page-actions">
//                 <div className="ad-search-box"><span className="ad-search-icon">🔍</span><input placeholder="Search by token, user, status..." value={queueSearch} onChange={e=>setQueueSearch(e.target.value)}/></div>
//                 <button className="ad-btn-secondary" onClick={fetchQueue}>↻ Refresh</button>
//               </div>
//               <div className="ad-card">
//                 <div className="ad-card-head"><div><h3>Today's Queue</h3><p>Auto-refreshes every 30 seconds</p></div></div>
//                 <div className="ad-table-wrap">
//                   <table className="ad-table">
//                     <thead><tr><th>#</th><th>Token</th><th>Customer</th><th>Service</th><th>Type</th><th>Status</th><th>Date</th></tr></thead>
//                     <tbody>
//                       {filteredQueue.map((t,i) => (
//                         <tr key={t.id}>
//                           <td className="ad-cell-muted">{i+1}</td>
//                           <td><span style={{fontWeight:700,fontSize:"15px",color:"#2563eb"}}>{t.displayToken}</span></td>
//                           <td><div className="ad-cell-user"><div className="ad-cell-avatar">{t.username?.charAt(0)?.toUpperCase()}</div><span>{t.username}</span></div></td>
//                           <td className="ad-cell-muted">{t.serviceName}</td>
//                           <td><span className={`ad-badge type-${t.queueType?.toLowerCase()}`}>{t.queueType==="DOCTOR"?"🩺 Doctor":"⚙️ Service"}</span></td>
//                           <td><span className={`ad-badge ${statusColor(t.status)}`}>{t.status}</span></td>
//                           <td className="ad-cell-muted">{t.bookingDate}</td>
//                         </tr>
//                       ))}
//                       {filteredQueue.length===0 && <tr><td colSpan={7} className="ad-empty-row">No tokens in queue today</td></tr>}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </>
//           )}

//         </div>
//       </main>

//       {/* DOCTOR MODAL */}
//       {modal?.type==="doctor" && (
//         <div className="ad-modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
//           <div className="ad-modal">
//             <div className="ad-modal-head">
//               <div><h3>{modal.data?"Edit Doctor":"Add New Doctor"}</h3><p>{modal.data?"Update doctor details":"Add a doctor to your branch"}</p></div>
//               <button className="ad-modal-close" onClick={()=>setModal(null)}>✕</button>
//             </div>
//             <form onSubmit={handleDoctorSubmit}>
//               <div className="ad-modal-body">
//                 <div className="ad-modal-form">
//                   <div className="ad-form-group"><label>Full Name <span className="req">*</span></label><input placeholder="e.g. Dr. Rajesh Kumar" value={doctorForm.name} required onChange={e=>setDoctorForm({...doctorForm,name:e.target.value})}/></div>
//                   <div className="ad-form-group"><label>Specialization <span className="req">*</span></label><input placeholder="e.g. Cardiology" value={doctorForm.specialization} required onChange={e=>setDoctorForm({...doctorForm,specialization:e.target.value})}/></div>
//                   <div className="ad-form-group"><label>Experience</label><input placeholder="e.g. 10 years" value={doctorForm.experience} onChange={e=>setDoctorForm({...doctorForm,experience:e.target.value})}/></div>
//                   <div className="ad-form-group"><label>Timing</label><input placeholder="e.g. 9AM - 1PM" value={doctorForm.timing} onChange={e=>setDoctorForm({...doctorForm,timing:e.target.value})}/></div>
//                   <div className="ad-form-group"><label>Avg. Consultation (min)</label><input type="number" min="1" max="120" value={doctorForm.avgConsultationTime} onChange={e=>setDoctorForm({...doctorForm,avgConsultationTime:parseInt(e.target.value)})}/></div>
//                   <div className="ad-form-group"><label>Status</label><select value={doctorForm.status} onChange={e=>setDoctorForm({...doctorForm,status:e.target.value})}><option>Available</option><option>Busy</option><option>On Leave</option><option>Inactive</option></select></div>
//                 </div>
//               </div>
//               <div className="ad-modal-actions">
//                 <button type="button" className="ad-btn-secondary" onClick={()=>setModal(null)}>Cancel</button>
//                 <button type="submit" className="ad-btn-primary">{modal.data?"Update Doctor":"Add Doctor"}</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* SERVICE MODAL */}
//       {modal?.type==="service" && (
//         <div className="ad-modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
//           <div className="ad-modal">
//             <div className="ad-modal-head">
//               <div><h3>{modal.data?"Edit Service":"Add New Service"}</h3><p>{modal.data?"Update service details":"Add a service to your branch"}</p></div>
//               <button className="ad-modal-close" onClick={()=>setModal(null)}>✕</button>
//             </div>
//             <form onSubmit={handleServiceSubmit}>
//               <div className="ad-modal-body">
//                 <div className="ad-modal-form">
//                   <div className="ad-form-group"><label>Service Name <span className="req">*</span></label><input placeholder="e.g. Account Opening" value={serviceForm.name} required onChange={e=>setServiceForm({...serviceForm,name:e.target.value})}/></div>
//                   <div className="ad-form-group"><label>Description</label><input placeholder="Brief description" value={serviceForm.description} onChange={e=>setServiceForm({...serviceForm,description:e.target.value})}/></div>
//                   <div className="ad-form-group"><label>Counter</label><input placeholder="e.g. Counter A" value={serviceForm.counter} onChange={e=>setServiceForm({...serviceForm,counter:e.target.value})}/></div>
//                   <div className="ad-form-group"><label>Timing</label><input placeholder="e.g. 10AM - 4PM" value={serviceForm.timing} onChange={e=>setServiceForm({...serviceForm,timing:e.target.value})}/></div>
//                   <div className="ad-form-group"><label>Avg. Service Time (min)</label><input type="number" min="1" max="120" value={serviceForm.avgServiceTimeMinutes} onChange={e=>setServiceForm({...serviceForm,avgServiceTimeMinutes:parseInt(e.target.value)})}/></div>
//                   <div className="ad-form-group"><label>Status</label><select value={serviceForm.status} onChange={e=>setServiceForm({...serviceForm,status:e.target.value})}><option>Available</option><option>Busy</option><option>Closed</option></select></div>
//                 </div>
//               </div>
//               <div className="ad-modal-actions">
//                 <button type="button" className="ad-btn-secondary" onClick={()=>setModal(null)}>Cancel</button>
//                 <button type="submit" className="ad-btn-primary">{modal.data?"Update Service":"Add Service"}</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* STAFF MODAL */}
//       {modal?.type==="staff" && (
//         <div className="ad-modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
//           <div className="ad-modal">
//             <div className="ad-modal-head">
//               <div><h3>Create Staff Account</h3><p>Staff will be assigned to your branch automatically</p></div>
//               <button className="ad-modal-close" onClick={()=>setModal(null)}>✕</button>
//             </div>
//             <form onSubmit={handleStaffSubmit}>
//               <div className="ad-modal-body">
//                 <div className="ad-modal-form">
//                   <div className="ad-form-group"><label>Username <span className="req">*</span></label><input placeholder="e.g. staff_raj" value={staffForm.username} required onChange={e=>setStaffForm({...staffForm,username:e.target.value})}/></div>
//                   <div className="ad-form-group"><label>Email Address <span className="req">*</span></label><input type="email" placeholder="staff@branch.com" value={staffForm.email} required onChange={e=>setStaffForm({...staffForm,email:e.target.value})}/></div>
//                   <div className="ad-form-group"><label>Password <span className="req">*</span></label><input type="password" placeholder="Set a strong password" value={staffForm.password} required onChange={e=>setStaffForm({...staffForm,password:e.target.value})}/></div>
//                   <div className="ad-form-group"><label>Confirm Password <span className="req">*</span></label><input type="password" placeholder="Repeat password" value={staffForm.confirmPassword} required onChange={e=>setStaffForm({...staffForm,confirmPassword:e.target.value})}/></div>
//                 </div>
//               </div>
//               <div className="ad-modal-actions">
//                 <button type="button" className="ad-btn-secondary" onClick={()=>setModal(null)}>Cancel</button>
//                 <button type="submit" className="ad-btn-primary">Create Staff</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default AdminDashboard;





// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "../styles/AdminDashboard.scss";

// const API = "http://localhost:8080/api/admin";

// const AdminDashboard = () => {
//   const navigate    = useNavigate();
//   const token       = localStorage.getItem("token");
//   const username    = localStorage.getItem("username");
//   const authHeaders = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

//   const [activePage,       setActivePage]       = useState("dashboard");
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [toast,            setToast]            = useState(null);
//   const [modal,            setModal]            = useState(null);

//   const [stats,    setStats]    = useState(null);
//   const [doctors,  setDoctors]  = useState([]);
//   const [services, setServices] = useState([]);
//   const [staff,    setStaff]    = useState([]);
//   const [queue,    setQueue]    = useState([]);

//   const [doctorSearch,  setDoctorSearch]  = useState("");
//   const [serviceSearch, setServiceSearch] = useState("");
//   const [staffSearch,   setStaffSearch]   = useState("");
//   const [queueSearch,   setQueueSearch]   = useState("");

//   const emptyDoctor  = { name:"", specialization:"", experience:"", timing:"", status:"Available", avgConsultationTime:10 };
//   const emptyService = { name:"", description:"", counter:"", timing:"", status:"Available", avgServiceTimeMinutes:10 };
//   const emptyStaff   = { username:"", email:"", password:"", confirmPassword:"" };

//   const [doctorForm,  setDoctorForm]  = useState(emptyDoctor);
//   const [serviceForm, setServiceForm] = useState(emptyService);
//   const [staffForm,   setStaffForm]   = useState(emptyStaff);

//   // ✅ Hospital = category 1, others = Bank/Govt/Hotel
//   const isHospital = stats?.branchCategoryId === 1;

//   useEffect(() => {
//     const role = localStorage.getItem("role");
//     if (role !== "ADMIN" && role !== "SUPER_ADMIN") navigate("/login");
//   }, []);

//   useEffect(() => { fetchAll(); }, []);

//   useEffect(() => {
//     const id = setInterval(fetchQueue, 30000);
//     return () => clearInterval(id);
//   }, []);

//   const fetchAll = async () => {
//     await Promise.all([fetchStats(), fetchDoctors(), fetchServices(), fetchStaff(), fetchQueue()]);
//   };

//   const fetchStats    = async () => { try { const r = await axios.get(`${API}/dashboard-stats`, { headers: authHeaders }); setStats(r.data); } catch(e){} };
//   const fetchDoctors  = async () => { try { const r = await axios.get(`${API}/doctors`,          { headers: authHeaders }); setDoctors(Array.isArray(r.data) ? r.data : []); } catch(e){} };
//   const fetchServices = async () => { try { const r = await axios.get(`${API}/services`,         { headers: authHeaders }); setServices(Array.isArray(r.data) ? r.data : []); } catch(e){} };
//   const fetchStaff    = async () => { try { const r = await axios.get(`${API}/staff`,            { headers: authHeaders }); setStaff(Array.isArray(r.data) ? r.data : []); } catch(e){} };
//   const fetchQueue    = async () => { try { const r = await axios.get(`${API}/queue/today`,      { headers: authHeaders }); setQueue(Array.isArray(r.data) ? r.data : []); } catch(e){} };

//   const showToast = (message, type = "success") => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3500);
//   };

//   const handleLogout = () => { localStorage.clear(); navigate("/login"); };

//   // ── Doctor handlers ────────────────────────────────────────
//   const handleDoctorSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (modal?.data?.id) {
//         await axios.put(`${API}/doctors/${modal.data.id}`, doctorForm, { headers: authHeaders });
//         showToast("Doctor updated!");
//       } else {
//         await axios.post(`${API}/doctors`, doctorForm, { headers: authHeaders });
//         showToast("Doctor added!");
//       }
//       setModal(null); setDoctorForm(emptyDoctor);
//       fetchDoctors(); fetchStats();
//     } catch(e) { showToast(e.response?.data?.message || "Failed.", "error"); }
//   };

//   const handleDeleteDoctor = async (id) => {
//     if (!window.confirm("Delete this doctor?")) return;
//     try {
//       await axios.delete(`${API}/doctors/${id}`, { headers: authHeaders });
//       showToast("Doctor deleted."); fetchDoctors(); fetchStats();
//     } catch(e) { showToast(e.response?.data?.message || "Failed.", "error"); }
//   };

//   // ── Service handlers ───────────────────────────────────────
//   const handleServiceSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (modal?.data?.id) {
//         await axios.put(`${API}/services/${modal.data.id}`, serviceForm, { headers: authHeaders });
//         showToast("Service updated!");
//       } else {
//         await axios.post(`${API}/services`, serviceForm, { headers: authHeaders });
//         showToast("Service added!");
//       }
//       setModal(null); setServiceForm(emptyService);
//       fetchServices(); fetchStats();
//     } catch(e) { showToast(e.response?.data?.message || "Failed.", "error"); }
//   };

//   const handleDeleteService = async (id) => {
//     if (!window.confirm("Delete this service?")) return;
//     try {
//       await axios.delete(`${API}/services/${id}`, { headers: authHeaders });
//       showToast("Service deleted."); fetchServices(); fetchStats();
//     } catch(e) { showToast(e.response?.data?.message || "Failed.", "error"); }
//   };

//   // ── Staff handlers ─────────────────────────────────────────
//   const handleStaffSubmit = async (e) => {
//     e.preventDefault();
//     if (staffForm.password !== staffForm.confirmPassword) {
//       showToast("Passwords do not match.", "error"); return;
//     }
//     try {
//       await axios.post(`${API}/staff`, {
//         username: staffForm.username,
//         email:    staffForm.email,
//         password: staffForm.password
//       }, { headers: authHeaders });
//       showToast("Staff created!"); setModal(null);
//       setStaffForm(emptyStaff); fetchStaff(); fetchStats();
//     } catch(e) { showToast(e.response?.data?.message || "Failed.", "error"); }
//   };

//   const handleDeleteStaff = async (id) => {
//     if (!window.confirm("Remove this staff member?")) return;
//     try {
//       await axios.delete(`${API}/staff/${id}`, { headers: authHeaders });
//       showToast("Staff removed."); fetchStaff(); fetchStats();
//     } catch(e) { showToast(e.response?.data?.message || "Failed.", "error"); }
//   };

//   const openEditDoctor  = (d) => {
//     setDoctorForm({ name:d.name, specialization:d.specialization,
//       experience:d.experience, timing:d.timing, status:d.status,
//       avgConsultationTime:d.avgConsultationTime });
//     setModal({ type:"doctor", data:d });
//   };

//   const openEditService = (s) => {
//     setServiceForm({ name:s.name, description:s.description,
//       counter:s.counter, timing:s.timing, status:s.status,
//       avgServiceTimeMinutes:s.avgServiceTimeMinutes });
//     setModal({ type:"service", data:s });
//   };

//   const filteredDoctors  = doctors.filter(d =>
//     d.name?.toLowerCase().includes(doctorSearch.toLowerCase()) ||
//     d.specialization?.toLowerCase().includes(doctorSearch.toLowerCase()));

//   const filteredServices = services.filter(s =>
//     s.name?.toLowerCase().includes(serviceSearch.toLowerCase()) ||
//     s.counter?.toLowerCase().includes(serviceSearch.toLowerCase()));

//   const filteredStaff = staff.filter(s =>
//     s.username?.toLowerCase().includes(staffSearch.toLowerCase()) ||
//     s.email?.toLowerCase().includes(staffSearch.toLowerCase()));

//   const filteredQueue = queue.filter(t =>
//     t.displayToken?.toLowerCase().includes(queueSearch.toLowerCase()) ||
//     t.username?.toLowerCase().includes(queueSearch.toLowerCase()) ||
//     t.status?.toLowerCase().includes(queueSearch.toLowerCase()));

//   const renderStars  = (r) => "★".repeat(Math.floor(r)) + (r%1>=.5?"½":"") + "☆".repeat(5-Math.floor(r)-(r%1>=.5?1:0));
//   const statusColor  = (s) => {
//     const m = { BOOKED:"available", CALLED:"busy", IN_PROGRESS:"in_progress",
//                 COMPLETED:"completed", CANCELLED:"cancelled", AVAILABLE:"available",
//                 ACTIVE:"active", OPEN:"open", CLOSED:"closed", BUSY:"busy" };
//     return m[s?.toUpperCase()] || "available";
//   };

//   const activeQueueCount = queue.filter(t =>
//     ["BOOKED","CALLED","IN_PROGRESS"].includes(t.status)).length;

//   // ✅ Nav items based on branch type
//   const navItems = [
//     { id:"dashboard", label:"Dashboard",    icon:"⊞",  section:"OVERVIEW" },
//     // Hospital → Doctors only
//     ...(isHospital ? [
//       { id:"doctors",  label:"Doctors",  icon:"🩺", section:"MANAGE" }
//     ] : []),
//     // Non-Hospital → Services only
//     ...(!isHospital ? [
//       { id:"services", label:"Services", icon:"⚙️",  section:"MANAGE" }
//     ] : []),
//     { id:"staff", label:"Staff",         icon:"👥", section:null },
//     { id:"queue", label:"Queue Monitor", icon:"🎫", section:"LIVE",
//       badge: activeQueueCount || null },
//   ];

//   return (
//     <div className={`ad-root ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>

//       {toast && (
//         <div className={`ad-toast ${toast.type}`}>
//           <span>{toast.type==="success" ? "✓" : "✕"}</span> {toast.message}
//         </div>
//       )}

//       {/* SIDEBAR */}
//       <aside className="ad-sidebar">
//         <div className="ad-sidebar-top">
//           <div className="ad-logo">
//             <div className="ad-logo-mark">Q</div>
//             <div className="ad-logo-text">
//               <span className="ad-logo-name">Queue Master</span>
//               <span className="ad-logo-role">Admin Panel</span>
//             </div>
//           </div>
//           <button className="ad-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
//             {sidebarCollapsed ? "▶" : "◀"}
//           </button>
//         </div>

//         <nav className="ad-nav">
//           {navItems.map(item => (
//             <React.Fragment key={item.id}>
//               {item.section && <div className="ad-nav-section">{item.section}</div>}
//               <button
//                 className={`ad-nav-item ${activePage===item.id ? "active" : ""}`}
//                 onClick={() => setActivePage(item.id)}
//               >
//                 <span className="ad-nav-icon">{item.icon}</span>
//                 <span className="ad-nav-label">{item.label}</span>
//                 {item.badge > 0 && <span className="ad-nav-badge">{item.badge}</span>}
//               </button>
//             </React.Fragment>
//           ))}
//         </nav>

//         <div className="ad-sidebar-bottom">
//           <div className="ad-user-card">
//             <div className="ad-user-avatar">{username?.charAt(0)?.toUpperCase() || "A"}</div>
//             <div className="ad-user-info">
//               <span className="ad-user-name">{username || "admin"}</span>
//               <span className="ad-user-role">{stats?.branchName || "Branch Admin"}</span>
//             </div>
//           </div>
//           <button className="ad-logout-btn" onClick={handleLogout}>
//             <span>⏻</span><span>Logout</span>
//           </button>
//         </div>
//       </aside>

//       {/* MAIN */}
//       <main className="ad-main">
//         <header className="ad-topbar">
//           <div className="ad-topbar-left">
//             <h1 className="ad-page-title">
//               {navItems.find(n => n.id===activePage)?.label || "Dashboard"}
//             </h1>
//             <span className="ad-breadcrumb">
//               Queue Master / {stats?.branchName || "Branch"} /&nbsp;
//               {navItems.find(n => n.id===activePage)?.label}
//             </span>
//           </div>
//           <div className="ad-topbar-right">
//             <div className="ad-branch-badge">
//               <span className="ad-online-dot"/>
//               {stats?.branchName || "Branch"} — {stats?.branchStatus || "Active"}
//             </div>
//             <button className="ad-refresh-btn" onClick={fetchAll}>↻ Refresh</button>
//           </div>
//         </header>

//         <div className="ad-content">

//           {/* DASHBOARD */}
//           {activePage === "dashboard" && (
//             <>
//               <div className="ad-stats-grid">
//                 {[
//                   // ✅ Show doctor stat for hospital, service stat for others
//                   isHospital
//                     ? {icon:"🩺",cls:"doctors",  val:stats?.totalDoctors??0,         lbl:"Total Doctors",   sub:"In your branch",         page:"doctors" }
//                     : {icon:"⚙️", cls:"services", val:stats?.totalServices??0,        lbl:"Branch Services", sub:"Active service counters", page:"services"},
//                   {icon:"👥",cls:"staff",    val:stats?.totalStaff??0,             lbl:"Staff Members",   sub:"Assigned to branch",     page:"staff"   },
//                   {icon:"🎫",cls:"active",   val:stats?.activeTokensToday??0,      lbl:"Active Tokens",   sub:"Today in queue",         page:"queue"   },
//                   {icon:"✅",cls:"completed",val:stats?.completedTokensToday??0,   lbl:"Completed",       sub:"Today",                  page:"queue"   },
//                   {icon:"❌",cls:"cancelled",val:stats?.cancelledTokensToday??0,   lbl:"Cancelled",       sub:"Today",                  page:"queue"   },
//                 ].map(s => (
//                   <div key={s.lbl} className="ad-stat-card" onClick={() => setActivePage(s.page)}>
//                     <div className={`ad-stat-icon ${s.cls}`}>{s.icon}</div>
//                     <div>
//                       <div className="ad-stat-val">{s.val}</div>
//                       <div className="ad-stat-lbl">{s.lbl}</div>
//                       <div className="ad-stat-sub">{s.sub}</div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Quick Actions — based on branch type */}
//               <div>
//                 <div className="ad-section-title">Quick Actions</div>
//                 <div className="ad-quick-actions">
//                   {[
//                     // ✅ Hospital → Add Doctor, Others → Add Service
//                     ...(isHospital
//                       ? [{ icon:"🩺", label:"Add Doctor",  action:() => { setModal({type:"doctor",data:null});  setDoctorForm(emptyDoctor);  }}]
//                       : [{ icon:"⚙️",  label:"Add Service", action:() => { setModal({type:"service",data:null}); setServiceForm(emptyService); }}]
//                     ),
//                     { icon:"👤", label:"Add Staff",   action:() => { setModal({type:"staff",data:null}); setStaffForm(emptyStaff); }},
//                     { icon:"🎫", label:"View Queue",  action:() => setActivePage("queue") },
//                   ].map(a => (
//                     <button key={a.label} className="ad-quick-btn" onClick={a.action}>
//                       <span className="ad-quick-icon">{a.icon}</span>
//                       <span className="ad-quick-label">{a.label}</span>
//                       <span className="ad-quick-arrow">→</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Recent Doctors — Hospital only */}
//               {isHospital && (
//                 <div>
//                   <div className="ad-section-title">Recent Doctors</div>
//                   <div className="ad-card">
//                     <div className="ad-table-wrap">
//                       <table className="ad-table">
//                         <thead><tr><th>Doctor</th><th>Specialization</th><th>Timing</th><th>Status</th><th>Rating</th></tr></thead>
//                         <tbody>
//                           {doctors.slice(0,5).map(d => (
//                             <tr key={d.id}>
//                               <td><div className="ad-cell-main">🩺 {d.name}</div></td>
//                               <td className="ad-cell-muted">{d.specialization}</td>
//                               <td className="ad-cell-muted">{d.timing || "—"}</td>
//                               <td><span className={`ad-badge ${statusColor(d.status)}`}>{d.status}</span></td>
//                               <td><span className="ad-stars">{renderStars(d.rating)}</span></td>
//                             </tr>
//                           ))}
//                           {doctors.length === 0 && <tr><td colSpan={5} className="ad-empty-row">No doctors added yet</td></tr>}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Recent Services — Non-Hospital only */}
//               {!isHospital && (
//                 <div>
//                   <div className="ad-section-title">Recent Services</div>
//                   <div className="ad-card">
//                     <div className="ad-table-wrap">
//                       <table className="ad-table">
//                         <thead><tr><th>Service</th><th>Counter</th><th>Timing</th><th>Avg. Time</th><th>Status</th></tr></thead>
//                         <tbody>
//                           {services.slice(0,5).map(s => (
//                             <tr key={s.id}>
//                               <td><div className="ad-cell-main">⚙️ {s.name}</div></td>
//                               <td className="ad-cell-muted">{s.counter || "—"}</td>
//                               <td className="ad-cell-muted">{s.timing  || "—"}</td>
//                               <td className="ad-cell-muted">{s.avgServiceTimeMinutes} min</td>
//                               <td><span className={`ad-badge ${statusColor(s.status)}`}>{s.status}</span></td>
//                             </tr>
//                           ))}
//                           {services.length === 0 && <tr><td colSpan={5} className="ad-empty-row">No services added yet</td></tr>}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Live Queue */}
//               <div>
//                 <div className="ad-section-title">Today's Queue — Live</div>
//                 <div className="ad-queue-stats">
//                   {[
//                     { cls:"",          lbl:"Total Today", val:queue.length },
//                     { cls:"active",    lbl:"Active",      val:queue.filter(t=>["BOOKED","CALLED","IN_PROGRESS"].includes(t.status)).length },
//                     { cls:"completed", lbl:"Completed",   val:queue.filter(t=>t.status==="COMPLETED").length },
//                     { cls:"cancelled", lbl:"Cancelled",   val:queue.filter(t=>t.status==="CANCELLED").length },
//                   ].map(s => (
//                     <div key={s.lbl} className={`ad-queue-stat ${s.cls}`}>
//                       <div className="val">{s.val}</div>
//                       <div className="lbl">{s.lbl}</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </>
//           )}

//           {/* DOCTORS — Hospital only */}
//           {activePage === "doctors" && isHospital && (
//             <>
//               <div className="ad-page-actions">
//                 <div className="ad-search-box">
//                   <span className="ad-search-icon">🔍</span>
//                   <input placeholder="Search doctors..." value={doctorSearch}
//                     onChange={e => setDoctorSearch(e.target.value)}/>
//                 </div>
//                 <button className="ad-btn-primary"
//                   onClick={() => { setModal({type:"doctor",data:null}); setDoctorForm(emptyDoctor); }}>
//                   + Add Doctor
//                 </button>
//               </div>
//               <div className="ad-card">
//                 <div className="ad-card-head">
//                   <div><h3>All Doctors</h3><p>{filteredDoctors.length} doctors in your branch</p></div>
//                 </div>
//                 <div className="ad-table-wrap">
//                   <table className="ad-table">
//                     <thead>
//                       <tr><th>#</th><th>Doctor</th><th>Specialization</th><th>Experience</th><th>Timing</th><th>Avg. Time</th><th>Status</th><th>Rating</th><th>Actions</th></tr>
//                     </thead>
//                     <tbody>
//                       {filteredDoctors.map((d,i) => (
//                         <tr key={d.id}>
//                           <td className="ad-cell-muted">{i+1}</td>
//                           <td><div className="ad-cell-user"><div className="ad-cell-avatar">🩺</div><span style={{fontWeight:600}}>{d.name}</span></div></td>
//                           <td className="ad-cell-muted">{d.specialization}</td>
//                           <td className="ad-cell-muted">{d.experience || "—"}</td>
//                           <td className="ad-cell-muted">{d.timing || "—"}</td>
//                           <td className="ad-cell-muted">{d.avgConsultationTime} min</td>
//                           <td><span className={`ad-badge ${statusColor(d.status)}`}>{d.status}</span></td>
//                           <td><span className="ad-stars">{renderStars(d.rating)}</span> {d.rating.toFixed(1)}</td>
//                           <td>
//                             <div className="ad-btn-actions">
//                               <button className="ad-btn-icon edit" onClick={() => openEditDoctor(d)}>✏️</button>
//                               <button className="ad-btn-icon del"  onClick={() => handleDeleteDoctor(d.id)}>🗑️</button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                       {filteredDoctors.length === 0 && <tr><td colSpan={9} className="ad-empty-row">No doctors found</td></tr>}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </>
//           )}

//           {/* SERVICES — Non-Hospital only */}
//           {activePage === "services" && !isHospital && (
//             <>
//               <div className="ad-page-actions">
//                 <div className="ad-search-box">
//                   <span className="ad-search-icon">🔍</span>
//                   <input placeholder="Search services..." value={serviceSearch}
//                     onChange={e => setServiceSearch(e.target.value)}/>
//                 </div>
//                 <button className="ad-btn-primary"
//                   onClick={() => { setModal({type:"service",data:null}); setServiceForm(emptyService); }}>
//                   + Add Service
//                 </button>
//               </div>
//               <div className="ad-card">
//                 <div className="ad-card-head">
//                   <div><h3>Branch Services</h3><p>{filteredServices.length} services configured</p></div>
//                 </div>
//                 <div className="ad-table-wrap">
//                   <table className="ad-table">
//                     <thead>
//                       <tr><th>#</th><th>Service Name</th><th>Counter</th><th>Timing</th><th>Avg. Time</th><th>Status</th><th>Actions</th></tr>
//                     </thead>
//                     <tbody>
//                       {filteredServices.map((s,i) => (
//                         <tr key={s.id}>
//                           <td className="ad-cell-muted">{i+1}</td>
//                           <td>
//                             <div className="ad-cell-user">
//                               <div className="ad-cell-avatar">⚙️</div>
//                               <div>
//                                 <div style={{fontWeight:600}}>{s.name}</div>
//                                 {s.description && <div style={{fontSize:"12px",color:"#94a3b8"}}>{s.description}</div>}
//                               </div>
//                             </div>
//                           </td>
//                           <td className="ad-cell-muted">{s.counter || "—"}</td>
//                           <td className="ad-cell-muted">{s.timing  || "—"}</td>
//                           <td className="ad-cell-muted">{s.avgServiceTimeMinutes} min</td>
//                           <td><span className={`ad-badge ${statusColor(s.status)}`}>{s.status}</span></td>
//                           <td>
//                             <div className="ad-btn-actions">
//                               <button className="ad-btn-icon edit" onClick={() => openEditService(s)}>✏️</button>
//                               <button className="ad-btn-icon del"  onClick={() => handleDeleteService(s.id)}>🗑️</button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                       {filteredServices.length === 0 && <tr><td colSpan={7} className="ad-empty-row">No services found</td></tr>}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </>
//           )}

//           {/* STAFF */}
//           {activePage === "staff" && (
//             <>
//               <div className="ad-page-actions">
//                 <div className="ad-search-box">
//                   <span className="ad-search-icon">🔍</span>
//                   <input placeholder="Search staff..." value={staffSearch}
//                     onChange={e => setStaffSearch(e.target.value)}/>
//                 </div>
//                 <button className="ad-btn-primary"
//                   onClick={() => { setModal({type:"staff",data:null}); setStaffForm(emptyStaff); }}>
//                   + Add Staff
//                 </button>
//               </div>
//               <div className="ad-card">
//                 <div className="ad-card-head">
//                   <div><h3>Staff Members</h3><p>{filteredStaff.length} staff in your branch</p></div>
//                 </div>
//                 <div className="ad-table-wrap">
//                   <table className="ad-table">
//                     <thead>
//                       <tr><th>#</th><th>Staff Member</th><th>Email</th><th>Role</th><th>Actions</th></tr>
//                     </thead>
//                     <tbody>
//                       {filteredStaff.map((s,i) => (
//                         <tr key={s.id}>
//                           <td className="ad-cell-muted">{i+1}</td>
//                           <td><div className="ad-cell-user"><div className="ad-cell-avatar">{s.username?.charAt(0)?.toUpperCase()}</div><span style={{fontWeight:600}}>{s.username}</span></div></td>
//                           <td className="ad-cell-muted">{s.email}</td>
//                           <td><span className="ad-badge role-staff">{s.role}</span></td>
//                           <td><button className="ad-btn-icon del" onClick={() => handleDeleteStaff(s.id)}>🗑️</button></td>
//                         </tr>
//                       ))}
//                       {filteredStaff.length === 0 && <tr><td colSpan={5} className="ad-empty-row">No staff members yet</td></tr>}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </>
//           )}

//           {/* QUEUE */}
//           {activePage === "queue" && (
//             <>
//               <div className="ad-queue-stats">
//                 {[
//                   { cls:"",          lbl:"Total Today", val:queue.length },
//                   { cls:"active",    lbl:"Active",      val:queue.filter(t=>["BOOKED","CALLED","IN_PROGRESS"].includes(t.status)).length },
//                   { cls:"completed", lbl:"Completed",   val:queue.filter(t=>t.status==="COMPLETED").length },
//                   { cls:"cancelled", lbl:"Cancelled",   val:queue.filter(t=>t.status==="CANCELLED").length },
//                 ].map(s => (
//                   <div key={s.lbl} className={`ad-queue-stat ${s.cls}`}>
//                     <div className="val">{s.val}</div>
//                     <div className="lbl">{s.lbl}</div>
//                   </div>
//                 ))}
//               </div>
//               <div className="ad-page-actions">
//                 <div className="ad-search-box">
//                   <span className="ad-search-icon">🔍</span>
//                   <input placeholder="Search by token, user, status..."
//                     value={queueSearch} onChange={e => setQueueSearch(e.target.value)}/>
//                 </div>
//                 <button className="ad-btn-secondary" onClick={fetchQueue}>↻ Refresh</button>
//               </div>
//               <div className="ad-card">
//                 <div className="ad-card-head">
//                   <div><h3>Today's Queue</h3><p>Auto-refreshes every 30 seconds</p></div>
//                 </div>
//                 <div className="ad-table-wrap">
//                   <table className="ad-table">
//                     <thead>
//                       <tr><th>#</th><th>Token</th><th>Customer</th><th>Service</th><th>Type</th><th>Status</th><th>Date</th></tr>
//                     </thead>
//                     <tbody>
//                       {filteredQueue.map((t,i) => (
//                         <tr key={t.id}>
//                           <td className="ad-cell-muted">{i+1}</td>
//                           <td><span style={{fontWeight:700,fontSize:"15px",color:"#2563eb"}}>{t.displayToken}</span></td>
//                           <td><div className="ad-cell-user"><div className="ad-cell-avatar">{t.username?.charAt(0)?.toUpperCase()}</div><span>{t.username}</span></div></td>
//                           <td className="ad-cell-muted">{t.serviceName}</td>
//                           <td><span className={`ad-badge type-${t.queueType?.toLowerCase()}`}>{t.queueType==="DOCTOR" ? "🩺 Doctor" : "⚙️ Service"}</span></td>
//                           <td><span className={`ad-badge ${statusColor(t.status)}`}>{t.status}</span></td>
//                           <td className="ad-cell-muted">{t.bookingDate}</td>
//                         </tr>
//                       ))}
//                       {filteredQueue.length === 0 && <tr><td colSpan={7} className="ad-empty-row">No tokens in queue today</td></tr>}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </>
//           )}

//         </div>
//       </main>

//       {/* DOCTOR MODAL */}
//       {modal?.type === "doctor" && (
//         <div className="ad-modal-overlay" onClick={e => e.target===e.currentTarget && setModal(null)}>
//           <div className="ad-modal">
//             <div className="ad-modal-head">
//               <div><h3>{modal.data ? "Edit Doctor" : "Add New Doctor"}</h3><p>{modal.data ? "Update doctor details" : "Add a doctor to your branch"}</p></div>
//               <button className="ad-modal-close" onClick={() => setModal(null)}>✕</button>
//             </div>
//             <form onSubmit={handleDoctorSubmit}>
//               <div className="ad-modal-body">
//                 <div className="ad-modal-form">
//                   <div className="ad-form-group"><label>Full Name <span className="req">*</span></label><input placeholder="e.g. Dr. Rajesh Kumar" value={doctorForm.name} required onChange={e=>setDoctorForm({...doctorForm,name:e.target.value})}/></div>
//                   <div className="ad-form-group"><label>Specialization <span className="req">*</span></label><input placeholder="e.g. Cardiology" value={doctorForm.specialization} required onChange={e=>setDoctorForm({...doctorForm,specialization:e.target.value})}/></div>
//                   <div className="ad-form-group"><label>Experience</label><input placeholder="e.g. 10 years" value={doctorForm.experience} onChange={e=>setDoctorForm({...doctorForm,experience:e.target.value})}/></div>
//                   <div className="ad-form-group"><label>Timing</label><input placeholder="e.g. 9AM - 1PM" value={doctorForm.timing} onChange={e=>setDoctorForm({...doctorForm,timing:e.target.value})}/></div>
//                   <div className="ad-form-group"><label>Avg. Consultation (min)</label><input type="number" min="1" max="120" value={doctorForm.avgConsultationTime} onChange={e=>setDoctorForm({...doctorForm,avgConsultationTime:parseInt(e.target.value)})}/></div>
//                   <div className="ad-form-group"><label>Status</label><select value={doctorForm.status} onChange={e=>setDoctorForm({...doctorForm,status:e.target.value})}><option>Available</option><option>Busy</option><option>On Leave</option><option>Inactive</option></select></div>
//                 </div>
//               </div>
//               <div className="ad-modal-actions">
//                 <button type="button" className="ad-btn-secondary" onClick={() => setModal(null)}>Cancel</button>
//                 <button type="submit" className="ad-btn-primary">{modal.data ? "Update Doctor" : "Add Doctor"}</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* SERVICE MODAL */}
//       {modal?.type === "service" && (
//         <div className="ad-modal-overlay" onClick={e => e.target===e.currentTarget && setModal(null)}>
//           <div className="ad-modal">
//             <div className="ad-modal-head">
//               <div><h3>{modal.data ? "Edit Service" : "Add New Service"}</h3><p>{modal.data ? "Update service details" : "Add a service to your branch"}</p></div>
//               <button className="ad-modal-close" onClick={() => setModal(null)}>✕</button>
//             </div>
//             <form onSubmit={handleServiceSubmit}>
//               <div className="ad-modal-body">
//                 <div className="ad-modal-form">
//                   <div className="ad-form-group"><label>Service Name <span className="req">*</span></label><input placeholder="e.g. Account Opening" value={serviceForm.name} required onChange={e=>setServiceForm({...serviceForm,name:e.target.value})}/></div>
//                   <div className="ad-form-group"><label>Description</label><input placeholder="Brief description" value={serviceForm.description} onChange={e=>setServiceForm({...serviceForm,description:e.target.value})}/></div>
//                   <div className="ad-form-group"><label>Counter</label><input placeholder="e.g. Counter A" value={serviceForm.counter} onChange={e=>setServiceForm({...serviceForm,counter:e.target.value})}/></div>
//                   <div className="ad-form-group"><label>Timing</label><input placeholder="e.g. 10AM - 4PM" value={serviceForm.timing} onChange={e=>setServiceForm({...serviceForm,timing:e.target.value})}/></div>
//                   <div className="ad-form-group"><label>Avg. Service Time (min)</label><input type="number" min="1" max="120" value={serviceForm.avgServiceTimeMinutes} onChange={e=>setServiceForm({...serviceForm,avgServiceTimeMinutes:parseInt(e.target.value)})}/></div>
//                   <div className="ad-form-group"><label>Status</label><select value={serviceForm.status} onChange={e=>setServiceForm({...serviceForm,status:e.target.value})}><option>Available</option><option>Busy</option><option>Closed</option></select></div>
//                 </div>
//               </div>
//               <div className="ad-modal-actions">
//                 <button type="button" className="ad-btn-secondary" onClick={() => setModal(null)}>Cancel</button>
//                 <button type="submit" className="ad-btn-primary">{modal.data ? "Update Service" : "Add Service"}</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* STAFF MODAL */}
//       {modal?.type === "staff" && (
//         <div className="ad-modal-overlay" onClick={e => e.target===e.currentTarget && setModal(null)}>
//           <div className="ad-modal">
//             <div className="ad-modal-head">
//               <div><h3>Create Staff Account</h3><p>Staff will be assigned to your branch automatically</p></div>
//               <button className="ad-modal-close" onClick={() => setModal(null)}>✕</button>
//             </div>
//             <form onSubmit={handleStaffSubmit}>
//               <div className="ad-modal-body">
//                 <div className="ad-modal-form">
//                   <div className="ad-form-group"><label>Username <span className="req">*</span></label><input placeholder="e.g. staff_raj" value={staffForm.username} required onChange={e=>setStaffForm({...staffForm,username:e.target.value})}/></div>
//                   <div className="ad-form-group"><label>Email Address <span className="req">*</span></label><input type="email" placeholder="staff@branch.com" value={staffForm.email} required onChange={e=>setStaffForm({...staffForm,email:e.target.value})}/></div>
//                   <div className="ad-form-group"><label>Password <span className="req">*</span></label><input type="password" placeholder="Set a strong password" value={staffForm.password} required onChange={e=>setStaffForm({...staffForm,password:e.target.value})}/></div>
//                   <div className="ad-form-group"><label>Confirm Password <span className="req">*</span></label><input type="password" placeholder="Repeat password" value={staffForm.confirmPassword} required onChange={e=>setStaffForm({...staffForm,confirmPassword:e.target.value})}/></div>
//                 </div>
//               </div>
//               <div className="ad-modal-actions">
//                 <button type="button" className="ad-btn-secondary" onClick={() => setModal(null)}>Cancel</button>
//                 <button type="submit" className="ad-btn-primary">Create Staff</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default AdminDashboard;





import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AdminDashboard.scss";

import ADSidebar       from "../components/ADSidebar";
import ADTopbar        from "../components/ADTopbar";
import ADDashboardPage from "../components/ADDashboardPage";
import ADDoctorsPage   from "../components/ADDoctorsPage";
import ADServicesPage  from "../components/ADServicesPage";
import ADStaffPage     from "../components/ADStaffPage";
import ADQueuePage     from "../components/ADQueuePage";
import { DoctorModal, ServiceModal, StaffModal } from "../components/ADModals";

const API = "http://localhost:8080/api/admin";

const AdminDashboard = () => {
  const navigate    = useNavigate();
  const token       = localStorage.getItem("token");
  const username    = localStorage.getItem("username");
  const authHeaders = {
    "Content-Type": "application/json",
    Authorization : `Bearer ${token}`
  };

  // ── UI ─────────────────────────────────────────────────────
  const [activePage,       setActivePage]       = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toast,            setToast]            = useState(null);
  const [modal,            setModal]            = useState(null);

  // ── Data ───────────────────────────────────────────────────
  const [stats,    setStats]    = useState(null);
  const [doctors,  setDoctors]  = useState([]);
  const [services, setServices] = useState([]);
  const [staff,    setStaff]    = useState([]);
  const [queue,    setQueue]    = useState([]);

  // ── Forms ──────────────────────────────────────────────────
  const emptyDoctor  = { name:"", specialization:"", experience:"", timing:"", status:"Available", avgConsultationTime:10 };
  const emptyService = { name:"", description:"", counter:"", timing:"", status:"Available", avgServiceTimeMinutes:10 };
  const emptyStaff   = { username:"", email:"", password:"", confirmPassword:"" };

  const [doctorForm,  setDoctorForm]  = useState(emptyDoctor);
  const [serviceForm, setServiceForm] = useState(emptyService);
  const [staffForm,   setStaffForm]   = useState(emptyStaff);

  // ── Derived ────────────────────────────────────────────────
  const isHospital       = stats?.branchCategoryId === 1;
  const activeQueueCount = queue.filter(t =>
    ["BOOKED","CALLED","IN_PROGRESS"].includes(t.status)).length;

  // ── Auth guard ─────────────────────────────────────────────
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "ADMIN" && role !== "SUPER_ADMIN") navigate("/login");
  }, []);

  // ── Fetch on mount ─────────────────────────────────────────
  useEffect(() => { fetchAll(); }, []);

  // ── Auto-refresh queue ─────────────────────────────────────
  useEffect(() => {
    const id = setInterval(fetchQueue, 30000);
    return () => clearInterval(id);
  }, []);

  // ── Fetchers ───────────────────────────────────────────────
  const fetchAll = () =>
    Promise.all([fetchStats(), fetchDoctors(), fetchServices(), fetchStaff(), fetchQueue()]);

  const fetchStats    = async () => { try { const r = await axios.get(`${API}/dashboard-stats`, { headers: authHeaders }); setStats(r.data); } catch(e){} };
  const fetchDoctors  = async () => { try { const r = await axios.get(`${API}/doctors`,          { headers: authHeaders }); setDoctors(Array.isArray(r.data) ? r.data : []); } catch(e){} };
  const fetchServices = async () => { try { const r = await axios.get(`${API}/services`,         { headers: authHeaders }); setServices(Array.isArray(r.data) ? r.data : []); } catch(e){} };
  const fetchStaff    = async () => { try { const r = await axios.get(`${API}/staff`,            { headers: authHeaders }); setStaff(Array.isArray(r.data) ? r.data : []); } catch(e){} };
  const fetchQueue    = async () => { try { const r = await axios.get(`${API}/queue/today`,      { headers: authHeaders }); setQueue(Array.isArray(r.data) ? r.data : []); } catch(e){} };

  // ── Toast ──────────────────────────────────────────────────
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  // ── Doctor handlers ────────────────────────────────────────
  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modal?.data?.id) {
        await axios.put(`${API}/doctors/${modal.data.id}`, doctorForm, { headers: authHeaders });
        showToast("Doctor updated!");
      } else {
        await axios.post(`${API}/doctors`, doctorForm, { headers: authHeaders });
        showToast("Doctor added!");
      }
      setModal(null); setDoctorForm(emptyDoctor);
      fetchDoctors(); fetchStats();
    } catch(e) { showToast(e.response?.data?.message || "Failed.", "error"); }
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm("Delete this doctor?")) return;
    try {
      await axios.delete(`${API}/doctors/${id}`, { headers: authHeaders });
      showToast("Doctor deleted."); fetchDoctors(); fetchStats();
    } catch(e) { showToast(e.response?.data?.message || "Failed.", "error"); }
  };

  // ── Service handlers ───────────────────────────────────────
  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modal?.data?.id) {
        await axios.put(`${API}/services/${modal.data.id}`, serviceForm, { headers: authHeaders });
        showToast("Service updated!");
      } else {
        await axios.post(`${API}/services`, serviceForm, { headers: authHeaders });
        showToast("Service added!");
      }
      setModal(null); setServiceForm(emptyService);
      fetchServices(); fetchStats();
    } catch(e) { showToast(e.response?.data?.message || "Failed.", "error"); }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await axios.delete(`${API}/services/${id}`, { headers: authHeaders });
      showToast("Service deleted."); fetchServices(); fetchStats();
    } catch(e) { showToast(e.response?.data?.message || "Failed.", "error"); }
  };

  // ── Staff handlers ─────────────────────────────────────────
  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    if (staffForm.password !== staffForm.confirmPassword) {
      showToast("Passwords do not match.", "error"); return;
    }
    try {
      await axios.post(`${API}/staff`, {
        username: staffForm.username,
        email:    staffForm.email,
        password: staffForm.password
      }, { headers: authHeaders });
      showToast("Staff created!"); setModal(null);
      setStaffForm(emptyStaff); fetchStaff(); fetchStats();
    } catch(e) { showToast(e.response?.data?.message || "Failed.", "error"); }
  };

  const handleDeleteStaff = async (id) => {
    if (!window.confirm("Remove this staff member?")) return;
    try {
      await axios.delete(`${API}/staff/${id}`, { headers: authHeaders });
      showToast("Staff removed."); fetchStaff(); fetchStats();
    } catch(e) { showToast(e.response?.data?.message || "Failed.", "error"); }
  };

  return (
    <div className={`ad-root ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>

      {/* Toast */}
      {toast && (
        <div className={`ad-toast ${toast.type}`}>
          <span>{toast.type === "success" ? "✓" : "✕"}</span> {toast.message}
        </div>
      )}

      {/* Sidebar */}
      <ADSidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        activePage={activePage}
        setActivePage={setActivePage}
        username={username}
        branchName={stats?.branchName}
        activeQueueCount={activeQueueCount}
        isHospital={isHospital}
        onLogout={handleLogout}
      />

      {/* Main */}
      <main className="ad-main">
        <ADTopbar
          activePage={activePage}
          stats={stats}
          onRefresh={fetchAll}
        />

        <div className="ad-content">

          {activePage === "dashboard" && (
            <ADDashboardPage
              stats={stats}
              isHospital={isHospital}
              doctors={doctors}
              services={services}
              queue={queue}
              setActivePage={setActivePage}
              setModal={setModal}
              setDoctorForm={setDoctorForm}
              setServiceForm={setServiceForm}
              setStaffForm={setStaffForm}
              emptyDoctor={emptyDoctor}
              emptyService={emptyService}
              emptyStaff={emptyStaff}
            />
          )}

          {activePage === "doctors" && isHospital && (
            <ADDoctorsPage
              doctors={doctors}
              setModal={setModal}
              setDoctorForm={setDoctorForm}
              emptyDoctor={emptyDoctor}
              onDelete={handleDeleteDoctor}
            />
          )}

          {activePage === "services" && !isHospital && (
            <ADServicesPage
              services={services}
              setModal={setModal}
              setServiceForm={setServiceForm}
              emptyService={emptyService}
              onDelete={handleDeleteService}
            />
          )}

          {activePage === "staff" && (
            <ADStaffPage
              staff={staff}
              setModal={setModal}
              setStaffForm={setStaffForm}
              emptyStaff={emptyStaff}
              onDelete={handleDeleteStaff}
            />
          )}

          {activePage === "queue" && (
            <ADQueuePage
              queue={queue}
              onRefresh={fetchQueue}
            />
          )}

        </div>
      </main>

      {/* Modals */}
      {modal?.type === "doctor" && (
        <DoctorModal
          modal={modal}
          doctorForm={doctorForm}
          setDoctorForm={setDoctorForm}
          onSubmit={handleDoctorSubmit}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === "service" && (
        <ServiceModal
          modal={modal}
          serviceForm={serviceForm}
          setServiceForm={setServiceForm}
          onSubmit={handleServiceSubmit}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === "staff" && (
        <StaffModal
          staffForm={staffForm}
          setStaffForm={setStaffForm}
          onSubmit={handleStaffSubmit}
          onClose={() => setModal(null)}
        />
      )}

    </div>
  );
};

export default AdminDashboard;