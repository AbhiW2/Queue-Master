import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TicketHistory.scss";
import { FiArrowLeft, FiSearch, FiCheckCircle, FiXCircle, FiClock } from "react-icons/fi";

const TicketHistory = () => {
  const navigate = useNavigate();

  const tickets = [
    { id: "A12", service: "Hospital Visit", date: "02 Feb 2026", time: "10:30 AM", status: "Completed" },
    { id: "B05", service: "Bank Account Opening", date: "28 Jan 2026", time: "1:15 PM", status: "Completed" },
    { id: "G18", service: "Govt Document", date: "20 Jan 2026", time: "11:00 AM", status: "Cancelled" },
    { id: "H22", service: "Hotel Check-in", date: "15 Jan 2026", time: "3:40 PM", status: "Missed" }
  ];

  const getStatusIcon = (status) => {
    if (status === "Completed") return <FiCheckCircle className="icon success" />;
    if (status === "Cancelled") return <FiXCircle className="icon danger" />;
    return <FiClock className="icon warning" />;
  };

  return (
    <div className="ticket-history-page">

      {/* ===== TOP NAVBAR ===== */}
      <div className="th-navbar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
        <h2>Ticket History</h2>
        <div className="history-count">{tickets.length} Records</div>
      </div>

      {/* ===== SEARCH + FILTER ===== */}
      <div className="history-controls">
        <div className="search-box">
          <FiSearch />
          <input type="text" placeholder="Search by service or token..." />
        </div>

        <select className="filter-dropdown">
          <option>All Status</option>
          <option>Completed</option>
          <option>Cancelled</option>
          <option>Missed</option>
        </select>
      </div>

      {/* ===== HISTORY LIST ===== */}
      <div className="history-list">
        {tickets.map((ticket, index) => (
          <div key={index} className="history-card">
            <div className="ticket-id">{ticket.id}</div>

            <div className="ticket-info">
              <h4>{ticket.service}</h4>
              <p>{ticket.date} • {ticket.time}</p>
            </div>

            <div className={`ticket-status ${ticket.status.toLowerCase()}`}>
              {getStatusIcon(ticket.status)}
              {ticket.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketHistory;
