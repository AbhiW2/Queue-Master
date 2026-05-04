

import React from "react";

const StaffStats = ({ stats, selected, branchInfo, onCallNext }) => {
  if (!stats || !selected) return null;

  const isServing  = stats.currentlyServing &&
                     stats.currentlyServing !== "None" &&
                     stats.currentlyServing !== "—";
  const hasWaiting = (stats.waiting ?? 0) > 0;

  const statItems = [
    { cls: "total",     val: stats.totalToday ?? 0, lbl: "Total Today", icon: "🎫" },
    { cls: "waiting",   val: stats.waiting    ?? 0, lbl: "Waiting",     icon: "⏳" },
    { cls: "serving",   val: stats.inProgress ?? 0, lbl: "In Progress", icon: "▶"  },
    { cls: "completed", val: stats.completed  ?? 0, lbl: "Completed",   icon: "✅" },
    { cls: "cancelled",
      val: (stats.skipped ?? 0) + (stats.noShow ?? 0) + (stats.cancelled ?? 0),
      lbl: "Skipped/NS", icon: "✕" },
  ];

  return (
    <div className="sf-stats-area">

      {/* NOW SERVING HERO */}
      <div className="sf-hero">
        <div className="sf-hero-left">
          <p className="sf-hero-eyebrow">NOW SERVING</p>
          <h1 className={`sf-hero-token ${isServing ? "active" : "idle"}`}>
            {isServing ? stats.currentlyServing : "—"}
          </h1>
          <p className="sf-hero-sub">
            {branchInfo?.isHospital ? `Dr. ${selected.name}` : selected.name}
            {selected.counter ? ` · Counter ${selected.counter}` : ""}
          </p>
        </div>

        {/* BIG CALL NEXT BUTTON */}
        <div className="sf-hero-actions">
          <button
            className="sf-cta-btn call-next"
            onClick={onCallNext}
            disabled={!hasWaiting}
          >
            <span className="sf-cta-icon">▶</span>
            <span className="sf-cta-body">
              <span className="sf-cta-label">Call Next</span>
              <span className="sf-cta-sub">
                {hasWaiting
                  ? `${stats.waiting} patient${stats.waiting !== 1 ? "s" : ""} waiting`
                  : "No one waiting"}
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* STATS STRIP */}
      <div className="sf-stats-strip">
        {statItems.map(s => (
          <div key={s.lbl} className={`sf-stat ${s.cls}`}>
            <span className="sf-stat-icon">{s.icon}</span>
            <span className="sf-stat-val">{s.val}</span>
            <span className="sf-stat-lbl">{s.lbl}</span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default StaffStats;