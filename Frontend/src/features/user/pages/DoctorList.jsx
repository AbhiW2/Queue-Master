import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/ServiceModern.scss";

const DoctorList = () => {

  const navigate       = useNavigate();
  const { hospitalId } = useParams();

  const [doctors,        setDoctors]        = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [search,         setSearch]         = useState("");
  const [loading,        setLoading]        = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingResult,  setBookingResult]  = useState(null);
  const [errorMessage,   setErrorMessage]   = useState("");
  const [currentUserId,  setCurrentUserId]  = useState(null);

  const [formData, setFormData] = useState({
    fullName    : "",
    email       : "",
    phoneNumber : "",
    date        : new Date().toISOString().split("T")[0],
    shift       : "",
    message     : "",
  });

  const getAuthHeaders = () => {
    const t = localStorage.getItem("token");
    return {
      "Content-Type" : "application/json",
      "Authorization": `Bearer ${t}`
    };
  };

  useEffect(() => {
    const fetchUserId = async () => {
      const email = localStorage.getItem("email");
      const t     = localStorage.getItem("token");
      if (!email || !t) { navigate("/login"); return; }
      try {
        const res  = await fetch(
          `http://localhost:8080/api/users/email/${encodeURIComponent(email)}`,
          { headers: getAuthHeaders() }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setCurrentUserId(data.userId);
      } catch (err) {
        console.error("fetchUserId failed:", err.message);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (!hospitalId) return;
    const fetchDoctors = async () => {
      try {
        const res  = await fetch(
          `http://localhost:8080/api/doctors/${hospitalId}`,
          { headers: { "Content-Type": "application/json" } }
        );
        if (!res.ok) throw new Error("Failed to fetch doctors");
        const data = await res.json();
        setDoctors(data);
      } catch (err) {
        console.error("Error fetching doctors:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [hospitalId]);

  const filteredDoctors = doctors.filter((d) =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  const handleGetToken = (doctor) => {
    if (!currentUserId) { navigate("/login"); return; }
    setSelectedDoctor(doctor);
    setBookingResult(null);
    setErrorMessage("");
    setFormData({
      fullName    : "",
      email       : "",
      phoneNumber : "",
      date        : new Date().toISOString().split("T")[0],
      shift       : "",
      message     : "",
    });
  };

  const closeModal = () => {
    setSelectedDoctor(null);
    setBookingResult(null);
    setErrorMessage("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUserId) { setErrorMessage("Please log in to book a token."); return; }
    if (!formData.shift) { setErrorMessage("Please select a shift (Morning or Afternoon)."); return; }

    const today   = new Date().toISOString().split("T")[0];
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    const maxStr  = maxDate.toISOString().split("T")[0];

    if (formData.date < today) { setErrorMessage("Cannot book for a past date."); return; }
    if (formData.date > maxStr){ setErrorMessage("Advance booking is limited to 7 days."); return; }

    const payload = {
      queueType  : "DOCTOR",
      doctorId   : selectedDoctor.id,
      userId     : currentUserId,
      bookingDate: formData.date,
      shift      : formData.shift
    };

    setBookingLoading(true);
    setErrorMessage("");
    setBookingResult(null);

    try {
      const res = await fetch(
        "http://localhost:8080/api/v1/tokens/book",
        {
          method : "POST",
          headers: getAuthHeaders(),
          body   : JSON.stringify(payload)
        }
      );

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
        `http://localhost:8080/api/v1/tokens/${bookingResult.tokenId}/cancel?userId=${currentUserId}`,
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
          <div className="logo">🏥</div>
          <div>
            <h2>Doctor Board</h2>
            <p>Hospital ID: {hospitalId}</p>
          </div>
        </div>
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search doctor or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* DOCTOR LIST */}
      <div className="service-table">
        {loading ? (
          <h3 style={{ padding: "20px" }}>Loading doctors...</h3>
        ) : filteredDoctors.length === 0 ? (
          <h3 style={{ padding: "20px" }}>No doctors found</h3>
        ) : (
          filteredDoctors.map((d) => (
            <div key={d.id} className="service-row doctor-board">
              <div className="doctor-left">
                <div className="doctor-avatar">{d.name?.charAt(0)}</div>
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
              <div className="doctor-right">
                <span className={`status ${d.status?.toLowerCase()}`}>
                  {d.status}
                </span>
                <button
                  className="token-btn"
                  disabled={d.status !== "Available" || bookingLoading}
                  onClick={() => handleGetToken(d)}
                >
                  Get Token
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* BOOKING MODAL */}
      {selectedDoctor && (
        <div className="modal-overlay">
          <div className="modal-card compact">

            {/* SUCCESS CARD */}
            {bookingResult ? (
              <div className="success-card">
                <div className="success-top">
                  <div className="success-icon">✓</div>
                  <h3>Booking Confirmed!</h3>
                  <p>Your token has been booked successfully</p>
                </div>
                <div className="success-token-row">
                  <span className="stl">Token Number</span>
                  <span className="stv">{bookingResult.displayToken}</span>
                </div>
                <div className="success-details">
                  <div className="sd-row"><span>Name</span><strong>{formData.fullName}</strong></div>
                  <div className="sd-row"><span>Email</span><strong>{formData.email}</strong></div>
                  <div className="sd-row"><span>Phone</span><strong>{formData.phoneNumber}</strong></div>
                  <div className="sd-row"><span>Doctor</span><strong>{bookingResult.doctorName}</strong></div>
                  <div className="sd-row"><span>Specialization</span><strong>{bookingResult.doctorSpecialization}</strong></div>
                  <div className="sd-row"><span>OPD Timing</span><strong>{bookingResult.doctorTiming}</strong></div>
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
                  {formData.message && (
                    <div className="sd-row"><span>Message</span><strong>{formData.message}</strong></div>
                  )}
                </div>
                {bookingResult.estimatedWaitTimeMinutes > 0 && (
                  <div className="success-wait">
                    <span>⏱ Estimated Wait</span>
                    <strong>{bookingResult.estimatedWaitTimeMinutes} mins</strong>
                  </div>
                )}
                <div className="success-actions">
                  <button className="btn-done" onClick={closeModal}>Done</button>
                  <button className="btn-cancel-token" onClick={handleCancelToken}>
                    Cancel Token
                  </button>
                </div>
              </div>

            ) : (

              /* BOOKING FORM */
              <>
                <div className="modal-header">
                  <div className="mh-left">
                    <div className="mh-icon">🏥</div>
                    <div>
                      <h3>Book Doctor Token</h3>
                      <p>{selectedDoctor.name} — {selectedDoctor.specialization}</p>
                    </div>
                  </div>
                  <button className="close-btn" onClick={closeModal}>✕</button>
                </div>

                <div className="modal-service-strip">
                  <div className="mss-item">
                    <span>Experience</span>
                    <strong>{selectedDoctor.experience}</strong>
                  </div>
                  <div className="mss-divider" />
                  <div className="mss-item">
                    <span>OPD Timing</span>
                    <strong>{selectedDoctor.timing}</strong>
                  </div>
                  <div className="mss-divider" />
                  <div className="mss-item">
                    <span>Rating</span>
                    <strong>⭐ {selectedDoctor.rating} / 5</strong>
                  </div>
                  <div className="mss-divider" />
                  <div className="mss-item">
                    <span>Avg. Time</span>
                    <strong>{selectedDoctor.avgConsultationTime ?? "—"} mins</strong>
                  </div>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>

                  {errorMessage && (
                    <div className="error-msg">
                      <span>⚠</span> {errorMessage}
                    </div>
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

                  <div className="form-section-label" style={{ marginTop: "16px" }}>
                    Appointment Details
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Date <span className="req">*</span></label>
                      <input
                        type="date" name="date" value={formData.date}
                        min={new Date().toISOString().split("T")[0]}
                        max={(() => { const d = new Date(); d.setDate(d.getDate() + 7); return d.toISOString().split("T")[0]; })()}
                        onChange={handleChange} required
                      />
                    </div>

                    <div className="form-group">
                      <label>Select Shift <span className="req">*</span></label>
                      <select name="shift" value={formData.shift} onChange={handleChange} required>
                        <option value="">-- Select Shift --</option>
                        <option value="MORNING">🌅 Morning (9:00 AM – 1:00 PM)</option>
                        <option value="AFTERNOON">🌞 Afternoon (2:00 PM – 5:00 PM)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: "4px" }}>
                    <label>Message <span className="opt"> — Optional</span></label>
                    <textarea name="message" value={formData.message} onChange={handleChange}
                      placeholder="Symptoms, medical history or special requests..." rows={2} />
                  </div>

                  <div className="modal-actions">
                    <button type="button" className="cancel-btn" onClick={closeModal} disabled={bookingLoading}>
                      Cancel
                    </button>
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

export default DoctorList;