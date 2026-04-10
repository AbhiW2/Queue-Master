import React, { useState } from "react";
import { statusColor } from "../utils/adHelpers";

const ADQueuePage = ({ queue, onRefresh }) => {
  const [search, setSearch] = useState("");

  const filtered = queue.filter(t =>
    t.displayToken?.toLowerCase().includes(search.toLowerCase()) ||
    t.username?.toLowerCase().includes(search.toLowerCase()) ||
    t.status?.toLowerCase().includes(search.toLowerCase())
  );

  const counts = [
    { cls: "",          lbl: "Total Today", val: queue.length },
    { cls: "active",    lbl: "Active",
      val: queue.filter(t => ["BOOKED","CALLED","IN_PROGRESS"].includes(t.status)).length },
    { cls: "completed", lbl: "Completed",
      val: queue.filter(t => t.status === "COMPLETED").length },
    { cls: "cancelled", lbl: "Cancelled",
      val: queue.filter(t => t.status === "CANCELLED").length },
  ];

  return (
    <>
      <div className="ad-queue-stats">
        {counts.map(s => (
          <div key={s.lbl} className={`ad-queue-stat ${s.cls}`}>
            <div className="val">{s.val}</div>
            <div className="lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      <div className="ad-page-actions">
        <div className="ad-search-box">
          <span className="ad-search-icon">🔍</span>
          <input
            placeholder="Search by token, customer or status..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="ad-btn-secondary" onClick={onRefresh}>
          ↻ Refresh
        </button>
      </div>

      <div className="ad-card">
        <div className="ad-card-head">
          <div>
            <h3>Today's Queue</h3>
            <p>Live view — auto-refreshes every 30 seconds</p>
          </div>
        </div>
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>#</th><th>Token</th><th>Customer</th>
                <th>Service</th><th>Type</th><th>Status</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr key={t.id}>
                  <td className="ad-cell-muted">{i + 1}</td>
                  <td>
                    <span style={{ fontWeight:700, fontSize:"15px", color:"#2563eb",
                      fontFamily:"'JetBrains Mono', monospace" }}>
                      {t.displayToken}
                    </span>
                  </td>
                  <td>
                    <div className="ad-cell-user">
                      <div className="ad-cell-avatar">
                        {t.username?.charAt(0)?.toUpperCase()}
                      </div>
                      <span>{t.username}</span>
                    </div>
                  </td>
                  <td className="ad-cell-muted">{t.serviceName}</td>
                  <td>
                    <span className={`ad-badge type-${t.queueType?.toLowerCase()}`}>
                      {t.queueType === "DOCTOR" ? "🩺 Doctor" : "⚙️ Service"}
                    </span>
                  </td>
                  <td>
                    <span className={`ad-badge ${statusColor(t.status)}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="ad-cell-muted">{t.bookingDate}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="ad-empty-row">No tokens in queue today</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ADQueuePage;