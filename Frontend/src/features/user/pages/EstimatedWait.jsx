import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/EstimatedWait.scss";
import {
  FiArrowLeft, FiClock, FiUsers,
  FiActivity, FiAlertCircle, FiRefreshCw,
  FiCheckCircle, FiHash, FiCalendar
} from "react-icons/fi";
import axios from "axios";

const EstimatedWait = () => {
  const navigate = useNavigate();

  const [activeTokens, setActiveTokens] = useState([]);
  const [queueData,    setQueueData]    = useState({});
  const [loading,      setLoading]      = useState(true);
  const [lastUpdated,  setLastUpdated]  = useState(null);
  const [selected,     setSelected]     = useState(0);

  const userId         = localStorage.getItem("userId");
  const getAuthHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

  const fetchAll = async () => {
    if (!userId) { navigate("/login"); return; }
    try {
      const activeRes = await axios.get(
        `http://localhost:8080/api/v1/tokens/user/${userId}/active`,
        { headers: getAuthHeaders() }
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

  const getQueue = (t) => {
    const key = t.queueType === "DOCTOR"
      ? `doctor-${t.doctorId}`
      : `bs-${t.branchServiceId}`;
    return queueData[key] || null;
  };

  const formatTime = (d) => d
    ? d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "";

  // Format a LocalTime string like "09:30:00" → "09:30 AM"
  const formatLocalTime = (timeStr) => {
    if (!timeStr) return null;
    const [h, m] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(h, m, 0);
    return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

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

  // Build headline + sub-text for hero card
  const buildWaitLabel = (t) => {
    if (t.status === "CALLED")
      return { headline: "Your Turn!", sub: "Please proceed to the counter immediately" };
    if (t.status === "IN_PROGRESS")
      return { headline: "Being Served", sub: "You are currently being served" };

    const mins      = t.estimatedWaitTimeMinutes ?? 0;
    const tokenTime = t.scheduledTime ? formatLocalTime(t.scheduledTime) : null;
    const headline  = `~${mins} min${mins !== 1 ? "s" : ""}`;
    const sub       = tokenTime
      ? `Estimated wait · Your token time: ${tokenTime}`
      : "Approximate time until your turn";

    return { headline, sub, tokenTime, mins };
  };

  const t        = activeTokens[selected] || null;
  const q        = t ? getQueue(t) : null;
  const waitInfo = t ? buildWaitLabel(t) : null;

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

      {loading ? (
        <div className="ew-loading">
          <div className="ew-spinner" />
          <p>Fetching your queue data...</p>
        </div>

      ) : activeTokens.length === 0 ? (
        <div className="ew-empty">
          <div className="ew-empty-icon">🎫</div>
          <h3>No Active Tokens</h3>
          <p>Book a token to see your estimated wait time.</p>
          <button onClick={() => navigate("/Userdashboard")}>Book a Token</button>
        </div>

      ) : (
        <div className="ew-content">

          {activeTokens.length > 1 && (
            <div className="ew-tabs">
              {activeTokens.map((tok, i) => (
                <button
                  key={tok.tokenId}
                  className={`ew-tab ${i === selected ? "active" : ""}`}
                  onClick={() => setSelected(i)}
                >
                  {tok.displayToken}
                  <span className="ew-tab-sub">{tok.doctorName || tok.branchServiceName}</span>
                </button>
              ))}
            </div>
          )}

          {t && waitInfo && (
            <>
              {/* ── HERO WAIT CARD ────────────────────── */}
              <div className={`ew-hero ${t.status === "CALLED" ? "hero-urgent" : ""}`}>
                <div className="ew-hero-left">
                  <FiClock className="ew-hero-icon" />
                  <div>
                    <h1>{waitInfo.headline}</h1>
                    <p>{waitInfo.sub}</p>

                    {/* Token time pill — shown when scheduledTime exists */}
                    {waitInfo.tokenTime && (
                      <div className="ew-time-pill">
                        <FiCalendar className="ew-time-pill-icon" />
                        <span>
                          Token scheduled at&nbsp;<strong>{waitInfo.tokenTime}</strong>
                          {waitInfo.mins > 0 && <>&nbsp;·&nbsp;~{waitInfo.mins} min wait</>}
                        </span>
                      </div>
                    )}
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
                  <div className="ew-stat-icon blue"><FiUsers /></div>
                  <div className="ew-stat-body">
                    <span className="ew-stat-label">People Ahead</span>
                    <span className="ew-stat-value">{t.queuePosition ?? 0}</span>
                  </div>
                </div>

                <div className="ew-stat-card">
                  <div className="ew-stat-icon green"><FiActivity /></div>
                  <div className="ew-stat-body">
                    <span className="ew-stat-label">Now Serving</span>
                    <span className="ew-stat-value">{q?.currentlyServingToken || "—"}</span>
                  </div>
                </div>

                <div className="ew-stat-card">
                  <div className="ew-stat-icon orange"><FiClock /></div>
                  <div className="ew-stat-body">
                    <span className="ew-stat-label">Avg. Service Time</span>
                    <span className="ew-stat-value">
                      {t.queueType === "DOCTOR"
                        ? `${t.avgConsultationTime ?? 4} mins`
                        : `${t.avgServiceTime ?? 4} mins`}
                    </span>
                  </div>
                </div>

                {/* Your Token Time stat card */}
                {t.scheduledTime && (
                  <div className="ew-stat-card highlighted">
                    <div className="ew-stat-icon purple"><FiCalendar /></div>
                    <div className="ew-stat-body">
                      <span className="ew-stat-label">Your Token Time</span>
                      <span className="ew-stat-value">{formatLocalTime(t.scheduledTime)}</span>
                    </div>
                  </div>
                )}

                <div className="ew-stat-card highlighted">
                  <div className="ew-stat-icon red"><FiHash /></div>
                  <div className="ew-stat-body">
                    <span className="ew-stat-label">Total in Queue</span>
                    <span className="ew-stat-value">{q?.totalTokens ?? 0}</span>
                  </div>
                </div>

                <div className="ew-stat-card">
                  <div className="ew-stat-icon purple"><FiCheckCircle /></div>
                  <div className="ew-stat-body">
                    <span className="ew-stat-label">Completed</span>
                    <span className="ew-stat-value">{q?.completedCount ?? 0}</span>
                  </div>
                </div>

                <div className="ew-stat-card">
                  <div className="ew-stat-icon teal"><FiUsers /></div>
                  <div className="ew-stat-body">
                    <span className="ew-stat-label">Still Waiting</span>
                    <span className="ew-stat-value">{q?.waitingCount ?? 0}</span>
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
                  <div className="ew-progress-fill" style={{ width: `${progressPct(t, q)}%` }} />
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
                  {t.scheduledTime && (
                    <div className="ew-detail-row">
                      <span>Token Time</span>
                      <strong className="token-time-value">
                        {formatLocalTime(t.scheduledTime)}
                        {t.slotEndTime && ` – ${formatLocalTime(t.slotEndTime)}`}
                      </strong>
                    </div>
                  )}
                  {(t.estimatedWaitTimeMinutes ?? 0) > 0 && (
                    <div className="ew-detail-row">
                      <span>Est. Wait</span>
                      <strong>~{t.estimatedWaitTimeMinutes} mins</strong>
                    </div>
                  )}
                  <div className="ew-detail-row">
                    <span>Type</span>
                    <strong>{t.queueType === "DOCTOR" ? "Doctor Visit" : "Service Counter"}</strong>
                  </div>
                  <div className="ew-detail-row">
                    <span>Status</span>
                    <strong className={statusClass(t.status)}>{statusLabel(t.status)}</strong>
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