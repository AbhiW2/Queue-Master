import React from "react";

const SATokensPage = ({ setActivePage }) => {
  return (
    <div className="sa-page">
      <div className="sa-coming-soon">
        <div className="sa-cs-icon">🎫</div>
        <h3>Token Overview</h3>
        <p>
          This section will show all active and historical tokens across
          every branch in real time. The Staff queue management backend
          is now complete — this view will be wired up next.
        </p>
        <button className="sa-btn-primary"
          onClick={() => setActivePage("dashboard")}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SATokensPage;