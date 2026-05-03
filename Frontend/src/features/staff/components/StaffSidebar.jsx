import React from "react";

const navItems = [
  { id: "queue",   label: "Queue",   icon: "🎫", section: "MANAGE" },
  { id: "history", label: "History", icon: "📋", section: null     },
];

const StaffSidebar = ({ collapsed, setCollapsed, activePage,
                        setActivePage, username, branchInfo, onLogout }) => (
  <aside className="sf-sidebar">
    <div className="sf-sidebar-top">
      <div className="sf-logo">
        <div className="sf-logo-mark">Q</div>
        <div className="sf-logo-text">
          <span className="sf-logo-name">Queue Master</span>
          <span className="sf-logo-role">Staff Panel</span>
        </div>
      </div>
      <button className="sf-toggle" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? "▶" : "◀"}
      </button>
    </div>

    <nav className="sf-nav">
      {navItems.map(item => (
        <React.Fragment key={item.id}>
          {item.section && (
            <div className="sf-nav-section">{item.section}</div>
          )}
          <button
            className={`sf-nav-item ${activePage === item.id ? "active" : ""}`}
            onClick={() => setActivePage(item.id)}
          >
            <span className="sf-nav-icon">{item.icon}</span>
            <span className="sf-nav-label">{item.label}</span>
          </button>
        </React.Fragment>
      ))}
    </nav>

    <div className="sf-sidebar-bottom">
      <div className="sf-user-card">
        <div className="sf-user-avatar">
          {username?.charAt(0)?.toUpperCase() || "S"}
        </div>
        <div className="sf-user-info">
          <span className="sf-user-name">{username || "Staff"}</span>
          <span className="sf-user-role">{branchInfo?.branchName || "Branch"}</span>
        </div>
      </div>
      <button className="sf-logout-btn" onClick={onLogout}>
        <span>⏻</span>
        <span>Logout</span>
      </button>
    </div>
  </aside>
);

export default StaffSidebar;