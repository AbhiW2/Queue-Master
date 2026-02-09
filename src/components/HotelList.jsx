import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ServiceModern.scss";

const Hotel = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const hotels = [
    { 
      name: "Taj Hotel", 
      status: "Open", 
      time: "Check-in from 12:00 PM",
      location: "Colaba, Mumbai"
    },
    { 
      name: "ITC Grand Chola", 
      status: "Open", 
      time: "24×7 Front Desk",
      location: "Guindy, Chennai"
    },
    { 
      name: "The Oberoi", 
      status: "Limited", 
      time: "Check-in till 10:00 PM",
      location: "Nariman Point, Mumbai"
    },
    { 
      name: "Hyatt Regency", 
      status: "Busy", 
      time: "High Demand Today",
      location: "Viman Nagar, Pune"
    },
    { 
      name: "Radisson Blu", 
      status: "Open", 
      time: "24×7 Service",
      location: "Whitefield, Bangalore"
    },
  ];

  const filteredHotels = hotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(search.toLowerCase()) ||
      hotel.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="service-page">
      {/* NAVBAR */}
      <div className="service-navbar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="nav-brand">
          <div className="logo">🏨</div>
          <div>
            <h2>Hotels</h2>
            <p>Select a hotel to continue</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search hotel or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* LIST */}
      <div className="service-table">
        {filteredHotels.map((h) => (
          <div
            key={h.name}
            className="service-row"
            onClick={() => console.log("Selected hotel:", h.name)}
            tabIndex="0"
          >
            <div>
              <div className="service-name">{h.name}</div>
              <div className="service-meta">⏱ {h.time}</div>
              <div className="service-location">📍 {h.location}</div>
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
