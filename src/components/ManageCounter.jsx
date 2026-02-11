import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ManageCounters.scss";
import {
  FiArrowLeft,
  FiPlus,
  FiPower,
  FiUsers,
  FiActivity
} from "react-icons/fi";

const ManageCounters = () => {
  const navigate = useNavigate();

  const [counters, setCounters] = useState([
    { id: 1, name: "Counter 1", service: "General Consultation", active: true },
    { id: 2, name: "Counter 2", service: "Priority Service", active: true },
    { id: 3, name: "Counter 3", service: "Document Verification", active: false },
    { id: 4, name: "Counter 4", service: "General Consultation", active: true }
  ]);

  const toggleStatus = (id) => {
    const updated = counters.map((counter) =>
      counter.id === id
        ? { ...counter, active: !counter.active }
        : counter
    );
    setCounters(updated);
  };

  return (
    <div className="manage-wrapper">

      {/* HEADER */}
      <div className="manage-topbar">
        <div className="left">
          <button
            className="back-btn"
            onClick={() => navigate("/dashboard")}
          >
            <FiArrowLeft /> Back
          </button>

          <div>
            <h2>Manage Counters</h2>
            <p>Control counter availability and service assignments</p>
          </div>
        </div>

        <button className="add-btn">
          <FiPlus /> Add Counter
        </button>
      </div>

      {/* COUNTERS GRID */}
      <div className="counters-grid">
        {counters.map((counter) => (
          <div key={counter.id} className="counter-card">

            <div className="card-top">
              <h3>{counter.name}</h3>
              <span className={`status ${counter.active ? "active" : "inactive"}`}>
                {counter.active ? "Online" : "Offline"}
              </span>
            </div>

            <div className="card-body">
              <div className="info">
                <FiActivity />
                <span>{counter.service}</span>
              </div>

              <div className="info">
                <FiUsers />
                <span>Assigned Staff: 1</span>
              </div>
            </div>

            <div className="card-actions">
              <button
                className={`toggle-btn ${counter.active ? "on" : "off"}`}
                onClick={() => toggleStatus(counter.id)}
              >
                <FiPower />
                {counter.active ? "Deactivate" : "Activate"}
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageCounters;
