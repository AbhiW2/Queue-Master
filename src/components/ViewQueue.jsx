import React, { useState, useEffect } from "react";
import "../styles/ViewQueue.scss";
import {
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiArrowLeft
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ViewQueue = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const queueData = [
    { id: "A-103", name: "Rahul Sharma", service: "Account Opening", status: "Waiting", time: "10:15 AM" },
    { id: "A-104", name: "Priya Verma", service: "General Inquiry", status: "Waiting", time: "10:20 AM" },
    { id: "A-105", name: "Amit Patel", service: "Consultation", status: "On Hold", time: "10:25 AM" },
    { id: "A-106", name: "Sneha Rao", service: "KYC Update", status: "Waiting", time: "10:30 AM" },
  ];

  const filteredQueue = queueData.filter((q) => {
    const matchesSearch =
      q.name.toLowerCase().includes(search.toLowerCase()) ||
      q.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || q.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalWaiting = queueData.filter(q => q.status === "Waiting").length;
  const totalHold = queueData.filter(q => q.status === "On Hold").length;

  return (
    <div className="queue-page">
      {/* HEADER */}
<div className="queue-header">
  <div className="left-header">
    <button className="back-btn" onClick={() => navigate(-1)}>
      <FiArrowLeft /> Back
    </button>

    <div className="title-block">
      <h2>Live Queue Management</h2>
      <p>Monitor and manage active customer tokens</p>
    </div>
  </div>

  <div className="right-header">
    <div className="live-clock">🕒 {currentTime}</div>
  </div>
</div>

      {/* KPI CARDS */}
      <div className="kpi-row">
        <div className="kpi-card blue">
          <h4>Total Waiting</h4>
          <span>{totalWaiting}</span>
        </div>

        <div className="kpi-card yellow">
          <h4>On Hold</h4>
          <span>{totalHold}</span>
        </div>

        <div className="kpi-card green">
          <h4>Total Queue</h4>
          <span>{queueData.length}</span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="queue-actions">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by name or token..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Waiting">Waiting</option>
          <option value="On Hold">On Hold</option>
        </select>

        <button className="action-btn">
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {/* TABLE */}
      <div className="queue-table">
        <div className="table-head">
          <span>Token ID</span>
          <span>Customer Name</span>
          <span>Service</span>
          <span>Arrival Time</span>
          <span>Status</span>
        </div>

        {filteredQueue.length === 0 ? (
          <div className="empty-state">
            No matching tokens found.
          </div>
        ) : (
          filteredQueue.map((q, i) => (
            <div key={i} className="table-row">
              <span className="token">{q.id}</span>
              <span>{q.name}</span>
              <span>{q.service}</span>
              <span>{q.time}</span>
              <span className={`status ${q.status.toLowerCase().replace(" ", "-")}`}>
                {q.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewQueue;
