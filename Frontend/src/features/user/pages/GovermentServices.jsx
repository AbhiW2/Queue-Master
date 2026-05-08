

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/ServiceModern.scss";

const GovernmentServices = () => {
  const navigate = useNavigate();
  const { officeId, officeName } = useParams();

  const [services,        setServices]        = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [search,          setSearch]          = useState("");
  const [loading,         setLoading]         = useState(true);
  const [bookingLoading,  setBookingLoading]  = useState(false);
  const [bookingResult,   setBookingResult]   = useState(null);
  const [errorMessage,    setErrorMessage]    = useState("");

  const [formData, setFormData] = useState({
    fullName    : "",
    email       : "",
    phoneNumber : "",
    date        : new Date().toISOString().split("T")[0],
    shift       : "",    // "MORNING" or "AFTERNOON"
    message     : "",
  });

  const userId = localStorage.getItem("userId");

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization : `Bearer ${localStorage.getItem("token")}`
  });

  useEffect(() => {
    if (!officeId) return;
    setLoading(true);
    fetch(`http://localhost:8080/api/branch-services/${officeId}`)
      .then((res) => res.json())
      .then((data) => { setServices(Array.isArray(data) ? data : []); setLoading(false); })
      .catch((err) => { console.error("Error fetching services:", err); setLoading(false); });
  }, [officeId]);

  const filteredServices = services.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase())        ||
      s.description?.toLowerCase().includes(search.toLowerCase()) ||
      s.counter?.toLowerCase().includes(search.toLowerCase())
  );

  const handleGetToken = (service) => {
    if (!userId) { navigate("/login"); return; }
    setSelectedService(service);
    setBookingResult(null);
    setErrorMessage("");
    setFormData({
      fullName: "", email: "", phoneNumber: "",
      date: new Date().toISOString().split("T")[0],
      shift: "", message: "",
    });
  };

  const closeModal = () => {
    setSelectedService(null);
    setBookingResult(null);
    setErrorMessage("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) { setErrorMessage("Please log in to book a token."); return; }
    if (!formData.shift) { setErrorMessage("Please select a shift (Morning or Afternoon)."); return; }

    const today   = new Date().toISOString().split("T")[0];
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    const maxStr  = maxDate.toISOString().split("T")[0];

    if (formData.date < today) { setErrorMessage("Cannot book a token for a past date."); return; }
    if (formData.date > maxStr) { setErrorMessage("Advance booking is limited to 7 days from today."); return; }

    const payload = {
      queueType       : "BRANCH_SERVICE",
      branchServiceId : selectedService.id,
      doctorId        : null,
      userId          : parseInt(userId),
      bookingDate     : formData.date,
      shift           : formData.shift   // "MORNING" or "AFTERNOON"
    };

    setBookingLoading(true);
    setErrorMessage("");
    setBookingResult(null);

    try {
      const res = await fetch("http://localhost:8080/api/v1/tokens/book", {
        method : "POST",
        headers: getAuthHeaders(),
        body   : JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        let msg = `HTTP ${res.status}`;
        try { const j = JSON.parse(text); msg = j.message || j.error || msg; } catch {}
        throw new Error(msg);
      }
      const data = await res.json();
      setBookingResult(data);
    } catch (err) {
      setErrorMessage(err.message || "Failed to book token. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancelToken = async () => {
    if (!bookingResult?.tokenId) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/tokens/${bookingResult.tokenId}/cancel?userId=${userId}`,
        { method: "DELETE", headers: getAuthHeaders() }
      );
      if (!res.ok) throw new Error("Cancel failed");
      closeModal();
    } catch (err) {
      console.error("Cancel error:", err.message);
    }
  };

  const shiftLabel = (shift) =>
    shift === "MORNING" ? "Morning (9:00 AM – 1:00 PM)" : "Afternoon (2:00 PM – 5:00 PM)";

  return (
    <div className="service-page">

      {/* NAVBAR */}
      <div className="service-navbar">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <div className="nav-brand">
          <div className="logo">🏛️</div>
          <div>
            <h2>{officeName || "Government Services"}</h2>
            <p>Office ID: {officeId}</p>
          </div>
        </div>
        <div className="navbar-search">
          <input type="text" placeholder="Search service..." value={search}
            onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {/* SERVICE LIST */}
      <div className="service-table">
        {loading ? (
          <h3 style={{ padding: "20px" }}>Loading services...</h3>
        ) : filteredServices.length === 0 ? (
          <h3 style={{ padding: "20px" }}>No services found</h3>
        ) : (
          filteredServices.map((s) => (
            <div key={s.id} className="service-row">
              <div className="service-info">
                <div className="service-name">{s.name}</div>
                {s.description && <div className="service-desc">{s.description}</div>}
                <div className="service-meta">
                  {s.counter && <span>🪧 {s.counter}</span>}
                  {s.timing  && <span>🕐 {s.timing}</span>}
                </div>
              </div>
              <div className="service-actions">
                <span className={`status ${s.status?.toLowerCase()}`}>{s.status}</span>
                <button
                  className="token-btn"
                  disabled={s.status !== "Available" || bookingLoading}
                  onClick={() => handleGetToken(s)}
                >
                  Get Token
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* BOOKING MODAL */}
      {selectedService && (
        <div className="modal-overlay">
          <div className="modal-card compact">

            {bookingResult ? (
              <div className="success-card">
                <div className="success-top">
                  <div className="success-icon">✓</div>
                  <h3>Token Booked!</h3>
                  <p>Your queue token has been confirmed</p>
                </div>
                <div className="success-token-row">
                  <span className="stl">Token Number</span>
                  <span className="stv">{bookingResult.displayToken}</span>
                </div>
                <div className="success-details">
                  <div className="sd-row"><span>Name</span><strong>{formData.fullName}</strong></div>
                  <div className="sd-row"><span>Service</span><strong>{bookingResult.branchServiceName}</strong></div>
                  <div className="sd-row"><span>Branch</span><strong>{bookingResult.branchName}</strong></div>
                  <div className="sd-row"><span>Date</span><strong>{bookingResult.bookingDate}</strong></div>
                  <div className="sd-row">
                    <span>Shift</span>
                    <strong>{bookingResult.shiftLabel || shiftLabel(formData.shift)}</strong>
                  </div>
                  <div className="sd-row">
                    <span>Est. Time Slot</span>
                    <strong>
                      {bookingResult.scheduledTime
                        ? new Date("1970-01-01T" + bookingResult.scheduledTime)
                            .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : "—"}
                    </strong>
                  </div>
                  <div className="sd-row"><span>Queue Position</span><strong>#{(bookingResult.queuePosition ?? 0) + 1}</strong></div>
                </div>
                {bookingResult.estimatedWaitTimeMinutes > 0 && (
                  <div className="success-wait">
                    <span>⏱ Estimated Wait</span>
                    <strong>{bookingResult.estimatedWaitTimeMinutes} mins</strong>
                  </div>
                )}
                <div className="success-actions">
                  <button className="btn-done" onClick={closeModal}>Done</button>
                  <button className="btn-cancel-token" onClick={handleCancelToken}>Cancel Token</button>
                </div>
              </div>

            ) : (
              <>
                <div className="modal-header">
                  <div className="mh-left">
                    <div className="mh-icon">🏛️</div>
                    <div>
                      <h3>Book Service Token</h3>
                      <p>{selectedService.name}</p>
                    </div>
                  </div>
                  <button className="close-btn" onClick={closeModal}>✕</button>
                </div>

                <div className="modal-service-strip">
                  {selectedService.counter && (
                    <div className="mss-item"><span>Counter</span><strong>{selectedService.counter}</strong></div>
                  )}
                  <div className="mss-divider" />
                  {selectedService.timing && (
                    <div className="mss-item"><span>Timing</span><strong>{selectedService.timing}</strong></div>
                  )}
                  <div className="mss-divider" />
                  <div className="mss-item">
                    <span>Avg. Time</span>
                    <strong>{selectedService.avgServiceTimeMinutes ?? "—"} mins</strong>
                  </div>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>

                  {errorMessage && (
                    <div className="error-msg"><span>⚠</span> {errorMessage}</div>
                  )}

                  <div className="form-section-label">Personal Information</div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Full Name <span className="req">*</span></label>
                      <input type="text" name="fullName" value={formData.fullName}
                        onChange={handleChange} placeholder="John Doe" required />
                    </div>
                    <div className="form-group">
                      <label>Email Address <span className="req">*</span></label>
                      <input type="email" name="email" value={formData.email}
                        onChange={handleChange} placeholder="you@example.com" required />
                    </div>
                    <div className="form-group">
                      <label>Phone Number <span className="req">*</span></label>
                      <input type="tel" name="phoneNumber" value={formData.phoneNumber}
                        onChange={handleChange} placeholder="10-digit mobile number"
                        pattern="[0-9]{10}" maxLength={10} required />
                    </div>
                  </div>

                  <div className="form-section-label" style={{ marginTop: "16px" }}>Booking Details</div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Date <span className="req">*</span></label>
                      <input type="date" name="date" value={formData.date}
                        min={new Date().toISOString().split("T")[0]}
                        max={(() => { const d = new Date(); d.setDate(d.getDate() + 7); return d.toISOString().split("T")[0]; })()}
                        onChange={handleChange} required />
                    </div>

                    <div className="form-group shift-selector-group">
                      <label>Select Shift <span className="req">*</span></label>
                      <div className="shift-options">
                        <label className={`shift-option ${formData.shift === "MORNING" ? "selected" : ""}`}>
                          <input type="radio" name="shift" value="MORNING"
                            checked={formData.shift === "MORNING"}
                            onChange={handleChange} required />
                          <span className="shift-icon">🌅</span>
                          <div className="shift-info">
                            <strong>Morning</strong>
                            <span>9:00 AM – 1:00 PM</span>
                            <small>Max 20 tokens</small>
                          </div>
                        </label>
                        <label className={`shift-option ${formData.shift === "AFTERNOON" ? "selected" : ""}`}>
                          <input type="radio" name="shift" value="AFTERNOON"
                            checked={formData.shift === "AFTERNOON"}
                            onChange={handleChange} />
                          <span className="shift-icon">🌞</span>
                          <div className="shift-info">
                            <strong>Afternoon</strong>
                            <span>2:00 PM – 5:00 PM</span>
                            <small>Max 15 tokens</small>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: "4px" }}>
                    <label>Message <span className="opt"> — Optional</span></label>
                    <textarea name="message" value={formData.message} onChange={handleChange}
                      placeholder="Any additional information or special requests..." rows={2} />
                  </div>

                  <div className="modal-actions">
                    <button type="button" className="cancel-btn" onClick={closeModal} disabled={bookingLoading}>Cancel</button>
                    <button type="submit" className="confirm-btn" disabled={bookingLoading}>
                      {bookingLoading ? <><span className="btn-spinner" /> Booking...</> : "Confirm Booking"}
                    </button>
                  </div>

                </form>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default GovernmentServices;