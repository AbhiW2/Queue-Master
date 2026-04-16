import React from "react";

const StaffTopbar = ({ activePage, branchInfo, selected, onRefresh }) => {

  const pageLabels = { queue: "Queue Management", history: "Queue History" };

  return (
    <header className="sf-topbar">
      <div className="sf-topbar-left">
        <h1 className="sf-page-title">{pageLabels[activePage] || "Dashboard"}</h1>
        <span className="sf-breadcrumb">
          Queue Master / {branchInfo?.branchName || "Branch"} /&nbsp;
          {selected
            ? (branchInfo?.isHospital ? `Dr. ${selected.name}` : selected.name)
            : "Select a counter"}
        </span>
      </div>
      <div className="sf-topbar-right">
        <div className="sf-branch-badge">
          <span className="sf-online-dot"/>
          {branchInfo?.branchName || "Branch"} —&nbsp;
          {branchInfo?.isHospital ? "🏥 Hospital" : "🏢 Service Branch"}
        </div>
        <button className="sf-refresh-btn" onClick={onRefresh}>↻ Refresh</button>
      </div>
    </header>
  );
};

export default StaffTopbar;