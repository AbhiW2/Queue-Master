// import React from "react";

// const StaffStats = ({ stats, selected, branchInfo, onCallNext }) => {

//   if (!stats || !selected) return null;

//   const statItems = [
//     { icon:"🎫", cls:"total",     val: stats.totalToday,   lbl:"Total Today"  },
//     { icon:"⏳", cls:"waiting",   val: stats.waiting,      lbl:"Waiting"      },
//     { icon:"▶️", cls:"serving",   val: stats.inProgress,   lbl:"In Progress"  },
//     { icon:"✅", cls:"completed", val: stats.completed,    lbl:"Completed"    },
//     { icon:"❌", cls:"cancelled", val: stats.cancelled,    lbl:"Cancelled"    },
//   ];

//   return (
//     <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>

//       {/* Serving Now Banner */}
//       <div className="sf-serving-banner">
//         <span className="sf-serving-banner-icon">🔔</span>
//         <div>
//           <div className="sf-serving-banner-label">Now Serving</div>
//           <div className="sf-serving-banner-token">
//             {stats.currentlyServing || "—"}
//           </div>
//         </div>
//         <button className="sf-serving-banner-call" onClick={onCallNext}>
//           ▶ Call Next
//         </button>
//       </div>

//       {/* Stats Row */}
//       <div className="sf-stats-row">
//         {statItems.map(s => (
//           <div key={s.lbl} className="sf-stat-card">
//             <div className={`sf-stat-card-icon ${s.cls}`}>{s.icon}</div>
//             <div>
//               <div className="sf-stat-card-val">{s.val}</div>
//               <div className="sf-stat-card-lbl">{s.lbl}</div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default StaffStats;





import React from "react";

const StaffStats = ({ stats, selected, branchInfo, onCallNext }) => {
  if (!stats || !selected) return null;

  const statItems = [
    { icon: "🎫", cls: "total",     val: stats.totalToday ?? 0, lbl: "Total Today"  },
    { icon: "⏳", cls: "waiting",   val: stats.waiting    ?? 0, lbl: "Waiting"      },
    { icon: "▶️", cls: "serving",   val: stats.inProgress ?? 0, lbl: "In Progress"  },
    { icon: "✅", cls: "completed", val: stats.completed  ?? 0, lbl: "Completed"    },
    { icon: "❌", cls: "cancelled", val: stats.cancelled  ?? 0, lbl: "Cancelled"    },
  ];

  const isServing  = stats.currentlyServing && stats.currentlyServing !== "None" && stats.currentlyServing !== "—";
  const hasWaiting = (stats.waiting ?? 0) > 0;

  return (
    <div className="sf-control-area">

      {/* ── NOW SERVING HERO ─────────────────────────── */}
      <div className="sf-now-serving-hero">
        <div className="sf-now-serving-left">
          <div className="sf-now-serving-label">NOW SERVING</div>
          <div className={`sf-now-serving-number ${isServing ? "active" : "idle"}`}>
            {isServing ? stats.currentlyServing : "—"}
          </div>
          <div className="sf-now-serving-sub">
            {branchInfo?.isHospital ? `Dr. ${selected.name}` : selected.name}
            {selected.counter ? ` · Counter ${selected.counter}` : ""}
          </div>
        </div>

        {/* ── BIG CALL NEXT BUTTON ──────────────────── */}
        <div className="sf-big-actions">
          <button
            className="sf-action-btn call-next"
            onClick={onCallNext}
            disabled={!hasWaiting}
            title={hasWaiting ? "Call the next person in queue" : "No more tokens waiting"}
          >
            <span className="sf-action-btn-icon">▶</span>
            <span className="sf-action-btn-text">
              <span className="sf-action-btn-main">Call Next</span>
              <span className="sf-action-btn-sub">
                {hasWaiting ? `${stats.waiting} waiting` : "Queue empty"}
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* ── STATS ROW ────────────────────────────────── */}
      <div className="sf-stats-row">
        {statItems.map(s => (
          <div key={s.lbl} className="sf-stat-card">
            <div className={`sf-stat-card-icon ${s.cls}`}>{s.icon}</div>
            <div>
              <div className="sf-stat-card-val">{s.val}</div>
              <div className="sf-stat-card-lbl">{s.lbl}</div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default StaffStats;