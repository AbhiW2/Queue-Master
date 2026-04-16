import React from "react";

const navLabels = {
  dashboard:      "Dashboard",
  branches:       "Branches",
  "add-branch":   "Add Branch",
  admins:         "Admins",
  "create-admin": "Create Admin",
  users:          "All Users",
  tokens:         "Token Overview",
};

const SATopbar = ({ activePage }) => {
  return (
    <header className="sa-topbar">
      <div className="sa-topbar-left">
        <h1 className="sa-page-title">
          {navLabels[activePage] || "Dashboard"}
        </h1>
        <span className="sa-breadcrumb">
          Queue Master › Super Admin › {navLabels[activePage]}
        </span>
      </div>
      <div className="sa-topbar-right">
        <div className="sa-topbar-badge">
          <span className="sa-online-dot" />
          System Online
        </div>
      </div>
    </header>
  );
};

export default SATopbar;