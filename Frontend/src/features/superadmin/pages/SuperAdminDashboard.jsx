import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/SuperAdminDashboard.scss";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();

  const [activePage,    setActivePage]    = useState("dashboard");
  const [sidebarOpen,   setSidebarOpen]   = useState(true);
  const [loading,       setLoading]       = useState(false);
  const [notification,  setNotification]  = useState(null);

  // ── Data states ────────────────────────────────────────
  const [stats,    setStats]    = useState({ branches: 0, admins: 0, users: 0, tokens: 0 });
  const [branches, setBranches] = useState([]);
  const [admins,   setAdmins]   = useState([]);
  const [users,    setUsers]    = useState([]);
  const [tokens,   setTokens]   = useState([]);

  // ── Form states ────────────────────────────────────────
  const [branchForm, setBranchForm] = useState({
    name: "", location: "", timing: "", status: "Open", categoryId: ""
  });
  const [adminForm, setAdminForm] = useState({
    username: "", email: "", password: "", confirmPassword: "", branchId: ""
  });
  const [branchSearch, setBranchSearch] = useState("");
  const [adminSearch,  setAdminSearch]  = useState("");
  const [userSearch,   setUserSearch]   = useState("");
  const [tokenSearch,  setTokenSearch]  = useState("");

  const token       = localStorage.getItem("token");
  const username    = localStorage.getItem("username");
  const authHeaders = {
    "Content-Type": "application/json",
    Authorization : `Bearer ${token}`
  };

  // ── Verify role ────────────────────────────────────────
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "SUPER_ADMIN") {
      navigate("/login");
    }
  }, []);

  // ── Fetch all data on mount ────────────────────────────
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchBranches(),
        fetchAdmins(),
        fetchUsers(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/super-admin/branches",
        { headers: authHeaders }
      );
      const data = Array.isArray(res.data) ? res.data : [];
      setBranches(data);
      setStats(prev => ({ ...prev, branches: data.length }));
    } catch (err) {
      console.error("Error fetching branches:", err);
    }
  };

  const fetchAdmins = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/super-admin/admins",
        { headers: authHeaders }
      );
      const data = Array.isArray(res.data) ? res.data : [];
      setAdmins(data);
      setStats(prev => ({ ...prev, admins: data.length }));
    } catch (err) {
      console.error("Error fetching admins:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/super-admin/users",
        { headers: authHeaders }
      );
      const data = Array.isArray(res.data) ? res.data : [];
      setUsers(data);
      setStats(prev => ({ ...prev, users: data.length }));
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // ── Notifications ──────────────────────────────────────
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // ── Add Branch ─────────────────────────────────────────
  const handleAddBranch = async (e) => {
    e.preventDefault();
    if (!branchForm.name || !branchForm.location || !branchForm.categoryId) {
      showNotification("Please fill all required fields.", "error");
      return;
    }
    try {
      await axios.post(
        "http://localhost:8080/api/super-admin/branches",
        branchForm,
        { headers: authHeaders }
      );
      showNotification("Branch added successfully!");
      setBranchForm({ name: "", location: "", timing: "", status: "Open", categoryId: "" });
      fetchBranches();
      setActivePage("branches");
    } catch (err) {
      showNotification(
        err.response?.data?.message || "Failed to add branch.", "error"
      );
    }
  };

  // ── Delete Branch ──────────────────────────────────────
  const handleDeleteBranch = async (id) => {
    if (!window.confirm("Are you sure you want to delete this branch?")) return;
    try {
      await axios.delete(
        `http://localhost:8080/api/super-admin/branches/${id}`,
        { headers: authHeaders }
      );
      showNotification("Branch deleted.");
      fetchBranches();
    } catch (err) {
      showNotification("Failed to delete branch.", "error");
    }
  };

  // ── Create Admin ───────────────────────────────────────
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!adminForm.username || !adminForm.email ||
        !adminForm.password || !adminForm.branchId) {
      showNotification("Please fill all required fields.", "error");
      return;
    }
    if (adminForm.password !== adminForm.confirmPassword) {
      showNotification("Passwords do not match.", "error");
      return;
    }
    try {
      await axios.post(
        "http://localhost:8080/api/super-admin/create-admin",
        {
          username : adminForm.username,
          email    : adminForm.email,
          password : adminForm.password,
          branchId : parseInt(adminForm.branchId)
        },
        { headers: authHeaders }
      );
      showNotification("Admin created successfully!");
      setAdminForm({ username: "", email: "", password: "", confirmPassword: "", branchId: "" });
      fetchAdmins();
      setActivePage("admins");
    } catch (err) {
      showNotification(
        err.response?.data?.message || "Failed to create admin.", "error"
      );
    }
  };

  // ── Delete Admin ───────────────────────────────────────
  const handleDeleteAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to remove this admin?")) return;
    try {
      await axios.delete(
        `http://localhost:8080/api/super-admin/admins/${id}`,
        { headers: authHeaders }
      );
      showNotification("Admin removed.");
      fetchAdmins();
    } catch (err) {
      showNotification("Failed to remove admin.", "error");
    }
  };

  // ── Logout ─────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ── Helpers ────────────────────────────────────────────
  const getCategoryLabel = (id) => {
    const map = { 1: "Hospital", 2: "Bank", 3: "Government", 4: "Hotel" };
    return map[id] || "Unknown";
  };

  const getCategoryEmoji = (id) => {
    const map = { 1: "🏥", 2: "🏦", 3: "🏛️", 4: "🏨" };
    return map[id] || "🏢";
  };

  const getRoleBadge = (role) => {
    const map = {
      SUPER_ADMIN : "sa",
      ADMIN       : "admin",
      STAFF       : "staff",
      USER        : "user"
    };
    return map[role] || "user";
  };

  // ── Nav items ──────────────────────────────────────────
  const navItems = [
    { id: "dashboard",    label: "Dashboard",     icon: "⊞" },
    { id: "branches",     label: "Branches",      icon: "🏢" },
    { id: "add-branch",   label: "Add Branch",    icon: "＋", sub: true },
    { id: "admins",       label: "Admins",        icon: "👤" },
    { id: "create-admin", label: "Create Admin",  icon: "＋", sub: true },
    { id: "users",        label: "All Users",     icon: "👥" },
    { id: "tokens",       label: "Token Overview",icon: "🎫" },
  ];

  // ── Filtered data ──────────────────────────────────────
  const filteredBranches = branches.filter(b =>
    b.name?.toLowerCase().includes(branchSearch.toLowerCase()) ||
    b.location?.toLowerCase().includes(branchSearch.toLowerCase())
  );

  const filteredAdmins = admins.filter(a =>
    a.username?.toLowerCase().includes(adminSearch.toLowerCase()) ||
    a.email?.toLowerCase().includes(adminSearch.toLowerCase())
  );

  const filteredUsers = users.filter(u =>
    u.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role?.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className={`sa-root ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>

      {/* ── NOTIFICATION ─────────────────────────────── */}
      {notification && (
        <div className={`sa-notification ${notification.type}`}>
          <span>{notification.type === "success" ? "✓" : "✕"}</span>
          {notification.message}
        </div>
      )}

      {/* ── SIDEBAR ──────────────────────────────────── */}
      <aside className="sa-sidebar">
        <div className="sa-sidebar-top">
          <div className="sa-logo">
            <div className="sa-logo-mark">Q</div>
            {sidebarOpen && (
              <div className="sa-logo-text">
                <span className="sa-logo-name">Queue Master</span>
                <span className="sa-logo-role">Super Admin</span>
              </div>
            )}
          </div>
          <button
            className="sa-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        <nav className="sa-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`sa-nav-item ${activePage === item.id ? "active" : ""} ${item.sub ? "sub" : ""}`}
              onClick={() => setActivePage(item.id)}
            >
              <span className="sa-nav-icon">{item.icon}</span>
              {sidebarOpen && (
                <span className="sa-nav-label">{item.label}</span>
              )}
              {activePage === item.id && (
                <span className="sa-nav-indicator" />
              )}
            </button>
          ))}
        </nav>

        <div className="sa-sidebar-bottom">
          <div className="sa-user-info">
            <div className="sa-user-avatar">
              {username?.charAt(0)?.toUpperCase() || "S"}
            </div>
            {sidebarOpen && (
              <div className="sa-user-details">
                <span className="sa-user-name">{username || "superadmin"}</span>
                <span className="sa-user-role">Super Admin</span>
              </div>
            )}
          </div>
          <button className="sa-logout-btn" onClick={handleLogout}>
            <span>⏻</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────────── */}
      <main className="sa-main">

        {/* ── TOP BAR ────────────────────────────────── */}
        <header className="sa-topbar">
          <div className="sa-topbar-left">
            <h1 className="sa-page-title">
              {navItems.find(n => n.id === activePage)?.label || "Dashboard"}
            </h1>
            <span className="sa-breadcrumb">
              Queue Master / Super Admin /&nbsp;
              {navItems.find(n => n.id === activePage)?.label}
            </span>
          </div>
          <div className="sa-topbar-right">
            <div className="sa-topbar-badge">
              <span className="sa-online-dot" />
              System Online
            </div>
          </div>
        </header>

        <div className="sa-content">

          {/* ════════════════════════════════════════════ */}
          {/* DASHBOARD                                    */}
          {/* ════════════════════════════════════════════ */}
          {activePage === "dashboard" && (
            <div className="sa-page">
              <div className="sa-stats-grid">
                <div className="sa-stat-card" onClick={() => setActivePage("branches")}>
                  <div className="sa-stat-icon branches">🏢</div>
                  <div className="sa-stat-body">
                    <div className="sa-stat-val">{stats.branches}</div>
                    <div className="sa-stat-lbl">Total Branches</div>
                    <div className="sa-stat-sub">Across all services</div>
                  </div>
                </div>
                <div className="sa-stat-card" onClick={() => setActivePage("admins")}>
                  <div className="sa-stat-icon admins">👤</div>
                  <div className="sa-stat-body">
                    <div className="sa-stat-val">{stats.admins}</div>
                    <div className="sa-stat-lbl">Branch Admins</div>
                    <div className="sa-stat-sub">1 per branch</div>
                  </div>
                </div>
                <div className="sa-stat-card" onClick={() => setActivePage("users")}>
                  <div className="sa-stat-icon users">👥</div>
                  <div className="sa-stat-body">
                    <div className="sa-stat-val">{stats.users}</div>
                    <div className="sa-stat-lbl">Registered Users</div>
                    <div className="sa-stat-sub">All roles combined</div>
                  </div>
                </div>
                <div className="sa-stat-card">
                  <div className="sa-stat-icon tokens">🎫</div>
                  <div className="sa-stat-body">
                    <div className="sa-stat-val">4</div>
                    <div className="sa-stat-lbl">Service Types</div>
                    <div className="sa-stat-sub">Hospital, Bank, Govt, Hotel</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="sa-section-title">Quick Actions</div>
              <div className="sa-quick-actions">
                <button
                  className="sa-quick-btn"
                  onClick={() => setActivePage("add-branch")}
                >
                  <span className="sa-quick-icon">🏢</span>
                  <span className="sa-quick-label">Add New Branch</span>
                  <span className="sa-quick-arrow">→</span>
                </button>
                <button
                  className="sa-quick-btn"
                  onClick={() => setActivePage("create-admin")}
                >
                  <span className="sa-quick-icon">👤</span>
                  <span className="sa-quick-label">Create Admin</span>
                  <span className="sa-quick-arrow">→</span>
                </button>
                <button
                  className="sa-quick-btn"
                  onClick={() => setActivePage("users")}
                >
                  <span className="sa-quick-icon">👥</span>
                  <span className="sa-quick-label">View All Users</span>
                  <span className="sa-quick-arrow">→</span>
                </button>
                <button
                  className="sa-quick-btn"
                  onClick={() => setActivePage("tokens")}
                >
                  <span className="sa-quick-icon">🎫</span>
                  <span className="sa-quick-label">Token Overview</span>
                  <span className="sa-quick-arrow">→</span>
                </button>
              </div>

              {/* Recent Branches */}
              <div className="sa-section-title" style={{ marginTop: "32px" }}>
                Recent Branches
              </div>
              <div className="sa-card">
                <div className="sa-table-wrap">
                  <table className="sa-table">
                    <thead>
                      <tr>
                        <th>Branch</th>
                        <th>Category</th>
                        <th>Location</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {branches.slice(0, 5).map((b) => (
                        <tr key={b.id}>
                          <td>
                            <div className="sa-cell-main">
                              {getCategoryEmoji(b.categoryId)} {b.name}
                            </div>
                          </td>
                          <td>
                            <span className={`sa-badge cat-${b.categoryId}`}>
                              {getCategoryLabel(b.categoryId)}
                            </span>
                          </td>
                          <td className="sa-cell-muted">{b.location}</td>
                          <td>
                            <span className={`sa-badge ${b.status?.toLowerCase()}`}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {branches.length === 0 && (
                        <tr>
                          <td colSpan={4} className="sa-empty-row">
                            No branches added yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════ */}
          {/* BRANCHES                                     */}
          {/* ════════════════════════════════════════════ */}
          {activePage === "branches" && (
            <div className="sa-page">
              <div className="sa-page-actions">
                <div className="sa-search-box">
                  <span className="sa-search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Search branches..."
                    value={branchSearch}
                    onChange={(e) => setBranchSearch(e.target.value)}
                  />
                </div>
                <button
                  className="sa-btn-primary"
                  onClick={() => setActivePage("add-branch")}
                >
                  + Add Branch
                </button>
              </div>

              <div className="sa-card">
                <div className="sa-card-head">
                  <div>
                    <h3>All Branches</h3>
                    <p>{filteredBranches.length} branches found</p>
                  </div>
                </div>
                <div className="sa-table-wrap">
                  <table className="sa-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Branch Name</th>
                        <th>Category</th>
                        <th>Location</th>
                        <th>Timing</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBranches.map((b, i) => (
                        <tr key={b.id}>
                          <td className="sa-cell-muted">{i + 1}</td>
                          <td>
                            <div className="sa-cell-main">
                              <span className="sa-cell-emoji">
                                {getCategoryEmoji(b.categoryId)}
                              </span>
                              {b.name}
                            </div>
                          </td>
                          <td>
                            <span className={`sa-badge cat-${b.categoryId}`}>
                              {getCategoryLabel(b.categoryId)}
                            </span>
                          </td>
                          <td className="sa-cell-muted">{b.location}</td>
                          <td className="sa-cell-muted">{b.timing || "—"}</td>
                          <td>
                            <span className={`sa-badge ${b.status?.toLowerCase()}`}>
                              {b.status}
                            </span>
                          </td>
                          <td>
                            <button
                              className="sa-btn-danger-sm"
                              onClick={() => handleDeleteBranch(b.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredBranches.length === 0 && (
                        <tr>
                          <td colSpan={7} className="sa-empty-row">
                            No branches found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════ */}
          {/* ADD BRANCH                                   */}
          {/* ════════════════════════════════════════════ */}
          {activePage === "add-branch" && (
            <div className="sa-page">
              <div className="sa-form-layout">
                <div className="sa-card sa-form-card">
                  <div className="sa-card-head">
                    <div>
                      <h3>Branch Information</h3>
                      <p>Fill in the details to register a new branch</p>
                    </div>
                  </div>
                  <form className="sa-form" onSubmit={handleAddBranch}>

                    <div className="sa-form-section">Personal Details</div>
                    <div className="sa-form-grid">
                      <div className="sa-form-group full">
                        <label>Branch Name <span className="req">*</span></label>
                        <input
                          type="text"
                          placeholder="e.g. City Hospital — Block A"
                          value={branchForm.name}
                          onChange={(e) => setBranchForm({
                            ...branchForm, name: e.target.value
                          })}
                          required
                        />
                      </div>
                      <div className="sa-form-group">
                        <label>Service Category <span className="req">*</span></label>
                        <select
                          value={branchForm.categoryId}
                          onChange={(e) => setBranchForm({
                            ...branchForm, categoryId: e.target.value
                          })}
                          required
                        >
                          <option value="">-- Select Category --</option>
                          <option value="1">🏥 Hospital</option>
                          <option value="2">🏦 Bank</option>
                          <option value="3">🏛️ Government Office</option>
                          <option value="4">🏨 Hotel</option>
                        </select>
                      </div>
                      <div className="sa-form-group">
                        <label>Location <span className="req">*</span></label>
                        <input
                          type="text"
                          placeholder="e.g. Pune, Maharashtra"
                          value={branchForm.location}
                          onChange={(e) => setBranchForm({
                            ...branchForm, location: e.target.value
                          })}
                          required
                        />
                      </div>
                      <div className="sa-form-group">
                        <label>Timing</label>
                        <input
                          type="text"
                          placeholder="e.g. 9AM-5PM or 24hrs"
                          value={branchForm.timing}
                          onChange={(e) => setBranchForm({
                            ...branchForm, timing: e.target.value
                          })}
                        />
                      </div>
                      <div className="sa-form-group">
                        <label>Status</label>
                        <select
                          value={branchForm.status}
                          onChange={(e) => setBranchForm({
                            ...branchForm, status: e.target.value
                          })}
                        >
                          <option value="Open">Open</option>
                          <option value="Busy">Busy</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>
                    </div>

                    <div className="sa-form-actions">
                      <button
                        type="button"
                        className="sa-btn-secondary"
                        onClick={() => setActivePage("branches")}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="sa-btn-primary">
                        Save Branch
                      </button>
                    </div>
                  </form>
                </div>

                {/* Side Info */}
                <div className="sa-form-side">
                  <div className="sa-info-card">
                    <div className="sa-info-icon">💡</div>
                    <h4>Adding a Branch</h4>
                    <p>
                      After adding a branch, create an Admin and assign them
                      to this branch. The admin will then manage doctors,
                      services, and staff within the branch.
                    </p>
                  </div>
                  <div className="sa-info-card">
                    <div className="sa-info-icon">📋</div>
                    <h4>Timing Format</h4>
                    <p>Use formats like <strong>9AM-5PM</strong>,
                      <strong> 9:00AM-5:00PM</strong>, or
                      <strong> 24hrs</strong> for round the clock services.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════ */}
          {/* ADMINS                                       */}
          {/* ════════════════════════════════════════════ */}
          {activePage === "admins" && (
            <div className="sa-page">
              <div className="sa-page-actions">
                <div className="sa-search-box">
                  <span className="sa-search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Search admins..."
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                  />
                </div>
                <button
                  className="sa-btn-primary"
                  onClick={() => setActivePage("create-admin")}
                >
                  + Create Admin
                </button>
              </div>

              <div className="sa-card">
                <div className="sa-card-head">
                  <div>
                    <h3>All Admins</h3>
                    <p>Each admin manages one branch</p>
                  </div>
                </div>
                <div className="sa-table-wrap">
                  <table className="sa-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Admin</th>
                        <th>Email</th>
                        <th>Assigned Branch</th>
                        <th>Role</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAdmins.map((a, i) => (
                        <tr key={a.id || a.userId}>
                          <td className="sa-cell-muted">{i + 1}</td>
                          <td>
                            <div className="sa-cell-user">
                              <div className="sa-cell-avatar">
                                {a.username?.charAt(0)?.toUpperCase()}
                              </div>
                              <span>{a.username}</span>
                            </div>
                          </td>
                          <td className="sa-cell-muted">{a.email}</td>
                          <td>
                            {a.branch
                              ? <span className="sa-cell-main">
                                  {getCategoryEmoji(a.branch?.category?.id)}&nbsp;
                                  {a.branch?.name}
                                </span>
                              : <span className="sa-cell-muted">Not assigned</span>
                            }
                          </td>
                          <td>
                            <span className={`sa-badge role-${getRoleBadge(a.role)}`}>
                              {a.role}
                            </span>
                          </td>
                          <td>
                            <button
                              className="sa-btn-danger-sm"
                              onClick={() => handleDeleteAdmin(a.id || a.userId)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredAdmins.length === 0 && (
                        <tr>
                          <td colSpan={6} className="sa-empty-row">
                            No admins found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════ */}
          {/* CREATE ADMIN                                 */}
          {/* ════════════════════════════════════════════ */}
          {activePage === "create-admin" && (
            <div className="sa-page">
              <div className="sa-form-layout">
                <div className="sa-card sa-form-card">
                  <div className="sa-card-head">
                    <div>
                      <h3>Create Admin Account</h3>
                      <p>Assign a new admin to manage a branch</p>
                    </div>
                  </div>
                  <form className="sa-form" onSubmit={handleCreateAdmin}>

                    <div className="sa-form-section">Account Details</div>
                    <div className="sa-form-grid">
                      <div className="sa-form-group">
                        <label>Username <span className="req">*</span></label>
                        <input
                          type="text"
                          placeholder="e.g. admin_hosp1"
                          value={adminForm.username}
                          onChange={(e) => setAdminForm({
                            ...adminForm, username: e.target.value
                          })}
                          required
                        />
                      </div>
                      <div className="sa-form-group">
                        <label>Email Address <span className="req">*</span></label>
                        <input
                          type="email"
                          placeholder="admin@branch.com"
                          value={adminForm.email}
                          onChange={(e) => setAdminForm({
                            ...adminForm, email: e.target.value
                          })}
                          required
                        />
                      </div>
                      <div className="sa-form-group">
                        <label>Password <span className="req">*</span></label>
                        <input
                          type="password"
                          placeholder="Set a strong password"
                          value={adminForm.password}
                          onChange={(e) => setAdminForm({
                            ...adminForm, password: e.target.value
                          })}
                          required
                        />
                      </div>
                      <div className="sa-form-group">
                        <label>Confirm Password <span className="req">*</span></label>
                        <input
                          type="password"
                          placeholder="Repeat password"
                          value={adminForm.confirmPassword}
                          onChange={(e) => setAdminForm({
                            ...adminForm, confirmPassword: e.target.value
                          })}
                          required
                        />
                      </div>
                    </div>

                    <div className="sa-form-section">Branch Assignment</div>
                    <div className="sa-form-grid">
                      <div className="sa-form-group full">
                        <label>Assign to Branch <span className="req">*</span></label>
                        <select
                          value={adminForm.branchId}
                          onChange={(e) => setAdminForm({
                            ...adminForm, branchId: e.target.value
                          })}
                          required
                        >
                          <option value="">-- Select Branch --</option>
                          {branches.map((b) => (
                            <option key={b.id} value={b.id}>
                              {getCategoryEmoji(b.categoryId)} {b.name} — {b.location}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="sa-form-group">
                        <label>Role</label>
                        <input
                          type="text"
                          value="ADMIN"
                          disabled
                          style={{ opacity: 0.6 }}
                        />
                      </div>
                    </div>

                    <div className="sa-form-actions">
                      <button
                        type="button"
                        className="sa-btn-secondary"
                        onClick={() => setActivePage("admins")}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="sa-btn-primary">
                        Create Admin
                      </button>
                    </div>
                  </form>
                </div>

                {/* Side Info */}
                <div className="sa-form-side">
                  <div className="sa-info-card">
                    <div className="sa-info-icon">👤</div>
                    <h4>Admin Responsibilities</h4>
                    <p>
                      An admin manages one branch only. They can add doctors,
                      services, create staff accounts, and monitor the queue
                      for their assigned branch.
                    </p>
                  </div>
                  <div className="sa-info-card">
                    <div className="sa-info-icon">🔒</div>
                    <h4>Password Policy</h4>
                    <p>
                      Use a strong password with at least 8 characters.
                      Share credentials securely with the admin.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════ */}
          {/* ALL USERS                                    */}
          {/* ════════════════════════════════════════════ */}
          {activePage === "users" && (
            <div className="sa-page">
              <div className="sa-page-actions">
                <div className="sa-search-box">
                  <span className="sa-search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Search by name, email or role..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                </div>
                <button
                  className="sa-btn-secondary"
                  onClick={fetchUsers}
                >
                  ↻ Refresh
                </button>
              </div>

              {/* Role counts */}
              <div className="sa-role-counts">
                {["SUPER_ADMIN", "ADMIN", "STAFF", "USER"].map((role) => (
                  <div key={role} className="sa-role-count-card">
                    <span className={`sa-badge role-${getRoleBadge(role)}`}>
                      {role}
                    </span>
                    <span className="sa-role-count-num">
                      {users.filter(u => u.role === role).length}
                    </span>
                  </div>
                ))}
              </div>

              <div className="sa-card">
                <div className="sa-card-head">
                  <div>
                    <h3>All Users</h3>
                    <p>{filteredUsers.length} accounts in system</p>
                  </div>
                </div>
                <div className="sa-table-wrap">
                  <table className="sa-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u, i) => (
                        <tr key={u.id || u.userId}>
                          <td className="sa-cell-muted">{i + 1}</td>
                          <td>
                            <div className="sa-cell-user">
                              <div className={`sa-cell-avatar role-av-${getRoleBadge(u.role)}`}>
                                {u.username?.charAt(0)?.toUpperCase()}
                              </div>
                              <span>{u.username}</span>
                            </div>
                          </td>
                          <td className="sa-cell-muted">{u.email}</td>
                          <td>
                            <span className={`sa-badge role-${getRoleBadge(u.role)}`}>
                              {u.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {filteredUsers.length === 0 && (
                        <tr>
                          <td colSpan={4} className="sa-empty-row">
                            No users found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════ */}
          {/* TOKEN OVERVIEW                               */}
          {/* ════════════════════════════════════════════ */}
          {activePage === "tokens" && (
            <div className="sa-page">
              <div className="sa-coming-soon">
                <div className="sa-cs-icon">🎫</div>
                <h3>Token Overview</h3>
                <p>
                  This section will show all tokens across all branches.
                  Requires <strong>StaffController</strong> backend to be built first.
                </p>
                <button
                  className="sa-btn-primary"
                  onClick={() => setActivePage("dashboard")}
                >
                  ← Back to Dashboard
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;