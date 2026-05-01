
import React from "react";
import StaffTokenCard from "./StaffTokenCard";

const StaffQueuePanel = ({ queue, loading, onComplete, onSkip, onHold, onNoShow }) => {

  const active  = queue.filter(t => t.status === "IN_PROGRESS");
  const waiting = queue.filter(t => t.status === "BOOKED");
  const done    = queue.filter(t =>
    ["COMPLETED", "CANCELLED", "NO_SHOW", "SKIPPED"].includes(t.status));

  if (loading) {
    return (
      <div className="sf-card">
        <div className="sf-loading">
          <div className="sf-spinner" />
          <span>Loading queue...</span>
        </div>
      </div>
    );
  }

  if (queue.length === 0) {
    return (
      <div className="sf-card">
        <div className="sf-empty">
          <div className="sf-empty-icon">🎫</div>
          <p>No tokens in queue for today</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sf-queue-sections">

      {/* IN PROGRESS */}
      {active.length > 0 && (
        <div className="sf-card sf-card--active">
          <div className="sf-card-head">
            <div className="sf-card-head-left">
              <span className="sf-card-head-dot active" />
              <div>
                <h3>Currently Serving</h3>
                <p>{active.length} token in progress</p>
              </div>
            </div>
            <span className="sf-queue-badge sf-queue-badge--active">LIVE</span>
          </div>
          <div className="sf-tokens-list">
            {active.map(t => (
              <StaffTokenCard
                key={t.tokenId} token={t}
                onComplete={onComplete} onSkip={onSkip}
                onHold={onHold}        onNoShow={onNoShow}
              />
            ))}
          </div>
        </div>
      )}

      {/* WAITING */}
      {waiting.length > 0 && (
        <div className="sf-card">
          <div className="sf-card-head">
            <div className="sf-card-head-left">
              <span className="sf-card-head-dot waiting" />
              <div>
                <h3>Waiting Queue</h3>
                <p>{waiting.length} token{waiting.length !== 1 ? "s" : ""} in line</p>
              </div>
            </div>
            <span className="sf-queue-count">{waiting.length}</span>
          </div>
          <div className="sf-tokens-list">
            {waiting.map(t => (
              <StaffTokenCard
                key={t.tokenId} token={t}
                onComplete={onComplete} onSkip={onSkip}
                onHold={onHold}        onNoShow={onNoShow}
              />
            ))}
          </div>
        </div>
      )}

      {/* DONE */}
      {done.length > 0 && (
        <div className="sf-card sf-card--muted">
          <div className="sf-card-head">
            <div className="sf-card-head-left">
              <span className="sf-card-head-dot done" />
              <div>
                <h3>Completed / Done</h3>
                <p>{done.length} finished today</p>
              </div>
            </div>
          </div>
          <div className="sf-tokens-list">
            {done.map(t => (
              <StaffTokenCard
                key={t.tokenId} token={t}
                onComplete={onComplete} onSkip={onSkip}
                onHold={onHold}        onNoShow={onNoShow}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default StaffQueuePanel;