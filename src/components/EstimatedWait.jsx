import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/EstimatedWait.scss";
import {
  FiArrowLeft,
  FiClock,
  FiUsers,
  FiActivity,
  FiAlertCircle
} from "react-icons/fi";

const EstimatedWait = () => {
  const navigate = useNavigate();

  const currentToken = "A21";
  const nowServing = "A18";
  const avgServiceTime = "4 mins";
  const peopleAhead = 3;
  const estimatedWait = 12; // minutes

  return (
    <div className="estimated-page">
      {/* ===== TOP BAR ===== */}
      <div className="topbar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
        <h2>Estimated Waiting Time</h2>
      </div>

      {/* ===== MAIN WAIT CARD ===== */}
      <div className="wait-highlight">
        <FiClock className="wait-icon" />
        <div>
          <h1>{estimatedWait} mins</h1>
          <p>Approximate time until your turn</p>
        </div>
      </div>

      {/* ===== STATS GRID ===== */}
      <div className="stats-grid">
        <div className="stat-card">
          <FiUsers className="icon blue" />
          <h4>People Ahead</h4>
          <p>{peopleAhead}</p>
        </div>

        <div className="stat-card">
          <FiActivity className="icon green" />
          <h4>Now Serving</h4>
          <p>{nowServing}</p>
        </div>

        <div className="stat-card">
          <FiClock className="icon orange" />
          <h4>Avg. Service Time</h4>
          <p>{avgServiceTime}</p>
        </div>

        <div className="stat-card highlight">
          <FiAlertCircle className="icon red" />
          <h4>Your Token</h4>
          <p>{currentToken}</p>
        </div>
      </div>

      {/* ===== PROGRESS BAR ===== */}
      <div className="progress-section">
        <h3>Queue Progress</h3>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: "70%" }}></div>
        </div>
        <p>You are getting closer. Please stay nearby the service area.</p>
      </div>

      {/* ===== TIPS / ALERT ===== */}
      <div className="info-box">
        <FiAlertCircle />
        <span>
          Waiting time may vary depending on service complexity and priority
          cases.
        </span>
      </div>
    </div>
  );
};

export default EstimatedWait;
