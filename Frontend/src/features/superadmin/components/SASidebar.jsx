import React from "react";

const SASidebar = ({ activePage, setActivePage, sidebarOpen,
                     setSidebarOpen, username, onLogout }) => {

  const navItems = [
    { id: "dashboard",    label: "Dashboard",      icon: "⊞",  section: "OVERVIEW" },
    { id: "branches",     label: "Branches",       icon: "🏢", section: "MANAGE"   },
    { id: "add-branch",   label: "Add Branch",     icon: "＋", sub: true            },
    { id: "admins",       label: "Admins",         icon: "👤", section: "ACCOUNTS" },
    { id: "create-admin", label: "Create Admin",   icon: "＋", sub: true            },
    { id: "users",        label: "All Users",      icon: "👥", section: null        },
    { id: "tokens",       label: "Token Overview", icon: "🎫", section: "MONITOR"  },
  ];

  return (
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
        <button className="sa-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? "◀" : "▶"}
        </button>
      </div>

      <nav className="sa-nav">
        {navItems.map((item) => (
          <React.Fragment key={item.id}>
            {item.section && sidebarOpen && (
              <div className="sa-nav-section">{item.section}</div>
            )}
            <button
              className={`sa-nav-item ${activePage === item.id ? "active" : ""} ${item.sub ? "sub" : ""}`}
              onClick={() => setActivePage(item.id)}
              title={!sidebarOpen ? item.label : ""}
            >
              <span className="sa-nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="sa-nav-label">{item.label}</span>}
              {activePage === item.id && sidebarOpen && (
                <span className="sa-nav-indicator" />
              )}
            </button>
          </React.Fragment>
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
        <button className="sa-logout-btn" onClick={onLogout}>
          <span>⏻</span>
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default SASidebar;