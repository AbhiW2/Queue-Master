import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ServicesAndQueues.scss";
import {
  FiPlus,
  FiSearch,
  FiMoreVertical,
  FiUsers,
  FiClock,
  FiActivity,
  FiArrowLeft
} from "react-icons/fi";

const ServicesAndQueues = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const services = [
    {
      id: 1,
      name: "General Consultation",
      active: true,
      waiting: 18,
      avgTime: "12 min",
      counters: 3
    },
    {
      id: 2,
      name: "Priority Service",
      active: true,
      waiting: 6,
      avgTime: "5 min",
      counters: 2
    },
    {
      id: 3,
      name: "Document Verification",
      active: false,
      waiting: 0,
      avgTime: "-",
      counters: 1
    }
  ];

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="services-wrapper">

      {/* ===== PROFESSIONAL HEADER BAR ===== */}
      {/* ===== PROFESSIONAL HEADER BAR ===== */}
<div className="services-topbar">

  {/* LEFT SIDE */}
  <div className="left-section">
    <button
      className="back-btn"
      onClick={() => navigate("/dashboard")}
    >
      <FiArrowLeft /> Back
    </button>

    <div className="title-area">
      <h2>Services & Queues</h2>
      <p>Enterprise queue monitoring & operational control</p>
    </div>
  </div>

  {/* RIGHT SIDE */}
  <div className="right-section">
    <span className="badge">
      {services.length} Services
    </span>
    <span className="last-updated">
      Last updated: Just now
    </span>
  </div>

</div>


      {/* ===== HEADER ACTION AREA ===== */}
      <div className="services-header">
        <div>
          <h3>Manage Services</h3>
          <p>Configure queues, monitor wait times and allocate counters.</p>
        </div>

        <button className="add-service-btn">
          <FiPlus /> Add Service
        </button>
      </div>

      {/* ===== SEARCH BAR ===== */}
      <div className="services-toolbar">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ===== SERVICES GRID ===== */}
      <div className="services-grid">
        {filteredServices.map((service) => (
          <div key={service.id} className="service-card">

            <div className="service-top">
              <div>
                <h3>{service.name}</h3>
                <span className={`status ${service.active ? "active" : "inactive"}`}>
                  {service.active ? "Active" : "Paused"}
                </span>
              </div>

              <FiMoreVertical className="more-icon" />
            </div>

            <div className="service-metrics">
              <div className="metric">
                <FiUsers />
                <div>
                  <strong>{service.waiting}</strong>
                  <span>Waiting</span>
                </div>
              </div>

              <div className="metric">
                <FiClock />
                <div>
                  <strong>{service.avgTime}</strong>
                  <span>Avg Time</span>
                </div>
              </div>

              <div className="metric">
                <FiActivity />
                <div>
                  <strong>{service.counters}</strong>
                  <span>Counters</span>
                </div>
              </div>
            </div>

            <div className="service-actions">
              <button className="manage-btn">Manage</button>
              <button className="toggle-btn">
                {service.active ? "Pause" : "Activate"}
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesAndQueues;
