import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ServiceModern.scss";

const Hotels = () => {
  const navigate = useNavigate();

  const [search,  setSearch]  = useState("");
  const [hotels,  setHotels]  = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryId = 4; // HOTEL category

  useEffect(() => {
    fetch(`http://localhost:8080/api/branches/${categoryId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch hotels");
        return res.json();
      })
      .then((data) => { setHotels(data); setLoading(false); })
      .catch((err) => { console.error("Error fetching hotels:", err); setLoading(false); });
  }, []);

  const filteredHotels = hotels.filter(
    (h) =>
      h.name?.toLowerCase().includes(search.toLowerCase()) ||
      h.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="service-page">

      {/* NAVBAR */}
      <div className="service-navbar">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <div className="nav-brand">
          <div className="logo">🏨</div>
          <div>
            <h2>Hotels</h2>
            <p>Select a hotel to continue</p>
          </div>
        </div>
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search hotel or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* HOTEL LIST */}
      <div className="service-table">
        {loading ? (
          <p style={{ padding: "20px" }}>Loading hotels...</p>
        ) : filteredHotels.length === 0 ? (
          <p style={{ padding: "20px" }}>No hotels found.</p>
        ) : (
          filteredHotels.map((hotel) => (
            <div
              key={hotel.id}
              className="service-row"
              onClick={() => navigate(`/hotels/${hotel.id}/services`)}  // ✅ fixed
            >
              <div>
                <div className="service-name">{hotel.name}</div>
                <div className="service-meta">⏱ {hotel.time}</div>
                <div className="service-meta">📍 {hotel.location}</div>
              </div>
              <div className={`status ${hotel.status?.toLowerCase()}`}>
                {hotel.status}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default Hotels;