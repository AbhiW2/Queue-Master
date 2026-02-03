

import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/QueueStatus.scss";
import { FiClock, FiUsers, FiCheckCircle, FiArrowLeft } from "react-icons/fi";

const QueueStatus = () => {
  const navigate = useNavigate();

  const currentToken = "A21";
  const nowServing = "A18";
  const peopleAhead = 3;
  const estimatedWait = "12 mins";

  const queueList = ["A18", "A19", "A20", "A21", "A22", "A23"];

  return (
    <div className="queue-status-page">

      {/* ===== TOP NAVBAR ===== */}
      <div className="qs-navbar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>

        <h2>Queue Status</h2>

        <div className="live-indicator">
          <span className="dot"></span> Live
        </div>
      </div>

      <h1 className="page-title">Live Queue Status</h1>

      {/* ===== STATUS CARDS ===== */}
      <div className="status-grid">
        <div className="status-card highlight">
          <h3>Your Token</h3>
          <div className="big-token">{currentToken}</div>
          <span className="badge waiting">Waiting</span>
        </div>

        <div className="status-card">
          <FiCheckCircle className="card-icon green" />
          <div>
            <h4>Now Serving</h4>
            <p className="value">{nowServing}</p>
          </div>
        </div>

        <div className="status-card">
          <FiUsers className="card-icon blue" />
          <div>
            <h4>People Ahead</h4>
            <p className="value">{peopleAhead}</p>
          </div>
        </div>

        <div className="status-card">
          <FiClock className="card-icon orange" />
          <div>
            <h4>Estimated Wait</h4>
            <p className="value">{estimatedWait}</p>
          </div>
        </div>
      </div>

      {/* ===== PROGRESS SECTION ===== */}
      <div className="progress-section">
        <div className="progress-header">
          <h3>Queue Progress</h3>
          <span>75% Completed</span>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: "75%" }}></div>
        </div>

        <p className="progress-text">
          Almost your turn. Please stay nearby and watch the display.
        </p>
      </div>

      {/* ===== LIVE QUEUE LIST ===== */}
      <div className="queue-list-section">
        <div className="list-header">
          <h3>Live Queue Line</h3>
          <span className="updated">Updated just now</span>
        </div>

        <div className="queue-list">
          {queueList.map((token, index) => (
            <div
              key={index}
              className={`queue-item ${
                token === currentToken ? "active" : ""
              }`}
            >
              {token}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QueueStatus;
