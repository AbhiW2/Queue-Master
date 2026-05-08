import React from "react";

const PAGE_LABELS = {
  queue:   "Queue Management",
  history: "Queue History",
};

const StaffTopbar = ({ activePage, branchInfo, selected, onRefresh }) => (
  <header className="sf-topbar">
    <div className="sf-topbar-left">
      <h1 className="sf-page-title">{PAGE_LABELS[activePage] || "Dashboard"}</h1>
      <span className="sf-breadcrumb">
        Queue Master / {branchInfo?.branchName || "Branch"} /{" "}
        {selected
          ? (branchInfo?.isHospital ? `Dr. ${selected.name}` : selected.name)
          : "Select a counter"}
      </span>
    </div>
    <div className="sf-topbar-right">
      <div className="sf-branch-tag">
        <span className="sf-live-dot" />
        {branchInfo?.branchName || "Branch"} —{" "}
        {branchInfo?.isHospital ? "🏥 Hospital" : "🏢 Service"}
      </div>
      <button className="sf-refresh-btn" onClick={onRefresh}>
        ↻ Refresh
      </button>
    </div>
  </header>
);

export default StaffTopbar;