
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/TicketHistory.scss";
// import {
//   FiArrowLeft, FiSearch, FiCheckCircle, FiXCircle,
//   FiClock, FiAlertCircle, FiSkipForward, FiRefreshCw,
//   FiTrash2
// } from "react-icons/fi";

// // Statuses that are "active" — deletion NOT allowed
// const ACTIVE_STATUSES = ["BOOKED", "CALLED", "IN_PROGRESS"];

// const TicketHistory = () => {
//   const navigate = useNavigate();

//   const [tokens,      setTokens]      = useState([]);
//   const [loading,     setLoading]     = useState(true);
//   const [search,      setSearch]      = useState("");
//   const [filter,      setFilter]      = useState("All Status");
//   const [lastUpdated, setLastUpdated] = useState(null);
//   const [deleting,    setDeleting]    = useState(null);

//   const userId         = localStorage.getItem("userId");
//   const getAuthHeaders = () => ({
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${localStorage.getItem("token")}`
//   });

//   const fetchHistory = async () => {
//     if (!userId) { navigate("/login"); return; }
//     setLoading(true);
//     try {
//       const res  = await fetch(
//         `http://localhost:8080/api/v1/tokens/user/${userId}/history`,
//         { headers: getAuthHeaders() }
//       );
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const data = await res.json();
//       setTokens(Array.isArray(data) ? data : []);
//       setLastUpdated(new Date());
//     } catch (err) {
//       console.error("Error fetching token history:", err.message);
//       setTokens([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchHistory(); }, []);

//   const handleDelete = async (tokenId, status) => {
//     if (ACTIVE_STATUSES.includes(status)) return;
//     if (!window.confirm("Remove this token from your history?")) return;
//     setDeleting(tokenId);
//     try {
//       const res = await fetch(
//         `http://localhost:8080/api/v1/tokens/${tokenId}/history?userId=${userId}`,
//         { method: "DELETE", headers: getAuthHeaders() }
//       );
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       setTokens(prev => prev.filter(t => t.tokenId !== tokenId));
//     } catch (err) {
//       console.error("Delete error:", err.message);
//       alert("Failed to remove token. Please try again.");
//     } finally {
//       setDeleting(null);
//     }
//   };

//   const statusConfig = {
//     COMPLETED   : { label: "Completed",   icon: <FiCheckCircle  className="icon success"  />, cls: "completed"   },
//     CANCELLED   : { label: "Cancelled",   icon: <FiXCircle      className="icon danger"   />, cls: "cancelled"   },
//     BOOKED      : { label: "Upcoming",    icon: <FiClock        className="icon upcoming" />, cls: "upcoming"    },
//     CALLED      : { label: "Called",      icon: <FiAlertCircle  className="icon called"   />, cls: "called"      },
//     IN_PROGRESS : { label: "In Progress", icon: <FiClock        className="icon progress" />, cls: "in-progress" },
//     SKIPPED     : { label: "Skipped",     icon: <FiSkipForward  className="icon warning"  />, cls: "skipped"     },
//     NO_SHOW     : { label: "No Show",     icon: <FiAlertCircle  className="icon danger"   />, cls: "no-show"     },
//   };

//   const getConfig = (status) =>
//     statusConfig[status] || { label: status, icon: <FiClock className="icon warning" />, cls: "unknown" };

//   const filterOptions = ["All Status", "Completed", "Upcoming", "Cancelled", "Called", "In Progress", "Skipped", "No Show"];

//   const filtered = tokens.filter((t) => {
//     const cfg         = getConfig(t.status);
//     const matchSearch =
//       t.displayToken?.toLowerCase().includes(search.toLowerCase())        ||
//       t.doctorName?.toLowerCase().includes(search.toLowerCase())          ||
//       t.branchServiceName?.toLowerCase().includes(search.toLowerCase())   ||
//       t.branchName?.toLowerCase().includes(search.toLowerCase());
//     const matchFilter = filter === "All Status" || cfg.label === filter;
//     return matchSearch && matchFilter;
//   });

//   const getServiceName = (t) =>
//     t.queueType === "DOCTOR"
//       ? `Dr. ${t.doctorName || "—"}${t.doctorSpecialization ? ` (${t.doctorSpecialization})` : ""}`
//       : t.branchServiceName || "—";

//   const formatDate = (dateStr) => {
//     if (!dateStr) return "—";
//     const d = new Date(dateStr);
//     return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
//   };

//   const counts = filterOptions.reduce((acc, opt) => {
//     if (opt === "All Status") { acc[opt] = tokens.length; return acc; }
//     acc[opt] = tokens.filter((t) => getConfig(t.status).label === opt).length;
//     return acc;
//   }, {});

//   const canDelete = (status) => !ACTIVE_STATUSES.includes(status);

//   return (
//     <div className="ticket-history-page">

//       <div className="th-navbar">
//         <button className="back-btn" onClick={() => navigate(-1)}>
//           <FiArrowLeft /> Back
//         </button>
//         <h2>Token History</h2>
//         <div className="history-count">{tokens.length} Records</div>
//       </div>

//       <div className="history-controls">
//         <div className="search-box">
//           <FiSearch />
//           <input
//             type="text"
//             placeholder="Search by token, doctor, service or branch..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//         <select
//           className="filter-dropdown"
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//         >
//           {filterOptions.map((opt) => (
//             <option key={opt} value={opt}>
//               {opt} {counts[opt] > 0 ? `(${counts[opt]})` : ""}
//             </option>
//           ))}
//         </select>
//         <button className="refresh-btn" onClick={fetchHistory} disabled={loading}>
//           <FiRefreshCw className={loading ? "spinning" : ""} />
//         </button>
//       </div>

//       {lastUpdated && (
//         <div className="last-updated">
//           Last updated: {lastUpdated.toLocaleTimeString()}
//         </div>
//       )}

//       <div className="delete-hint">
//         <FiTrash2 className="hint-icon" />
//         You can delete completed, cancelled, skipped or no-show tokens.
//         Active tokens (Upcoming / Called / In Progress) cannot be deleted.
//       </div>

//       <div className="history-list">
//         {loading ? (
//           <div className="empty-state">
//             <FiClock className="empty-icon spinning" />
//             <p>Loading token history...</p>
//           </div>
//         ) : filtered.length === 0 ? (
//           <div className="empty-state">
//             <FiClock className="empty-icon" />
//             <p>No tokens found</p>
//             <span>Try changing the filter or search term</span>
//           </div>
//         ) : (
//           filtered.map((t, index) => {
//             const cfg       = getConfig(t.status);
//             const deletable = canDelete(t.status);
//             return (
//               <div key={t.tokenId || index} className={`history-card ${cfg.cls}`}>

//                 <div className="ticket-id">{t.displayToken || "—"}</div>

//                 <div className="ticket-info">
//                   <h4>{getServiceName(t)}</h4>
//                   <p className="branch-name">{t.branchName || "—"}</p>
//                   <p className="date-time">
//                     {formatDate(t.bookingDate)}
//                     {t.queueType && (
//                       <span className={`type-badge ${t.queueType === "DOCTOR" ? "doctor" : "service"}`}>
//                         {t.queueType === "DOCTOR" ? "Hospital" : "Service"}
//                       </span>
//                     )}
//                   </p>
//                 </div>

//                 <div className={`ticket-status ${cfg.cls}`}>
//                   {cfg.icon}
//                   {cfg.label}
//                 </div>

//                 <div className="ticket-actions">
//                   <button
//                     className={`delete-btn${deletable ? "" : " disabled"}`}
//                     title={deletable ? "Remove from history" : "Active tokens cannot be deleted"}
//                     disabled={!deletable || deleting === t.tokenId}
//                     onClick={() => deletable && handleDelete(t.tokenId, t.status)}
//                   >
//                     {deleting === t.tokenId
//                       ? <FiRefreshCw className="spinning" />
//                       : <FiTrash2 />}
//                   </button>
//                 </div>

//               </div>
//             );
//           })
//         )}
//       </div>

//     </div>
//   );
// };

// export default TicketHistory;








import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TicketHistory.scss";
import {
  FiArrowLeft, FiSearch, FiCheckCircle, FiXCircle,
  FiClock, FiAlertCircle, FiSkipForward, FiRefreshCw,
  FiTrash2
} from "react-icons/fi";

// Statuses that are "active" — deletion NOT allowed
const ACTIVE_STATUSES = ["BOOKED", "CALLED", "IN_PROGRESS"];

const TicketHistory = () => {
  const navigate = useNavigate();

  const [tokens,      setTokens]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [filter,      setFilter]      = useState("All Status");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [deleting,    setDeleting]    = useState(null);

  const userId         = localStorage.getItem("userId");
  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`
  });

  const fetchHistory = async () => {
    if (!userId) { navigate("/login"); return; }
    setLoading(true);
    try {
      const res  = await fetch(
        `http://localhost:8080/api/v1/tokens/user/${userId}/history`,
        { headers: getAuthHeaders() }
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

  const handleDelete = async (tokenId, status) => {
    if (ACTIVE_STATUSES.includes(status)) return;
    if (!window.confirm("Remove this token from your history?")) return;
    setDeleting(tokenId);
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/tokens/user/${userId}/history/${tokenId}`,
        { method: "DELETE", headers: getAuthHeaders() }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setTokens(prev => prev.filter(t => t.tokenId !== tokenId));
    } catch (err) {
      console.error("Delete error:", err.message);
      alert("Failed to remove token. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

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

  const filterOptions = ["All Status", "Completed", "Upcoming", "Cancelled", "Called", "In Progress", "Skipped", "No Show"];

  const filtered = tokens.filter((t) => {
    const cfg         = getConfig(t.status);
    const matchSearch =
      t.displayToken?.toLowerCase().includes(search.toLowerCase())        ||
      t.doctorName?.toLowerCase().includes(search.toLowerCase())          ||
      t.branchServiceName?.toLowerCase().includes(search.toLowerCase())   ||
      t.branchName?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All Status" || cfg.label === filter;
    return matchSearch && matchFilter;
  });

  const getServiceName = (t) =>
    t.queueType === "DOCTOR"
      ? `Dr. ${t.doctorName || "—"}${t.doctorSpecialization ? ` (${t.doctorSpecialization})` : ""}`
      : t.branchServiceName || "—";

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const counts = filterOptions.reduce((acc, opt) => {
    if (opt === "All Status") { acc[opt] = tokens.length; return acc; }
    acc[opt] = tokens.filter((t) => getConfig(t.status).label === opt).length;
    return acc;
  }, {});

  const canDelete = (status) => !ACTIVE_STATUSES.includes(status);

  return (
    <div className="ticket-history-page">

      <div className="th-navbar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
        <h2>Token History</h2>
        <div className="history-count">{tokens.length} Records</div>
      </div>

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

      {lastUpdated && (
        <div className="last-updated">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}

      <div className="delete-hint">
        <FiTrash2 className="hint-icon" />
        You can delete completed, cancelled, skipped or no-show tokens.
        Active tokens (Upcoming / Called / In Progress) cannot be deleted.
      </div>

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
            const cfg       = getConfig(t.status);
            const deletable = canDelete(t.status);
            return (
              <div key={t.tokenId || index} className={`history-card ${cfg.cls}`}>

                <div className="ticket-id">{t.displayToken || "—"}</div>

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

                <div className={`ticket-status ${cfg.cls}`}>
                  {cfg.icon}
                  {cfg.label}
                </div>

                <div className="ticket-actions">
                  <button
                    className={`delete-btn${deletable ? "" : " disabled"}`}
                    title={deletable ? "Remove from history" : "Active tokens cannot be deleted"}
                    disabled={!deletable || deleting === t.tokenId}
                    onClick={() => deletable && handleDelete(t.tokenId, t.status)}
                  >
                    {deleting === t.tokenId
                      ? <FiRefreshCw className="spinning" />
                      : <FiTrash2 />}
                  </button>
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