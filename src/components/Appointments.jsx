import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Appointments.scss";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiSearch,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw
} from "react-icons/fi";

const Appointments = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const appointments = [
    {
      id: 1,
      service: "City Hospital – General Checkup",
      date: "05 Feb 2026",
      time: "11:30 AM",
      location: "Block A, Room 12",
      status: "Upcoming"
    },
    {
      id: 2,
      service: "State Bank – Account Verification",
      date: "01 Feb 2026",
      time: "02:15 PM",
      location: "Main Branch Counter 4",
      status: "Completed"
    },
    {
      id: 3,
      service: "Municipal Office – Document Submission",
      date: "28 Jan 2026",
      time: "10:00 AM",
      location: "Desk 7",
      status: "Cancelled"
    }
  ];

  const filteredAppointments = appointments.filter((appt) => {
    const matchesFilter = filter === "All" || appt.status === filter;
    const matchesSearch = appt.service
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="appointments-page">
      {/* ===== TOP BAR ===== */}
      <div className="appointments-topbar">
        <div className="topbar-left">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FiArrowLeft /> Back
          </button>
          <div>
            <h2>My Appointments</h2>
            <p>View, manage and track your upcoming visits</p>
          </div>
        </div>
      </div>

      {/* ===== CONTROLS ===== */}
      <div className="appointments-controls">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by service name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          {["All", "Upcoming", "Completed", "Cancelled"].map((tab) => (
            <button
              key={tab}
              className={filter === tab ? "active" : ""}
              onClick={() => setFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ===== LIST ===== */}
      <div className="appointments-list">
        {filteredAppointments.map((appt) => (
          <div key={appt.id} className="appointment-card">
            <div className="appt-main">
              <h3>{appt.service}</h3>
              <div className="appt-details">
                <span><FiCalendar /> {appt.date}</span>
                <span><FiClock /> {appt.time}</span>
                <span><FiMapPin /> {appt.location}</span>
              </div>
            </div>

            <div className="appt-right">
              <div className={`appt-status ${appt.status.toLowerCase()}`}>
                {appt.status === "Upcoming" && <FiClock />}
                {appt.status === "Completed" && <FiCheckCircle />}
                {appt.status === "Cancelled" && <FiXCircle />}
                <span>{appt.status}</span>
              </div>

              {appt.status === "Upcoming" && (
                <div className="appt-actions">
                  <button className="reschedule">
                    <FiRefreshCw /> Reschedule
                  </button>
                  <button className="cancel">
                    <FiXCircle /> Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredAppointments.length === 0 && (
          <div className="no-data">No appointments found.</div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
