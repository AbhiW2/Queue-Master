import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/ServiceModern.scss";

const BankServices = () => {
  const navigate = useNavigate();
  const { bankName } = useParams();
  const [selectedService, setSelectedService] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    idType: "",
    idNumber: "",
    date: "",
    time: "",
    notes: "",
    agree: false,
  });

  const services = [
    {
      id: 1,
      name: "Account Opening",
      description: "Open savings or current account",
      counter: "Counter 1",
      timing: "10:00 AM – 3:00 PM",
      status: "Available",
    },
    {
      id: 2,
      name: "Cash Deposit / Withdrawal",
      description: "Cash transactions and cheque deposits",
      counter: "Counter 3",
      timing: "10:00 AM – 4:00 PM",
      status: "Busy",
    },
    {
      id: 3,
      name: "Loan Enquiry",
      description: "Home, car, and personal loan guidance",
      counter: "Loan Desk",
      timing: "11:00 AM – 2:00 PM",
      status: "Available",
    },
    {
      id: 4,
      name: "Card Services",
      description: "ATM/Debit/Credit card issues",
      counter: "Help Desk",
      timing: "10:30 AM – 3:30 PM",
      status: "Limited",
    },
  ];

  const handleGetToken = (service) => {
    setSelectedService(service);
  };

  const closeModal = () => {
    setSelectedService(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.agree) {
      alert("Please accept terms before booking.");
      return;
    }

    console.log("BOOKING DATA:", {
      service: selectedService.name,
      bank: decodeURIComponent(bankName),
      ...formData,
    });

    alert(`Token booked successfully for ${selectedService.name}`);
    closeModal();
  };

  return (
    <div className="service-page">
      {/* NAVBAR */}
      <div className="service-navbar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="nav-brand">
          <div className="logo">🏦</div>
          <div>
            <h2>Bank Service Board</h2>
            <p>{decodeURIComponent(bankName)}</p>
          </div>
        </div>
      </div>

      {/* SERVICE LIST */}
      <div className="service-table">
        {services.map((s) => (
          <div key={s.id} className="service-row doctor-board">
            <div className="doctor-left">
              <div className="doctor-avatar">{s.name.charAt(0)}</div>
              <div className="doctor-info-vertical">
                <div className="doctor-name">{s.name}</div>
                <div className="doctor-line">
                  <span className="label">Service:</span>
                  <span>{s.description}</span>
                </div>
                <div className="doctor-line">
                  <span className="label">Counter:</span>
                  <span>{s.counter}</span>
                </div>
                <div className="doctor-line">
                  <span className="label">Service Time:</span>
                  <span>{s.timing}</span>
                </div>
              </div>
            </div>

            <div className="doctor-right">
              <span className={`status ${s.status.toLowerCase()}`}>
                {s.status}
              </span>

              <button
                className="token-btn"
                disabled={s.status !== "Available"}
                onClick={() => handleGetToken(s)}
              >
                Get Token
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* BOOKING MODAL */}
      {selectedService && (
        <div className="modal-overlay">
          <div className="modal-card compact">
            <div className="modal-header">
              <div>
                <h3>Book Bank Service Token</h3>
                <div className="doctor-ref">
                  {selectedService.name} — {decodeURIComponent(bankName)}
                </div>
              </div>
              <button className="close-btn" onClick={closeModal}>✕</button>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Mobile Number *</label>
                  <input type="tel" name="mobile" pattern="[0-9]{10}" value={formData.mobile} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>ID Proof Type *</label>
                  <select name="idType" value={formData.idType} onChange={handleChange} required>
                    <option value="">Select ID</option>
                    <option>Aadhaar Card</option>
                    <option>PAN Card</option>
                    <option>Driving License</option>
                    <option>Passport</option>
                    <option>Voter ID</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>ID Number *</label>
                  <input type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Appointment Date *</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Preferred Time Slot *</label>
                  <input type="time" name="time" value={formData.time} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group full">
                <label>Purpose / Notes</label>
                <textarea rows="2" name="notes" value={formData.notes} onChange={handleChange} />
              </div>

              <div className="checkbox-group">
                <input type="checkbox" name="agree" checked={formData.agree} onChange={handleChange} id="agree" />
                <label htmlFor="agree">I confirm the information provided is correct</label>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
                <button type="submit" className="confirm-btn">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankServices;
