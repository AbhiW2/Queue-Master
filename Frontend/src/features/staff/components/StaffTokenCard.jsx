// import React from "react";

// const StaffTokenCard = ({ token, onComplete, onSkip, onNoShow }) => {

//   const statusClass = token.status?.toLowerCase().replace("_", "-");
//   const isActive    = token.status === "IN_PROGRESS";
//   const isBooked    = token.status === "BOOKED";
//   const isDone      = ["COMPLETED","CANCELLED","NO_SHOW","SKIPPED"]
//                         .includes(token.status);

//   return (
//     <div className={`sf-token-card ${statusClass}`}>

//       {/* Token Number */}
//       <div className={`sf-token-card-number ${token.status?.toLowerCase()}`}>
//         {token.displayToken}
//       </div>

//       {/* Info */}
//       <div className="sf-token-card-info">
//         <div className="sf-token-card-customer">
//           👤 {token.customerName}
//         </div>
//         <div className="sf-token-card-service">
//           {token.serviceName} · #{token.tokenNumber}
//         </div>
//       </div>

//       {/* Badge */}
//       <span className={`sf-token-card-badge ${token.status?.toLowerCase()}`}>
//         {token.status?.replace("_", " ")}
//       </span>

//       {/* Actions — only for active/booked tokens */}
//       {(isActive || isBooked) && !isDone && (
//         <div className="sf-token-card-actions">
//           {isActive && (
//             <button
//               className="sf-btn-complete"
//               onClick={() => onComplete(token.tokenId)}
//               title="Mark as Completed"
//             >
//               ✓ Done
//             </button>
//           )}
//           <button
//             className="sf-btn-skip"
//             onClick={() => onSkip(token.tokenId)}
//             title="Skip this token"
//           >
//             ⏭ Skip
//           </button>
//           <button
//             className="sf-btn-noshow"
//             onClick={() => onNoShow(token.tokenId)}
//             title="Mark as No Show"
//           >
//             ✗ No Show
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StaffTokenCard;


import React from "react";

const StaffTokenCard = ({ token, onComplete, onSkip, onNoShow }) => {

  const statusClass = token.status?.toLowerCase().replace(/_/g, "-");
  const isActive    = token.status === "IN_PROGRESS";
  const isBooked    = token.status === "BOOKED";
  const isDone      = ["COMPLETED", "CANCELLED", "NO_SHOW", "SKIPPED"].includes(token.status);

  const statusLabel = {
    BOOKED:      "Waiting",
    IN_PROGRESS: "In Progress",
    COMPLETED:   "Completed",
    CANCELLED:   "Cancelled",
    NO_SHOW:     "No Show",
    SKIPPED:     "Skipped",
  }[token.status] || token.status;

  return (
    <div className={`sf-token-card ${statusClass} ${isActive ? "is-active-row" : ""}`}>

      {/* Token number badge */}
      <div className={`sf-token-card-number ${token.status?.toLowerCase()}`}>
        {token.displayToken}
      </div>

      {/* Customer info */}
      <div className="sf-token-card-info">
        <div className="sf-token-card-customer">
          👤 {token.customerName || "—"}
        </div>
        <div className="sf-token-card-service">
          {token.serviceName} · #{token.tokenNumber}
        </div>
      </div>

      {/* Status badge */}
      <span className={`sf-token-card-badge ${statusClass}`}>
        {statusLabel}
      </span>

      {/* ── ACTION BUTTONS ─────────────────────────────── */}
      {(isActive || isBooked) && !isDone && (
        <div className="sf-token-actions-panel">

          {/* MARK SERVED — green, only for in-progress */}
          {isActive && (
            <button
              className="sf-qbtn served"
              onClick={() => onComplete(token.tokenId)}
              title="Mark as Served — visit complete"
            >
              <span className="sf-qbtn-icon">✓</span>
              <span className="sf-qbtn-label">
                <span className="sf-qbtn-main">Mark Served</span>
                <span className="sf-qbtn-sub">Done</span>
              </span>
            </button>
          )}

          {/* HOLD — amber, only for booked/waiting tokens */}
          {isBooked && (
            <button
              className="sf-qbtn hold"
              onClick={() => onSkip(token.tokenId)}
              title="Hold — skip for now, call later"
            >
              <span className="sf-qbtn-icon">⏸</span>
              <span className="sf-qbtn-label">
                <span className="sf-qbtn-main">Hold</span>
                <span className="sf-qbtn-sub">Skip for now</span>
              </span>
            </button>
          )}

          {/* SKIP — gray, for in-progress */}
          {isActive && (
            <button
              className="sf-qbtn skip"
              onClick={() => onSkip(token.tokenId)}
              title="Skip — move on"
            >
              <span className="sf-qbtn-icon">⏭</span>
              <span className="sf-qbtn-label">
                <span className="sf-qbtn-main">Skip</span>
                <span className="sf-qbtn-sub">Move on</span>
              </span>
            </button>
          )}

          {/* NO SHOW — red, any active token */}
          <button
            className="sf-qbtn noshow"
            onClick={() => onNoShow(token.tokenId)}
            title="No Show — person did not arrive"
          >
            <span className="sf-qbtn-icon">✗</span>
            <span className="sf-qbtn-label">
              <span className="sf-qbtn-main">No Show</span>
              <span className="sf-qbtn-sub">Absent</span>
            </span>
          </button>

        </div>
      )}

    </div>
  );
};

export default StaffTokenCard;