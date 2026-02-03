import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ServiceModern.scss";

const Hotel = () => {
  const navigate = useNavigate();

  const hotels = [
    { name: "Taj Hotel", status: "Open", time: "Check-in from 12:00 PM" },
    { name: "ITC Grand Chola", status: "Open", time: "24×7 Front Desk" },
    { name: "The Oberoi", status: "Limited", time: "Check-in till 10:00 PM" },
    { name: "Hyatt Regency", status: "Busy", time: "High Demand Today" },
    { name: "Radisson Blu", status: "Open", time: "24×7 Service" },
  ];

  return (
    <div className="service-page">
      <div className="service-navbar">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

        <div className="nav-brand">
          <div className="logo">🏨</div>
          <div>
            <h2>Hotels</h2>
            <p>Select a hotel to continue</p>
          </div>
        </div>
      </div>

      <div className="service-table">
        {hotels.map((h) => (
          <div
            key={h.name}
            className="service-row"
            onClick={() => console.log("Selected hotel:", h.name)}
            tabIndex="0"
          >
            <div>
              <div className="service-name">{h.name}</div>
              <div className="service-meta">⏱ {h.time}</div>
            </div>

            <div className={`status ${h.status.toLowerCase()}`}>
              {h.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hotel;
