

import React, { useState } from "react";

const BookAppointmentModal = ({ doctor, onClose, onConfirm }) => {
  const [form, setForm] = useState({
    patientName: "",
    age: "",
    gender: "",
    phone: "",
    date: "",
    time: "",
    reason: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card compact">
        {/* HEADER */}
        <div className="modal-header">
          <div>
            <h3>Book Appointment</h3>
            <p className="doctor-ref">{doctor.name}</p>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <input
              type="text"
              name="patientName"
              placeholder="Patient Full Name"
              value={form.patientName}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="age"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
              required
            />

            <select name="gender" value={form.gender} onChange={handleChange} required>
              <option value="">Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <input
              type="tel"
              name="phone"
              placeholder="Mobile Number"
              value={form.phone}
              onChange={handleChange}
              required
            />

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />

            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
            />
          </div>

          <textarea
            name="reason"
            placeholder="Reason for visit (optional)"
            value={form.reason}
            onChange={handleChange}
            rows="2"
          />

          {/* ACTIONS */}
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="confirm-btn">
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointmentModal;
