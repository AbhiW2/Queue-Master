

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Appointments.scss";
import {
  FiArrowLeft, FiCalendar, FiClock, FiMapPin,
  FiSearch, FiCheckCircle, FiXCircle, FiRefreshCw,
  FiHash, FiUser, FiAlertCircle
} from "react-icons/fi";

const Appointments = () => {
  const navigate = useNavigate();

  const [allTokens,    setAllTokens]    = useState([]);
  const [filter,       setFilter]       = useState("All");
  const [search,       setSearch]       = useState("");
  const [loading,      setLoading]      = useState(true);
  const [cancelling,   setCancelling]   = useState(null); // tokenId being cancelled
  const [lastUpdated,  setLastUpdated]  = useState(null);

  const userId      = localStorage.getItem("userId");
  const token       = localStorage.getItem("token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  // ── Fetch full history (active + past) ────────────────
  const fetchAppointments = async () => {
    if (!userId) { navigate("/login"); return; }
    try {
      const res  = await fetch(
        `http://localhost:8080/api/v1/tokens/user/${userId}/history`,
        authHeaders
      );
      const data = res.ok ? await res.json() : [];
      setAllTokens(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ── Cancel token ──────────────────────────────────────
  const handleCancel = async (tokenId) => {
    if (!window.confirm("Are you sure you want to cancel this token?")) return;
    setCancelling(tokenId);
    try {
      await fetch(
        `http://localhost:8080/api/v1/tokens/${tokenId}/cancel?userId=${userId}`,
        { method: "DELETE", headers: authHeaders }
      );
      await fetchAppointments(); // refresh list
    } catch (err) {
      console.error("Cancel error:", err);
    } finally {
      setCancelling(null);
    }
  };

  // ── Map backend status → display status ───────────────
  const mapStatus = (s) => {
    switch (s) {
      case "BOOKED":      return "Upcoming";
      case "CALLED":      return "Called";
      case "IN_PROGRESS": return "In Progress";
      case "COMPLETED":   return "Completed";
      case "CANCELLED":   return "Cancelled";
      case "SKIPPED":     return "Skipped";
      case "NO_SHOW":     return "No Show";
      default:            return s;
    }
  };

  const statusClass = (s) => {
    switch (s) {
      case "Upcoming":    return "upcoming";
      case "Called":      return "called";
      case "In Progress": return "inprogress";
      case "Completed":   return "completed";
      case "Cancelled":   return "cancelled";
      case "Skipped":
      case "No Show":     return "noshow";
      default:            return "upcoming";
    }
  };

  const statusIcon = (s) => {
    switch (s) {
      case "Completed":   return <FiCheckCircle />;
      case "Cancelled":
      case "Skipped":
      case "No Show":     return <FiXCircle />;
      case "Called":      return <FiAlertCircle />;
      default:            return <FiClock />;
    }
  };

  const isActive = (s) => s === "Upcoming" || s === "Called" || s === "In Progress";

  // ── Counts for filter tabs ─────────────────────────────
  const counts = {
    All:         allTokens.length,
    Upcoming:    allTokens.filter(t => ["BOOKED","CALLED","IN_PROGRESS"].includes(t.status)).length,
    Completed:   allTokens.filter(t => t.status === "COMPLETED").length,
    Cancelled:   allTokens.filter(t => ["CANCELLED","SKIPPED","NO_SHOW"].includes(t.status)).length,
  };

  // ── Filter + search ───────────────────────────────────
  const filtered = allTokens.filter((t) => {
    const display = mapStatus(t.status);
    const matchFilter =
      filter === "All"       ? true :
      filter === "Upcoming"  ? isActive(display) :
      filter === "Completed" ? display === "Completed" :
      filter === "Cancelled" ? ["Cancelled","Skipped","No Show"].includes(display)
                             : true;

    const name = (t.doctorName || t.branchServiceName || "").toLowerCase();
    const matchSearch = name.includes(search.toLowerCase()) ||
      (t.displayToken || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.branchName   || "").toLowerCase().includes(search.toLowerCase());

    return matchFilter && matchSearch;
  });

  const formatTime = (d) => d
    ? d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div className="appointments-page">

      {/* ── NAVBAR ───────────────────────────────────── */}
      <div className="appt-navbar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
        <div className="appt-navbar-center">
          <h2>My Appointments</h2>
          <p>View, manage and track your visits</p>
        </div>
        <div className="appt-navbar-right">
          <div className="live-tag">
            <span className="live-dot" />
            {lastUpdated ? `Updated ${formatTime(lastUpdated)}` : "Loading..."}
          </div>
          <button className="refresh-btn" onClick={fetchAppointments}>
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      {/* ── CONTROLS ─────────────────────────────────── */}
      <div className="appt-controls">

        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by doctor, service, branch or token..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch("")}>
              <FiXCircle />
            </button>
          )}
        </div>

        <div className="filter-tabs">
          {["All", "Upcoming", "Completed", "Cancelled"].map((tab) => (
            <button
              key={tab}
              className={filter === tab ? "active" : ""}
              onClick={() => setFilter(tab)}
            >
              {tab}
              <span className="tab-count">{counts[tab]}</span>
            </button>
          ))}
        </div>

      </div>

      {/* ── LOADING ──────────────────────────────────── */}
      {loading ? (
        <div className="appt-loading">
          <div className="appt-spinner" />
          <p>Loading your appointments...</p>
        </div>

      /* ── EMPTY ───────────────────────────────────── */
      ) : filtered.length === 0 ? (
        <div className="appt-empty">
          <div className="appt-empty-icon">📋</div>
          <h3>{search || filter !== "All" ? "No results found" : "No Appointments Yet"}</h3>
          <p>
            {search || filter !== "All"
              ? "Try adjusting your search or filter."
              : "Book a token to get started."}
          </p>
          {!search && filter === "All" && (
            <button onClick={() => navigate("/Userdashboard")}>
              Book a Token
            </button>
          )}
        </div>

      /* ── LIST ────────────────────────────────────── */
      ) : (
        <div className="appt-list">
          {filtered.map((t) => {
            const display = mapStatus(t.status);
            const sc      = statusClass(display);
            const active  = isActive(display);

            return (
              <div key={t.tokenId} className={`appt-card ${active ? "card-active" : ""}`}>

                {/* LEFT — type icon */}
                <div className="appt-type-icon">
                  {t.queueType === "DOCTOR" ? "🏥" : "🏦"}
                </div>

                {/* CENTER — main info */}
                <div className="appt-main">
                  <div className="appt-title-row">
                    <h3>{t.doctorName || t.branchServiceName || "—"}</h3>
                    <span className={`appt-status ${sc}`}>
                      {statusIcon(display)} {display}
                    </span>
                  </div>

                  <div className="appt-meta">
                    <span><FiHash />  Token: <strong>{t.displayToken}</strong></span>
                    <span><FiCalendar /> {t.bookingDate || "—"}</span>
                    <span><FiMapPin />  {t.branchName || "—"}</span>
                    <span><FiUser />   {t.queueType === "DOCTOR" ? "Doctor Visit" : "Service Counter"}</span>
                    {t.estimatedWaitTimeMinutes > 0 && (
                      <span><FiClock /> ~{t.estimatedWaitTimeMinutes} min wait</span>
                    )}
                  </div>
                </div>

                {/* RIGHT — actions */}
                {active && (
                  <div className="appt-actions">
                    <button
                      className="btn-view"
                      onClick={() => navigate("/queue-status")}
                    >
                      <FiClock /> Live Status
                    </button>
                    <button
                      className="btn-cancel"
                      disabled={cancelling === t.tokenId}
                      onClick={() => handleCancel(t.tokenId)}
                    >
                      <FiXCircle />
                      {cancelling === t.tokenId ? "Cancelling..." : "Cancel"}
                    </button>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default Appointments;