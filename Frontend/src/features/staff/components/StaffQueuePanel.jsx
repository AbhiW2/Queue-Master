// import React from "react";
// import StaffTokenCard from "./StaffTokenCard";

// const StaffQueuePanel = ({ queue, loading, onComplete, onSkip, onNoShow }) => {

//   const active    = queue.filter(t => t.status === "IN_PROGRESS");
//   const waiting   = queue.filter(t => t.status === "BOOKED");
//   const done      = queue.filter(t =>
//     ["COMPLETED","CANCELLED","NO_SHOW","SKIPPED"].includes(t.status));

//   if (loading) {
//     return (
//       <div className="sf-queue-card">
//         <div className="sf-loading">
//           <div className="sf-spinner"/>
//           Loading queue...
//         </div>
//       </div>
//     );
//   }

//   if (queue.length === 0) {
//     return (
//       <div className="sf-queue-card">
//         <div className="sf-empty">
//           <div className="sf-empty-icon">🎫</div>
//           No tokens in queue for today
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>

//       {/* Currently Serving */}
//       {active.length > 0 && (
//         <div className="sf-queue-card">
//           <div className="sf-queue-card-head">
//             <div>
//               <h3>▶ Currently Serving</h3>
//               <p>{active.length} token in progress</p>
//             </div>
//           </div>
//           <div className="sf-tokens-list">
//             {active.map(t => (
//               <StaffTokenCard
//                 key={t.tokenId} token={t}
//                 onComplete={onComplete} onSkip={onSkip} onNoShow={onNoShow}
//               />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Waiting */}
//       {waiting.length > 0 && (
//         <div className="sf-queue-card">
//           <div className="sf-queue-card-head">
//             <div>
//               <h3>⏳ Waiting ({waiting.length})</h3>
//               <p>Tokens waiting to be called</p>
//             </div>
//           </div>
//           <div className="sf-tokens-list">
//             {waiting.map(t => (
//               <StaffTokenCard
//                 key={t.tokenId} token={t}
//                 onComplete={onComplete} onSkip={onSkip} onNoShow={onNoShow}
//               />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Done */}
//       {done.length > 0 && (
//         <div className="sf-queue-card">
//           <div className="sf-queue-card-head">
//             <div>
//               <h3>✅ Completed / Done ({done.length})</h3>
//               <p>Finished tokens today</p>
//             </div>
//           </div>
//           <div className="sf-tokens-list">
//             {done.map(t => (
//               <StaffTokenCard
//                 key={t.tokenId} token={t}
//                 onComplete={onComplete} onSkip={onSkip} onNoShow={onNoShow}
//               />
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StaffQueuePanel;





import React from "react";
import StaffTokenCard from "./StaffTokenCard";

const StaffQueuePanel = ({ queue, loading, onComplete, onSkip, onNoShow }) => {

  const active  = queue.filter(t => t.status === "IN_PROGRESS");
  const waiting = queue.filter(t => t.status === "BOOKED");
  const done    = queue.filter(t =>
    ["COMPLETED", "CANCELLED", "NO_SHOW", "SKIPPED"].includes(t.status));

  if (loading) {
    return (
      <div className="sf-queue-card">
        <div className="sf-loading">
          <div className="sf-spinner" />
          Loading queue...
        </div>
      </div>
    );
  }

  if (queue.length === 0) {
    return (
      <div className="sf-queue-card">
        <div className="sf-empty">
          <div className="sf-empty-icon">🎫</div>
          No tokens in queue for today
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {active.length > 0 && (
        <div className="sf-queue-card">
          <div className="sf-queue-card-head">
            <div>
              <h3>▶ Currently Serving</h3>
              <p>{active.length} token in progress</p>
            </div>
          </div>
          <div className="sf-tokens-list">
            {active.map(t => (
              <StaffTokenCard
                key={t.tokenId} token={t}
                onComplete={onComplete} onSkip={onSkip} onNoShow={onNoShow}
              />
            ))}
          </div>
        </div>
      )}

      {waiting.length > 0 && (
        <div className="sf-queue-card">
          <div className="sf-queue-card-head">
            <div>
              <h3>⏳ Waiting ({waiting.length})</h3>
              <p>Tokens waiting to be called</p>
            </div>
          </div>
          <div className="sf-tokens-list">
            {waiting.map(t => (
              <StaffTokenCard
                key={t.tokenId} token={t}
                onComplete={onComplete} onSkip={onSkip} onNoShow={onNoShow}
              />
            ))}
          </div>
        </div>
      )}

      {done.length > 0 && (
        <div className="sf-queue-card">
          <div className="sf-queue-card-head">
            <div>
              <h3>✅ Completed / Done ({done.length})</h3>
              <p>Finished tokens today</p>
            </div>
          </div>
          <div className="sf-tokens-list">
            {done.map(t => (
              <StaffTokenCard
                key={t.tokenId} token={t}
                onComplete={onComplete} onSkip={onSkip} onNoShow={onNoShow}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default StaffQueuePanel;