
// import React from "react";

// const STATUS_LABEL = {
//   BOOKED:      "Waiting",
//   IN_PROGRESS: "In Progress",
//   COMPLETED:   "Completed",
//   CANCELLED:   "Cancelled",
//   NO_SHOW:     "No Show",
//   SKIPPED:     "Skipped",
// };

// const StaffTokenCard = ({ token, onComplete, onSkip, onNoShow }) => {
//   const isActive  = token.status === "IN_PROGRESS";
//   const isWaiting = token.status === "BOOKED";
//   const isDone    = ["COMPLETED", "CANCELLED", "NO_SHOW", "SKIPPED"].includes(token.status);
//   const sc        = token.status?.toLowerCase().replace(/_/g, "-");
//   const label     = STATUS_LABEL[token.status] || token.status;

//   return (
//     <div className={`sf-token-card ${sc} ${isActive ? "is-active" : ""} ${isDone ? "is-done" : ""}`}>

//       {/* Left — token number */}
//       <div className={`sf-token-num ${sc}`}>
//         {token.displayToken}
//       </div>

//       {/* Center — customer info */}
//       <div className="sf-token-info">
//         <div className="sf-token-name">👤 {token.customerName || "—"}</div>
//         <div className="sf-token-meta">
//           {token.serviceName}
//           {token.tokenNumber ? ` · #${token.tokenNumber}` : ""}
//         </div>
//       </div>

//       {/* Status pill */}
//       <span className={`sf-pill ${sc}`}>{label}</span>

//       {/* ── ACTION BUTTONS ─────────────────────────────── */}
//       {!isDone && (isActive || isWaiting) && (
//         <div className="sf-actions">

//           {/* MARK SERVED — only when in progress */}
//           {isActive && (
//             <button
//               className="sf-btn sf-btn--served"
//               onClick={() => onComplete(token.tokenId)}
//               title="Mark as Served"
//             >
//               <span className="sf-btn-ico">✓</span>
//               <span className="sf-btn-body">
//                 <b>Mark Served</b>
//                 <small>Done</small>
//               </span>
//             </button>
//           )}

//           {/* HOLD — only when waiting/booked */}
//           {isWaiting && (
//             <button
//               className="sf-btn sf-btn--hold"
//               onClick={() => onSkip(token.tokenId)}
//               title="Hold — skip for now"
//             >
//               <span className="sf-btn-ico">⏸</span>
//               <span className="sf-btn-body">
//                 <b>Hold</b>
//                 <small>Call later</small>
//               </span>
//             </button>
//           )}

//           {/* SKIP — only when in progress */}
//           {isActive && (
//             <button
//               className="sf-btn sf-btn--skip"
//               onClick={() => onSkip(token.tokenId)}
//               title="Skip this token"
//             >
//               <span className="sf-btn-ico">⏭</span>
//               <span className="sf-btn-body">
//                 <b>Skip</b>
//                 <small>Move on</small>
//               </span>
//             </button>
//           )}

//           {/* NO SHOW — always shown for active tokens */}
//           <button
//             className="sf-btn sf-btn--noshow"
//             onClick={() => onNoShow(token.tokenId)}
//             title="Mark as No Show"
//           >
//             <span className="sf-btn-ico">✗</span>
//             <span className="sf-btn-body">
//               <b>No Show</b>
//               <small>Absent</small>
//             </span>
//           </button>

//         </div>
//       )}

//     </div>
//   );
// };

// export default StaffTokenCard;









import React, { useState } from "react";

const STATUS_LABEL = {
  BOOKED:      "Waiting",
  IN_PROGRESS: "In Progress",
  COMPLETED:   "Completed",
  CANCELLED:   "Cancelled",
  NO_SHOW:     "No Show",
  SKIPPED:     "Skipped",
};

/**
 * Button logic by token status:
 *
 * BOOKED (waiting):
 *   [HOLD ⏸]    → moves patient to end of queue
 *   [NO SHOW ✗] → marks absent
 *
 * IN_PROGRESS (being served):
 *   [MARK SERVED ✓] → completes service
 *   [SKIP ⏭]        → loses turn
 *   [NO SHOW ✗]     → marks absent
 *
 * COMPLETED / SKIPPED / NO_SHOW / CANCELLED:
 *   No buttons — read-only
 */
const StaffTokenCard = ({ token, onComplete, onSkip, onHold, onNoShow }) => {
  const [confirming, setConfirming] = useState(null);

  const isActive  = token.status === "IN_PROGRESS";
  const isWaiting = token.status === "BOOKED";
  const isDone    = ["COMPLETED", "CANCELLED", "NO_SHOW", "SKIPPED"].includes(token.status);
  const sc        = token.status?.toLowerCase().replace(/_/g, "-");
  const label     = STATUS_LABEL[token.status] || token.status;

  // Two-click confirm: first click arms, second click fires. Auto-cancels after 4s.
  const handleAction = (action, fn, id) => {
    if (confirming === action) {
      fn(id);
      setConfirming(null);
    } else {
      setConfirming(action);
      setTimeout(() => setConfirming(c => c === action ? null : c), 4000);
    }
  };

  const isConfirming = (action) => confirming === action;

  return (
    <div className={`sf-token-card ${sc} ${isActive ? "is-active" : ""} ${isDone ? "is-done" : ""}`}>

      {/* Token number badge */}
      <div className={`sf-token-num ${sc}`}>
        {token.displayToken}
      </div>

      {/* Customer info */}
      <div className="sf-token-info">
        <div className="sf-token-name">
          <span className="sf-token-avatar">
            {(token.customerName || "?").charAt(0).toUpperCase()}
          </span>
          {token.customerName || "—"}
        </div>
        <div className="sf-token-meta">
          {token.serviceName}
          {token.serviceCounter ? ` · Counter ${token.serviceCounter}` : ""}
          {token.tokenNumber    ? ` · #${token.tokenNumber}` : ""}
        </div>
      </div>

      {/* Status pill */}
      <span className={`sf-pill ${sc}`}>{label}</span>

      {/* ── ACTION BUTTONS ── */}
      {!isDone && (isActive || isWaiting) && (
        <div className="sf-actions">

          {/* IN_PROGRESS actions */}
          {isActive && (
            <>
              <button
                className={`sf-action-btn sf-action-btn--served ${isConfirming("served") ? "confirming" : ""}`}
                onClick={() => handleAction("served", onComplete, token.tokenId)}
                title="Mark patient as served"
              >
                <span className="sf-action-icon">✓</span>
                <span className="sf-action-text">
                  <strong>{isConfirming("served") ? "Confirm?" : "Mark Served"}</strong>
                  <small>{isConfirming("served") ? "Click again" : "Service done"}</small>
                </span>
              </button>

              <button
                className={`sf-action-btn sf-action-btn--skip ${isConfirming("skip") ? "confirming" : ""}`}
                onClick={() => handleAction("skip", onSkip, token.tokenId)}
                title="Skip this token — patient loses their turn"
              >
                <span className="sf-action-icon">⏭</span>
                <span className="sf-action-text">
                  <strong>{isConfirming("skip") ? "Confirm?" : "Skip"}</strong>
                  <small>{isConfirming("skip") ? "Click again" : "Lose turn"}</small>
                </span>
              </button>
            </>
          )}

          {/* BOOKED (waiting) actions */}
          {isWaiting && (
            <button
              className={`sf-action-btn sf-action-btn--hold ${isConfirming("hold") ? "confirming" : ""}`}
              onClick={() => handleAction("hold", onHold, token.tokenId)}
              title="Hold — move patient to end of queue"
            >
              <span className="sf-action-icon">⏸</span>
              <span className="sf-action-text">
                <strong>{isConfirming("hold") ? "Confirm?" : "Hold"}</strong>
                <small>{isConfirming("hold") ? "Click again" : "Move to end"}</small>
              </span>
            </button>
          )}

          {/* No Show — shown for both BOOKED and IN_PROGRESS */}
          <button
            className={`sf-action-btn sf-action-btn--noshow ${isConfirming("noshow") ? "confirming" : ""}`}
            onClick={() => handleAction("noshow", onNoShow, token.tokenId)}
            title="Mark as No Show — patient didn't arrive"
          >
            <span className="sf-action-icon">✗</span>
            <span className="sf-action-text">
              <strong>{isConfirming("noshow") ? "Confirm?" : "No Show"}</strong>
              <small>{isConfirming("noshow") ? "Click again" : "Absent"}</small>
            </span>
          </button>

        </div>
      )}

    </div>
  );
};

export default StaffTokenCard;