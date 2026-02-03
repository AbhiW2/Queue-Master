
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ServiceModern.scss";

const Hospitals = () => {
  const navigate = useNavigate();

  const hospitals = [
    { name: "Apollo Hospital", status: "Open", time: "24×7 Emergency" },
    { name: "City Care Hospital", status: "Open", time: "9:00 AM – 8:00 PM" },
    { name: "LifeLine Multispeciality", status: "Limited", time: "10:00 AM – 6:00 PM" },
    { name: "Green Cross Clinic", status: "Busy", time: "11:00 AM – 5:00 PM" },
    { name: "Government Civil Hospital", status: "Open", time: "24×7" },
  ];

  return (
    <div className="service-page">
      <div className="service-navbar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="nav-brand">
          <div className="logo">🏥</div>
          <div>
            <h2>Hospitals</h2>
            <p>Select a hospital to continue</p>
          </div>
        </div>
      </div>

      <div className="service-table">
        {hospitals.map((h) => (
          <div
            key={h.name}
            className="service-row"
            onClick={() =>
              navigate(`/hospitals/${encodeURIComponent(h.name)}/doctors`)
            }
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

export default Hospitals;
