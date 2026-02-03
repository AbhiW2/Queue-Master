

import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/ServiceModern.scss";
import BookAppointmentModal from "./BookAppointmentModal";

const DoctorList = () => {
  const navigate = useNavigate();
  const { hospitalId } = useParams();
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const doctors = [
    {
      id: 1,
      name: "Dr. Ananya Sharma",
      specialization: "Cardiologist",
      experience: "12 Years",
      timing: "10:00 AM – 2:00 PM",
      rating: 4.8,
      status: "Available",
    },
    {
      id: 2,
      name: "Dr. Rahul Verma",
      specialization: "Orthopedic Surgeon",
      experience: "9 Years",
      timing: "1:00 PM – 6:00 PM",
      rating: 4.6,
      status: "Busy",
    },
    {
      id: 3,
      name: "Dr. Meera Iyer",
      specialization: "Dermatologist",
      experience: "7 Years",
      timing: "11:00 AM – 4:00 PM",
      rating: 4.7,
      status: "Available",
    },
    {
      id: 4,
      name: "Dr. Suresh Patil",
      specialization: "General Physician",
      experience: "15 Years",
      timing: "9:00 AM – 1:00 PM",
      rating: 4.9,
      status: "Available",
    },
  ];

  return (
    <div className="service-page">
      {/* NAVBAR */}
      <div className="service-navbar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="nav-brand">
          <div className="logo">🏥</div>
          <div>
            <h2>Doctor Board</h2>
            <p>{decodeURIComponent(hospitalId)}</p>
          </div>
        </div>
      </div>

      {/* DOCTOR BOARD */}
      <div className="service-table">
        {doctors.map((d) => (
          <div key={d.id} className="service-row doctor-board">
            {/* LEFT SECTION */}
            <div className="doctor-left">
              <div className="doctor-avatar">{d.name.charAt(0)}</div>

              <div className="doctor-info-vertical">
                <div className="doctor-name">{d.name}</div>
                <div className="doctor-line">
                  <span className="label">Specialization:</span>
                  <span>{d.specialization}</span>
                </div>
                <div className="doctor-line">
                  <span className="label">Experience:</span>
                  <span>{d.experience}</span>
                </div>
                <div className="doctor-line">
                  <span className="label">OPD Timing:</span>
                  <span>{d.timing}</span>
                </div>
                <div className="doctor-line">
                  <span className="label">Rating:</span>
                  <span>⭐ {d.rating} / 5</span>
                </div>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="doctor-right">
              <span className={`status ${d.status.toLowerCase()}`}>
                {d.status}
              </span>

              <button
                className="token-btn"
                disabled={d.status !== "Available"}
                onClick={() => setSelectedDoctor(d)}
              >
                Get Token
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* BOOK APPOINTMENT MODAL */}
      {selectedDoctor && (
        <BookAppointmentModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          onConfirm={() => {
            alert(`Token booked successfully with ${selectedDoctor.name}`);
            setSelectedDoctor(null);
          }}
        />
      )}
    </div>
  );
};

export default DoctorList;
