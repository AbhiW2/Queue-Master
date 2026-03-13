
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/ServiceModern.scss";

const BankServices = () => {
  const navigate     = useNavigate();
  const { branchId } = useParams();

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
    time        : "",
    message     : "",
  });

  const userId      = localStorage.getItem("userId");
  const token       = localStorage.getItem("token");
  const authHeaders = {
    "Content-Type": "application/json",
    Authorization : `Bearer ${token}`
  };

  useEffect(() => {
    if (!branchId) return;
    setLoading(true);
    axios
      .get(`http://localhost:8080/api/branch-services/${branchId}`)
      .then((res) => { setServices(Array.isArray(res.data) ? res.data : []); setLoading(false); })
      .catch(() => { setServices([]); setLoading(false); });
  }, [branchId]);

  const filteredServices = services.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
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
      time: "", message: "",
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

    const payload = {
      queueType       : "BRANCH_SERVICE",
      branchServiceId : selectedService.id,
      doctorId        : null,
      userId          : parseInt(userId),
      bookingDate     : formData.date
    };

    setBookingLoading(true);
    setErrorMessage("");
    setBookingResult(null);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/tokens/book",
        payload,
        { headers: authHeaders }
      );
      setBookingResult(res.data);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
        err.response?.data?.error   ||
        err.message                 ||
        "Failed to book token. Please try again."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancelToken = async () => {
    if (!bookingResult?.tokenId) return;
    try {
      await axios.delete(
        `http://localhost:8080/api/v1/tokens/${bookingResult.tokenId}/cancel?userId=${userId}`,
        { headers: authHeaders }
      );
      closeModal();
    } catch (err) {
      console.error("Cancel error:", err);
    }
  };

  return (
    <div className="service-page">

      {/* NAVBAR */}
      <div className="service-navbar">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <div className="nav-brand">
          <div className="logo">🏦</div>
          <div>
            <h2>Bank Service Board</h2>
            <p>Branch ID: {branchId}</p>
          </div>
        </div>
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
            <div key={s.id} className="service-row doctor-board">
              <div className="doctor-left">
                <div className="doctor-avatar">{s.name?.charAt(0)}</div>
                <div className="doctor-info-vertical">
                  <div className="doctor-name">{s.name}</div>
                  <div className="doctor-line"><span className="label">Service:</span><span>{s.description}</span></div>
                  <div className="doctor-line"><span className="label">Counter:</span><span>{s.counter}</span></div>
                  <div className="doctor-line"><span className="label">Timing:</span><span>{s.timing}</span></div>
                  <div className="doctor-line"><span className="label">Avg Time:</span><span>{s.avgServiceTimeMinutes ?? "—"} mins</span></div>
                </div>
              </div>
              <div className="doctor-right">
                <span className={`status ${s.status?.toLowerCase()}`}>{s.status}</span>
                <button
                  className="token-btn"
                  disabled={s.status !== "Available"}
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
                  <div className="sd-row"><span>Service</span><strong>{bookingResult.branchServiceName || selectedService.name}</strong></div>
                  <div className="sd-row"><span>Branch</span><strong>{bookingResult.branchName}</strong></div>
                  <div className="sd-row"><span>Date</span><strong>{bookingResult.bookingDate}</strong></div>
                  <div className="sd-row"><span>Time</span><strong>{formData.time}</strong></div>
                  <div className="sd-row"><span>Queue Position</span><strong>#{bookingResult.queuePosition}</strong></div>
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
                  <button className="btn-cancel-token" onClick={handleCancelToken}>Cancel Token</button>
                </div>
              </div>

            ) : (

              /* BOOKING FORM */
              <>
                {/* MODAL HEADER */}
                <div className="modal-header">
                  <div className="mh-left">
                    <div className="mh-icon">🏦</div>
                    <div>
                      <h3>Book a Service Token</h3>
                      <p>{selectedService.name} — Branch {branchId}</p>
                    </div>
                  </div>
                  <button className="close-btn" onClick={closeModal}>✕</button>
                </div>

                {/* SERVICE INFO STRIP */}
                <div className="modal-service-strip">
                  <div className="mss-item">
                    <span>Counter</span>
                    <strong>{selectedService.counter || "—"}</strong>
                  </div>
                  <div className="mss-divider" />
                  <div className="mss-item">
                    <span>Timing</span>
                    <strong>{selectedService.timing || "—"}</strong>
                  </div>
                  <div className="mss-divider" />
                  <div className="mss-item">
                    <span>Avg. Time</span>
                    <strong>{selectedService.avgServiceTimeMinutes ?? "—"} mins</strong>
                  </div>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>

                  {errorMessage && (
                    <div className="error-msg">
                      <span>⚠</span> {errorMessage}
                    </div>
                  )}

                  {/* SECTION LABEL */}
                  <div className="form-section-label">Personal Information</div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Full Name <span className="req">*</span></label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address <span className="req">*</span></label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number <span className="req">*</span></label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        pattern="[0-9]{10}"
                        maxLength={10}
                        required
                      />
                    </div>
                  </div>

                  {/* SECTION LABEL */}
                  <div className="form-section-label" style={{ marginTop: "16px" }}>
                    Appointment Details
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Date <span className="req">*</span></label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Preferred Time <span className="req">*</span></label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: "4px" }}>
                    <label>
                      Message
                      <span className="opt"> — Optional</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Any additional information or special requests..."
                      rows={2}
                    />
                  </div>

                  <div className="modal-actions">
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={closeModal}
                      disabled={bookingLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="confirm-btn"
                      disabled={bookingLoading}
                    >
                      {bookingLoading ? (
                        <><span className="btn-spinner" /> Booking...</>
                      ) : (
                        "Confirm Booking"
                      )}
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

export default BankServices;