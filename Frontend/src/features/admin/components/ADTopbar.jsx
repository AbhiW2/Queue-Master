import React from "react";

const pageLabels = {
  dashboard: "Dashboard",
  doctors:   "Doctors",
  services:  "Services",
  staff:     "Staff",
  queue:     "Queue Monitor",
};

const ADTopbar = ({ activePage, stats, onRefresh }) => {
  return (
    <header className="ad-topbar">
      <div className="ad-topbar-left">
        <h1 className="ad-page-title">
          {pageLabels[activePage] || "Dashboard"}
        </h1>
        <span className="ad-breadcrumb">
          Queue Master › {stats?.branchName || "Branch"} › {pageLabels[activePage]}
        </span>
      </div>
      <div className="ad-topbar-right">
        <div className="ad-branch-badge">
          <span className="ad-online-dot" />
          {stats?.branchName || "Branch"} — {stats?.branchStatus || "Active"}
        </div>
        <button className="ad-refresh-btn" onClick={onRefresh}>
          ↻ Refresh
        </button>
      </div>
    </header>
  );
};

export default ADTopbar;