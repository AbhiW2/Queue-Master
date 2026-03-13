import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TicketHistory.scss";
import {
  FiArrowLeft, FiSearch, FiCheckCircle, FiXCircle,
  FiClock, FiAlertCircle, FiSkipForward, FiRefreshCw
} from "react-icons/fi";

const TicketHistory = () => {
  const navigate = useNavigate();

  const [tokens,       setTokens]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [filter,       setFilter]       = useState("All Status");
  const [lastUpdated,  setLastUpdated]  = useState(null);

  const userId      = localStorage.getItem("userId");
  const token       = localStorage.getItem("token");
  const authHeaders = {
    "Content-Type": "application/json",
    Authorization : `Bearer ${token}`
  };

  // ── Fetch token history ────────────────────────────────
  const fetchHistory = async () => {
    if (!userId) { navigate("/login"); return; }
    setLoading(true);
    try {
      const res  = await fetch(
        `http://localhost:8080/api/v1/tokens/user/${userId}/history`,
        { headers: authHeaders }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTokens(Array.isArray(data) ? data : []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching token history:", err.message);
      setTokens([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  // ── Status config ──────────────────────────────────────
  const statusConfig = {
    COMPLETED   : { label: "Completed",   icon: <FiCheckCircle  className="icon success"  />, cls: "completed"   },
    CANCELLED   : { label: "Cancelled",   icon: <FiXCircle      className="icon danger"   />, cls: "cancelled"   },
    BOOKED      : { label: "Upcoming",    icon: <FiClock        className="icon upcoming" />, cls: "upcoming"    },
    CALLED      : { label: "Called",      icon: <FiAlertCircle  className="icon called"   />, cls: "called"      },
    IN_PROGRESS : { label: "In Progress", icon: <FiClock        className="icon progress" />, cls: "in-progress" },
    SKIPPED     : { label: "Skipped",     icon: <FiSkipForward  className="icon warning"  />, cls: "skipped"     },
    NO_SHOW     : { label: "No Show",     icon: <FiAlertCircle  className="icon danger"   />, cls: "no-show"     },
  };

  const getConfig = (status) =>
    statusConfig[status] || { label: status, icon: <FiClock className="icon warning" />, cls: "unknown" };

  // ── Filter options ─────────────────────────────────────
  const filterOptions = ["All Status", "Completed", "Upcoming", "Cancelled", "Called", "In Progress", "Skipped", "No Show"];

  // ── Filter + search ────────────────────────────────────
  const filtered = tokens.filter((t) => {
    const cfg         = getConfig(t.status);
    const matchSearch =
      t.displayToken?.toLowerCase().includes(search.toLowerCase())        ||
      t.doctorName?.toLowerCase().includes(search.toLowerCase())          ||
      t.branchServiceName?.toLowerCase().includes(search.toLowerCase())   ||
      t.branchName?.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "All Status" || cfg.label === filter;

    return matchSearch && matchFilter;
  });

  // ── Service label ──────────────────────────────────────
  const getServiceName = (t) =>
    t.queueType === "DOCTOR"
      ? `Dr. ${t.doctorName || "—"}${t.doctorSpecialization ? ` (${t.doctorSpecialization})` : ""}`
      : t.branchServiceName || "—";

  // ── Format date ────────────────────────────────────────
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  // ── Status counts ──────────────────────────────────────
  const counts = filterOptions.reduce((acc, opt) => {
    if (opt === "All Status") { acc[opt] = tokens.length; return acc; }
    acc[opt] = tokens.filter((t) => getConfig(t.status).label === opt).length;
    return acc;
  }, {});

  return (
    <div className="ticket-history-page">

      {/* ── NAVBAR ─────────────────────────────────────── */}
      <div className="th-navbar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
        <h2>Token History</h2>
        <div className="history-count">{tokens.length} Records</div>
      </div>

      {/* ── SEARCH + FILTER ────────────────────────────── */}
      <div className="history-controls">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by token, doctor, service or branch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="filter-dropdown"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {filterOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt} {counts[opt] > 0 ? `(${counts[opt]})` : ""}
            </option>
          ))}
        </select>
        <button className="refresh-btn" onClick={fetchHistory} disabled={loading}>
          <FiRefreshCw className={loading ? "spinning" : ""} />
        </button>
      </div>

      {/* ── LAST UPDATED ───────────────────────────────── */}
      {lastUpdated && (
        <div className="last-updated">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}

      {/* ── HISTORY LIST ───────────────────────────────── */}
      <div className="history-list">
        {loading ? (
          <div className="empty-state">
            <FiClock className="empty-icon spinning" />
            <p>Loading token history...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <FiClock className="empty-icon" />
            <p>No tokens found</p>
            <span>Try changing the filter or search term</span>
          </div>
        ) : (
          filtered.map((t, index) => {
            const cfg = getConfig(t.status);
            return (
              <div key={t.tokenId || index} className={`history-card ${cfg.cls}`}>

                {/* TOKEN ID */}
                <div className="ticket-id">{t.displayToken || "—"}</div>

                {/* INFO */}
                <div className="ticket-info">
                  <h4>{getServiceName(t)}</h4>
                  <p className="branch-name">{t.branchName || "—"}</p>
                  <p className="date-time">
                    {formatDate(t.bookingDate)}
                    {t.queueType && (
                      <span className={`type-badge ${t.queueType === "DOCTOR" ? "doctor" : "service"}`}>
                        {t.queueType === "DOCTOR" ? "Hospital" : "Service"}
                      </span>
                    )}
                  </p>
                </div>

                {/* STATUS */}
                <div className={`ticket-status ${cfg.cls}`}>
                  {cfg.icon}
                  {cfg.label}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default TicketHistory;