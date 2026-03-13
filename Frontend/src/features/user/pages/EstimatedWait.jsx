// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/EstimatedWait.scss";
// import {
//   FiArrowLeft,
//   FiClock,
//   FiUsers,
//   FiActivity,
//   FiAlertCircle
// } from "react-icons/fi";

// const EstimatedWait = () => {
//   const navigate = useNavigate();

//   const currentToken = "A21";
//   const nowServing = "A18";
//   const avgServiceTime = "4 mins";
//   const peopleAhead = 3;
//   const estimatedWait = 12; // minutes

//   return (
//     <div className="estimated-page">
//       {/* ===== TOP BAR ===== */}
//       <div className="topbar">
//         <button className="back-btn" onClick={() => navigate(-1)}>
//           <FiArrowLeft /> Back
//         </button>
//         <h2>Estimated Waiting Time</h2>
//       </div>

//       {/* ===== MAIN WAIT CARD ===== */}
//       <div className="wait-highlight">
//         <FiClock className="wait-icon" />
//         <div>
//           <h1>{estimatedWait} mins</h1>
//           <p>Approximate time until your turn</p>
//         </div>
//       </div>

//       {/* ===== STATS GRID ===== */}
//       <div className="stats-grid">
//         <div className="stat-card">
//           <FiUsers className="icon blue" />
//           <h4>People Ahead</h4>
//           <p>{peopleAhead}</p>
//         </div>

//         <div className="stat-card">
//           <FiActivity className="icon green" />
//           <h4>Now Serving</h4>
//           <p>{nowServing}</p>
//         </div>

//         <div className="stat-card">
//           <FiClock className="icon orange" />
//           <h4>Avg. Service Time</h4>
//           <p>{avgServiceTime}</p>
//         </div>

//         <div className="stat-card highlight">
//           <FiAlertCircle className="icon red" />
//           <h4>Your Token</h4>
//           <p>{currentToken}</p>
//         </div>
//       </div>

//       {/* ===== PROGRESS BAR ===== */}
//       <div className="progress-section">
//         <h3>Queue Progress</h3>
//         <div className="progress-bar">
//           <div className="progress-fill" style={{ width: "70%" }}></div>
//         </div>
//         <p>You are getting closer. Please stay nearby the service area.</p>
//       </div>

//       {/* ===== TIPS / ALERT ===== */}
//       <div className="info-box">
//         <FiAlertCircle />
//         <span>
//           Waiting time may vary depending on service complexity and priority
//           cases.
//         </span>
//       </div>
//     </div>
//   );
// };

// export default EstimatedWait;




import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/EstimatedWait.scss";
import {
  FiArrowLeft, FiClock, FiUsers,
  FiActivity, FiAlertCircle, FiRefreshCw,
  FiCheckCircle, FiHash
} from "react-icons/fi";
import axios from "axios";

const EstimatedWait = () => {
  const navigate = useNavigate();

  const [activeTokens, setActiveTokens] = useState([]);
  const [queueData,    setQueueData]    = useState({});
  const [loading,      setLoading]      = useState(true);
  const [lastUpdated,  setLastUpdated]  = useState(null);
  const [selected,     setSelected]     = useState(0); // index of selected token tab

  const userId      = localStorage.getItem("userId");
  const token       = localStorage.getItem("token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  // ── Fetch all active tokens + queue status for each ───
  const fetchAll = async () => {
    if (!userId) { navigate("/login"); return; }
    try {
      const activeRes  = await axios.get(
        `http://localhost:8080/api/v1/tokens/user/${userId}/active`,
        authHeaders
      );
      const tokens = activeRes.data || [];
      setActiveTokens(tokens);

      const today    = new Date().toISOString().split("T")[0];
      const statuses = {};

      await Promise.all(tokens.map(async (t) => {
        try {
          const key = t.queueType === "DOCTOR"
            ? `doctor-${t.doctorId}`
            : `bs-${t.branchServiceId}`;

          const url = t.queueType === "DOCTOR"
            ? `http://localhost:8080/api/v1/tokens/doctor/${t.doctorId}/queue-status`
            : `http://localhost:8080/api/v1/tokens/branch-service/${t.branchServiceId}/queue-status`;

          const res      = await axios.get(url, { params: { date: today } });
          statuses[key]  = res.data;
        } catch (e) {
          console.error("Queue status error:", e);
        }
      }));

      setQueueData(statuses);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 15000);
    return () => clearInterval(interval);
  }, []);

  // ── Helpers ────────────────────────────────────────────
  const getQueue = (t) => {
    const key = t.queueType === "DOCTOR"
      ? `doctor-${t.doctorId}`
      : `bs-${t.branchServiceId}`;
    return queueData[key] || null;
  };

  const formatTime = (d) => d
    ? d.toLocaleTimeString("en-IN", {
        hour: "2-digit", minute: "2-digit", second: "2-digit"
      })
    : "";

  const progressPct = (t, q) => {
    if (!q || !q.totalTokens) return 0;
    return Math.min(100, Math.round((q.completedCount / q.totalTokens) * 100));
  };

  const statusLabel = (s) => ({
    BOOKED:      "Waiting",
    CALLED:      "Called — Go Now!",
    IN_PROGRESS: "Being Served",
    COMPLETED:   "Completed",
  }[s] || s);

  const statusClass = (s) => ({
    BOOKED:      "badge-waiting",
    CALLED:      "badge-called",
    IN_PROGRESS: "badge-serving",
    COMPLETED:   "badge-done",
  }[s] || "badge-waiting");

  // ── Current selected token ─────────────────────────────
  const t = activeTokens[selected] || null;
  const q = t ? getQueue(t) : null;

  return (
    <div className="ew-page">

      {/* ── NAVBAR ─────────────────────────────────────── */}
      <div className="ew-navbar">
        <button className="ew-back" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
        <h2>Estimated Waiting Time</h2>
        <div className="ew-live">
          <span className="ew-dot" />
          Live · {formatTime(lastUpdated)}
        </div>
      </div>

      {/* ── LOADING ────────────────────────────────────── */}
      {loading ? (
        <div className="ew-loading">
          <div className="ew-spinner" />
          <p>Fetching your queue data...</p>
        </div>

      /* ── EMPTY ─────────────────────────────────────── */
      ) : activeTokens.length === 0 ? (
        <div className="ew-empty">
          <div className="ew-empty-icon">🎫</div>
          <h3>No Active Tokens</h3>
          <p>Book a token to see your estimated wait time.</p>
          <button onClick={() => navigate("/Userdashboard")}>
            Book a Token
          </button>
        </div>

      /* ── MAIN ──────────────────────────────────────── */
      ) : (
        <div className="ew-content">

          {/* TOKEN TABS — if multiple bookings */}
          {activeTokens.length > 1 && (
            <div className="ew-tabs">
              {activeTokens.map((tok, i) => (
                <button
                  key={tok.tokenId}
                  className={`ew-tab ${i === selected ? "active" : ""}`}
                  onClick={() => setSelected(i)}
                >
                  {tok.displayToken}
                  <span className="ew-tab-sub">
                    {tok.doctorName || tok.branchServiceName}
                  </span>
                </button>
              ))}
            </div>
          )}

          {t && (
            <>
              {/* ── HERO WAIT CARD ────────────────────── */}
              <div className={`ew-hero ${t.status === "CALLED" ? "hero-urgent" : ""}`}>
                <div className="ew-hero-left">
                  <FiClock className="ew-hero-icon" />
                  <div>
                    <h1>
                      {t.status === "CALLED"
                        ? "Your Turn!"
                        : t.status === "IN_PROGRESS"
                        ? "Being Served"
                        : `${t.estimatedWaitTimeMinutes ?? 0} mins`}
                    </h1>
                    <p>
                      {t.status === "CALLED"
                        ? "Please proceed to the counter immediately"
                        : t.status === "IN_PROGRESS"
                        ? "You are currently being served"
                        : "Approximate time until your turn"}
                    </p>
                  </div>
                </div>
                <div className="ew-hero-right">
                  <span className={`ew-status-badge ${statusClass(t.status)}`}>
                    {statusLabel(t.status)}
                  </span>
                  <div className="ew-token-big">{t.displayToken}</div>
                  <div className="ew-token-label">
                    {t.queueType === "DOCTOR" ? "🏥" : "🏦"}{" "}
                    {t.doctorName || t.branchServiceName}
                  </div>
                </div>
              </div>

              {/* ── STATS GRID ───────────────────────── */}
              <div className="ew-stats">

                <div className="ew-stat-card">
                  <div className="ew-stat-icon blue">
                    <FiUsers />
                  </div>
                  <div className="ew-stat-body">
                    <span className="ew-stat-label">People Ahead</span>
                    <span className="ew-stat-value">
                      {t.queuePosition ?? 0}
                    </span>
                  </div>
                </div>

                <div className="ew-stat-card">
                  <div className="ew-stat-icon green">
                    <FiActivity />
                  </div>
                  <div className="ew-stat-body">
                    <span className="ew-stat-label">Now Serving</span>
                    <span className="ew-stat-value">
                      {q?.currentlyServingToken || "—"}
                    </span>
                  </div>
                </div>

                <div className="ew-stat-card">
                  <div className="ew-stat-icon orange">
                    <FiClock />
                  </div>
                  <div className="ew-stat-body">
                    <span className="ew-stat-label">Avg. Service Time</span>
                    <span className="ew-stat-value">
                      {t.queueType === "DOCTOR"
                        ? `${t.avgConsultationTime ?? 4} mins`
                        : `${t.avgServiceTime ?? 4} mins`}
                    </span>
                  </div>
                </div>

                <div className="ew-stat-card highlighted">
                  <div className="ew-stat-icon red">
                    <FiHash />
                  </div>
                  <div className="ew-stat-body">
                    <span className="ew-stat-label">Total in Queue</span>
                    <span className="ew-stat-value">
                      {q?.totalTokens ?? 0}
                    </span>
                  </div>
                </div>

                <div className="ew-stat-card">
                  <div className="ew-stat-icon purple">
                    <FiCheckCircle />
                  </div>
                  <div className="ew-stat-body">
                    <span className="ew-stat-label">Completed</span>
                    <span className="ew-stat-value">
                      {q?.completedCount ?? 0}
                    </span>
                  </div>
                </div>

                <div className="ew-stat-card">
                  <div className="ew-stat-icon teal">
                    <FiUsers />
                  </div>
                  <div className="ew-stat-body">
                    <span className="ew-stat-label">Still Waiting</span>
                    <span className="ew-stat-value">
                      {q?.waitingCount ?? 0}
                    </span>
                  </div>
                </div>

              </div>

              {/* ── PROGRESS BAR ─────────────────────── */}
              <div className="ew-progress-card">
                <div className="ew-progress-header">
                  <h3>Queue Progress</h3>
                  <span>{progressPct(t, q)}% completed</span>
                </div>
                <div className="ew-progress-track">
                  <div
                    className="ew-progress-fill"
                    style={{ width: `${progressPct(t, q)}%` }}
                  />
                </div>
                <div className="ew-progress-meta">
                  <span>{q?.completedCount ?? 0} served</span>
                  <span>{q?.waitingCount ?? 0} remaining</span>
                </div>
                <p className="ew-progress-tip">
                  Please stay nearby the service area. You will be called shortly.
                </p>
              </div>

              {/* ── BOOKING DETAILS ───────────────────── */}
              <div className="ew-details-card">
                <h3>Booking Details</h3>
                <div className="ew-details-grid">
                  <div className="ew-detail-row">
                    <span>Branch</span>
                    <strong>{t.branchName || "—"}</strong>
                  </div>
                  <div className="ew-detail-row">
                    <span>Date</span>
                    <strong>{t.bookingDate || "—"}</strong>
                  </div>
                  <div className="ew-detail-row">
                    <span>Type</span>
                    <strong>{t.queueType === "DOCTOR" ? "Doctor Visit" : "Service Counter"}</strong>
                  </div>
                  <div className="ew-detail-row">
                    <span>Status</span>
                    <strong className={statusClass(t.status)}>
                      {statusLabel(t.status)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* ── INFO BOX ─────────────────────────── */}
              <div className={`ew-info-box ${t.status === "CALLED" ? "info-urgent" : ""}`}>
                <FiAlertCircle className="ew-info-icon" />
                <span>
                  {t.status === "CALLED"
                    ? "Your token has been called! Please proceed to the counter immediately or you may lose your turn."
                    : "Waiting time may vary depending on service complexity and priority cases. Please stay nearby."}
                </span>
              </div>

              {/* ── REFRESH BUTTON ───────────────────── */}
              <button className="ew-refresh-btn" onClick={fetchAll}>
                <FiRefreshCw /> Refresh Now
              </button>

            </>
          )}
        </div>
      )}
    </div>
  );
};

export default EstimatedWait;