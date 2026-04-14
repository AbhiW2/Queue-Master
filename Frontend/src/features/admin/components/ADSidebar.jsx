import React from "react";

const ADSidebar = ({ collapsed, setCollapsed, activePage, setActivePage,
                     username, branchName, activeQueueCount, isHospital,
                     onLogout }) => {

  const navItems = [
    { id: "dashboard", label: "Dashboard",    icon: "⊞",  section: "OVERVIEW" },
    ...(isHospital
      ? [{ id: "doctors",  label: "Doctors",  icon: "🩺", section: "MANAGE"  }]
      : [{ id: "services", label: "Services", icon: "⚙️",  section: "MANAGE"  }]
    ),
    { id: "staff",   label: "Staff",          icon: "👥", section: null      },
    { id: "queue",   label: "Queue Monitor",  icon: "🎫", section: "LIVE",
      badge: activeQueueCount > 0 ? activeQueueCount : null },
  ];

  return (
    <aside className="ad-sidebar">
      <div className="ad-sidebar-top">
        <div className="ad-logo">
          <div className="ad-logo-mark">Q</div>
          {!collapsed && (
            <div className="ad-logo-text">
              <span className="ad-logo-name">Queue Master</span>
              <span className="ad-logo-role">Admin Panel</span>
            </div>
          )}
        </div>
        <button className="ad-toggle" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? "▶" : "◀"}
        </button>
      </div>

      <nav className="ad-nav">
        {navItems.map(item => (
          <React.Fragment key={item.id}>
            {item.section && !collapsed && (
              <div className="ad-nav-section">{item.section}</div>
            )}
            <button
              className={`ad-nav-item ${activePage === item.id ? "active" : ""}`}
              onClick={() => setActivePage(item.id)}
              title={collapsed ? item.label : ""}
            >
              <span className="ad-nav-icon">{item.icon}</span>
              {!collapsed && <span className="ad-nav-label">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="ad-nav-badge">{item.badge}</span>
              )}
            </button>
          </React.Fragment>
        ))}
      </nav>

      <div className="ad-sidebar-bottom">
        <div className="ad-user-card">
          <div className="ad-user-avatar">
            {username?.charAt(0)?.toUpperCase() || "A"}
          </div>
          {!collapsed && (
            <div className="ad-user-info">
              <span className="ad-user-name">{username || "admin"}</span>
              <span className="ad-user-role">{branchName || "Branch Admin"}</span>
            </div>
          )}
        </div>
        <button className="ad-logout-btn" onClick={onLogout}>
          <span>⏻</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default ADSidebar;