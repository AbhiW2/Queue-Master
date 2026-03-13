// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import "../styles/ServiceModern.scss";
// import BookAppointmentModal from "./BookAppointmentModal";

// const DoctorList = () => {

//     const navigate       = useNavigate();
//     const { hospitalId } = useParams();

//     const [doctors, setDoctors]               = useState([]);
//     const [selectedDoctor, setSelectedDoctor] = useState(null);
//     const [search, setSearch]                 = useState("");
//     const [loading, setLoading]               = useState(true);
//     const [bookingLoading, setBookingLoading] = useState(false);
//     const [bookingResult, setBookingResult]   = useState(null);
//     const [currentUserId, setCurrentUserId]   = useState(null);

//     // ── Fetch userId from DB on mount ─────────────────────────
//     useEffect(() => {
//         const fetchUserId = async () => {
//             const email = localStorage.getItem("email");
//             const token = localStorage.getItem("token");

//             console.log("📧 Email:", email);
//             console.log("🔑 Token:", token ? "exists" : "MISSING");

//             if (!email || !token) {
//                 console.warn("⚠️ Not logged in — redirecting");
//                 navigate("/login");
//                 return;
//             }

//             try {
//                 const res = await fetch(
//                     `http://localhost:8080/api/users/email/${encodeURIComponent(email)}`,
//                     {
//                         method : "GET",
//                         headers: {
//                             "Content-Type" : "application/json",
//                             "Authorization": `Bearer ${token}`
//                         }
//                     }
//                 );

//                 if (!res.ok) {
//                     const txt = await res.text();
//                     throw new Error(txt || `HTTP ${res.status}`);
//                 }

//                 const data = await res.json();
//                 console.log("✅ User from DB:", data);
//                 setCurrentUserId(data.userId);

//             } catch (err) {
//                 console.error("❌ fetchUserId failed:", err.message);
//             }
//         };

//         fetchUserId();
//     }, []);

//     // ── Fetch Doctors ─────────────────────────────────────────
//     useEffect(() => {
//         if (!hospitalId) return;

//         const fetchDoctors = async () => {
//             try {
//                 const res = await fetch(
//                     `http://localhost:8080/api/doctors/${hospitalId}`,
//                     {
//                         method : "GET",
//                         headers: { "Content-Type": "application/json" }
//                     }
//                 );
//                 if (!res.ok) throw new Error("Failed to fetch doctors");
//                 const data = await res.json();
//                 setDoctors(data);
//             } catch (err) {
//                 console.error("❌ Error fetching doctors:", err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchDoctors();
//     }, [hospitalId]);

//     // ── Search Filter ─────────────────────────────────────────
//     const filteredDoctors = doctors.filter((d) =>
//         d.name?.toLowerCase().includes(search.toLowerCase()) ||
//         d.specialization?.toLowerCase().includes(search.toLowerCase())
//     );

//     // ── Book Doctor Token ─────────────────────────────────────
//     const bookToken = async (doctor, bookingDate) => {
//         if (bookingLoading) return;

//         const token = localStorage.getItem("token");

//         if (!currentUserId) {
//             alert("❌ Could not identify your account. Please log in again.");
//             navigate("/login");
//             return;
//         }

//         if (!token) {
//             alert("❌ Session expired. Please login again.");
//             navigate("/login");
//             return;
//         }

//         // ── Convert bookingDate to "yyyy-MM-dd" string safely ─
//         let selected;
//         if (!bookingDate) {
//             selected = new Date().toISOString().split("T")[0];
//         } else if (typeof bookingDate === "string") {
//             selected = bookingDate;
//         } else if (bookingDate instanceof Date) {
//             selected = bookingDate.toISOString().split("T")[0];
//         } else {
//             selected = new Date().toISOString().split("T")[0];
//         }

//         console.log("📅 bookingDate received:", bookingDate, "→ converted:", selected);

//         // ── Date validation ───────────────────────────────────
//         const today        = new Date().toISOString().split("T")[0];
//         const todayDate    = new Date(today);
//         const selectedDate = new Date(selected);
//         const maxDate      = new Date(today);
//         maxDate.setDate(maxDate.getDate() + 7);

//         if (selectedDate < todayDate) {
//             alert("❌ Cannot book a token for a past date.");
//             return;
//         }
//         if (selectedDate > maxDate) {
//             alert("❌ Advance booking is limited to 7 days.");
//             return;
//         }

//         const payload = {
//             queueType  : "DOCTOR",
//             doctorId   : doctor.id,
//             userId     : currentUserId,
//             bookingDate: selected        // ✅ always "yyyy-MM-dd" string
//         };

//         console.log("📤 Booking Payload:", JSON.stringify(payload));

//         setBookingLoading(true);
//         setSelectedDoctor(doctor);

//         try {
//             const res = await fetch(
//                 "http://localhost:8080/api/v1/tokens/book",
//                 {
//                     method : "POST",
//                     headers: {
//                         "Content-Type" : "application/json",
//                         "Accept"       : "application/json",
//                         "Authorization": `Bearer ${token}`
//                     },
//                     body: JSON.stringify(payload)
//                 }
//             );

//             if (!res.ok) {
//                 const text = await res.text();
//                 console.error("❌ Booking error response:", text);
//                 let errorMessage = `HTTP ${res.status}`;
//                 try {
//                     const json   = JSON.parse(text);
//                     errorMessage = json.message || json.error || errorMessage;
//                 } catch {
//                     errorMessage = text || errorMessage;
//                 }
//                 throw new Error(errorMessage);
//             }

//             const data = await res.json();
//             console.log("✅ Booking Success:", data);
//             setBookingResult(data);
//             setSelectedDoctor(null);

//         } catch (err) {
//             console.error("🚨 Booking Error:", err.message);
//             alert(`❌ Booking Failed!\n\n${err.message}`);
//             setSelectedDoctor(null);
//         } finally {
//             setBookingLoading(false);
//         }
//     };

//     // ── Cancel Token ──────────────────────────────────────────
//     const cancelToken = async (tokenId) => {
//         if (!currentUserId || !tokenId) return;

//         const token = localStorage.getItem("token");

//         try {
//             const res = await fetch(
//                 `http://localhost:8080/api/v1/tokens/${tokenId}/cancel?userId=${currentUserId}`,
//                 {
//                     method : "DELETE",
//                     headers: {
//                         "Content-Type" : "application/json",
//                         "Authorization": `Bearer ${token}`
//                     }
//                 }
//             );

//             if (!res.ok) {
//                 const text = await res.text();
//                 let json;
//                 try   { json = JSON.parse(text); }
//                 catch { json = null; }
//                 throw new Error(json?.message || text || "Cancel failed");
//             }

//             const data = await res.json();
//             alert(`✅ ${data.message}`);
//             setBookingResult(null);

//         } catch (err) {
//             alert(`❌ Cancel Failed!\n${err.message}`);
//         }
//     };

//     return (
//         <div className="service-page">

//             {/* NAVBAR */}
//             <div className="service-navbar">
//                 <button className="back-btn" onClick={() => navigate(-1)}>
//                     ← Back
//                 </button>
//                 <div className="nav-brand">
//                     <div className="logo">🏥</div>
//                     <div>
//                         <h2>Doctor Board</h2>
//                         <p>Hospital ID: {hospitalId}</p>
//                     </div>
//                 </div>
//                 <div className="navbar-search">
//                     <input
//                         type="text"
//                         placeholder="Search doctor or specialization..."
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                     />
//                 </div>
//             </div>

//             {/* ── BOOKING SUCCESS CARD ── */}
//             {bookingResult && (
//     <div className="booking-success-overlay">
//         <div className="booking-success-card">

//             {/* GREEN HEADER */}
//             <div className="card-header">
//                 <div className="check-circle">✅</div>
//                 <h3>Booking Confirmed!</h3>
//                 <p>Your token has been successfully booked</p>
//             </div>

//             {/* TOKEN NUMBER */}
//             <div className="token-strip">
//                 <span className="token-label">Your Token</span>
//                 <span className="token-number">{bookingResult.displayToken}</span>
//             </div>

//             {/* INFO ROWS */}
//             <div className="info-list">
//                 <div className="info-row">
//                     <span className="info-key">Doctor</span>
//                     <span className="info-val">{bookingResult.doctorName}</span>
//                 </div>
//                 <div className="info-row">
//                     <span className="info-key">Specialization</span>
//                     <span className="info-val">{bookingResult.doctorSpecialization}</span>
//                 </div>
//                 <div className="info-row">
//                     <span className="info-key">OPD Timing</span>
//                     <span className="info-val">{bookingResult.doctorTiming}</span>
//                 </div>
//                 <div className="info-row">
//                     <span className="info-key">Branch</span>
//                     <span className="info-val">{bookingResult.branchName}</span>
//                 </div>
//                 <div className="info-row">
//                     <span className="info-key">Date</span>
//                     <span className="info-val">{bookingResult.bookingDate}</span>
//                 </div>
//                 <div className="info-row">
//                     <span className="info-key">Queue Position</span>
//                     <span className="info-val">#{bookingResult.queuePosition ?? 1} in line</span>
//                 </div>
//             </div>

//             {/* WAIT TIME BANNER */}
//             <div className="wait-banner">
//                 <span className="wait-left">⏱ Estimated Wait Time</span>
//                 <span className="wait-time">
//                     {bookingResult.estimatedWaitTimeMinutes ?? 0} min
//                 </span>
//             </div>

//             {/* ACTIONS */}
//             <div className="card-actions">
//                 <button
//                     className="btn-close"
//                     onClick={() => setBookingResult(null)}
//                 >
//                     Done
//                 </button>
//                 <button
//                     className="btn-cancel"
//                     onClick={() => cancelToken(bookingResult.tokenId)}
//                 >
//                     Cancel Token
//                 </button>
//             </div>

//         </div>
//     </div>
// )}
//             {/* DOCTOR LIST */}
//             <div className="service-table">
//                 {loading ? (
//                     <h3 style={{ padding: "20px" }}>Loading doctors...</h3>
//                 ) : filteredDoctors.length === 0 ? (
//                     <h3 style={{ padding: "20px" }}>No doctors found</h3>
//                 ) : (
//                     filteredDoctors.map((d) => (
//                         <div key={d.id} className="service-row doctor-board">

//                             {/* LEFT */}
//                             <div className="doctor-left">
//                                 <div className="doctor-avatar">
//                                     {d.name?.charAt(0)}
//                                 </div>
//                                 <div className="doctor-info-vertical">
//                                     <div className="doctor-name">{d.name}</div>
//                                     <div className="doctor-line">
//                                         <span className="label">Specialization:</span>
//                                         <span>{d.specialization}</span>
//                                     </div>
//                                     <div className="doctor-line">
//                                         <span className="label">Experience:</span>
//                                         <span>{d.experience}</span>
//                                     </div>
//                                     <div className="doctor-line">
//                                         <span className="label">OPD Timing:</span>
//                                         <span>{d.timing}</span>
//                                     </div>
//                                     <div className="doctor-line">
//                                         <span className="label">Rating:</span>
//                                         <span>⭐ {d.rating} / 5</span>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* RIGHT */}
//                             <div className="doctor-right">
//                                 <span className={`status ${d.status?.toLowerCase()}`}>
//                                     {d.status}
//                                 </span>
//                                 <button
//                                     className="token-btn"
//                                     disabled={d.status !== "Available" || bookingLoading}
//                                     onClick={() => setSelectedDoctor(d)}
//                                 >
//                                     {bookingLoading && selectedDoctor?.id === d.id
//                                         ? "Booking..." : "Get Token"}
//                                 </button>
//                             </div>

//                         </div>
//                     ))
//                 )}
//             </div>

//             {/* BOOK APPOINTMENT MODAL */}
//             {selectedDoctor && !bookingLoading && (
//                 <BookAppointmentModal
//                     doctor={selectedDoctor}
//                     onClose={() => setSelectedDoctor(null)}
//                     onConfirm={(bookingDate) => bookToken(selectedDoctor, bookingDate)}
//                 />
//             )}

//         </div>
//     );
// };

// export default DoctorList;







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
    time        : "",
    message     : "",
  });

  const token       = localStorage.getItem("token");
  const authHeaders = {
    "Content-Type" : "application/json",
    "Authorization": `Bearer ${token}`
  };

  // ── Fetch userId from DB ───────────────────────────────
  useEffect(() => {
    const fetchUserId = async () => {
      const email = localStorage.getItem("email");
      if (!email || !token) { navigate("/login"); return; }
      try {
        const res  = await fetch(
          `http://localhost:8080/api/users/email/${encodeURIComponent(email)}`,
          { headers: authHeaders }
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

  // ── Fetch Doctors ──────────────────────────────────────
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

  // ── Open modal ─────────────────────────────────────────
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
      time        : "",
      message     : "",
    });
  };

  // ── Close modal ────────────────────────────────────────
  const closeModal = () => {
    setSelectedDoctor(null);
    setBookingResult(null);
    setErrorMessage("");
  };

  // ── Handle input change ────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ── Book token ─────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUserId) { setErrorMessage("Please log in to book a token."); return; }

    // ── Date validation ───────────────────────────────────
    const today      = new Date().toISOString().split("T")[0];
    const maxDate    = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    const maxStr     = maxDate.toISOString().split("T")[0];

    if (formData.date < today) { setErrorMessage("Cannot book for a past date."); return; }
    if (formData.date > maxStr){ setErrorMessage("Advance booking is limited to 7 days."); return; }

    const payload = {
      queueType  : "DOCTOR",
      doctorId   : selectedDoctor.id,
      userId     : currentUserId,
      bookingDate: formData.date   // "yyyy-MM-dd" ✅
    };

    console.log("Booking payload:", payload);

    setBookingLoading(true);
    setErrorMessage("");
    setBookingResult(null);

    try {
      const res = await fetch(
        "http://localhost:8080/api/v1/tokens/book",
        {
          method : "POST",
          headers: authHeaders,
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
      console.log("Booking success:", data);
      setBookingResult(data);
    } catch (err) {
      console.error("Booking error:", err.message);
      setErrorMessage(err.message || "Failed to book token. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  // ── Cancel token ───────────────────────────────────────
  const handleCancelToken = async () => {
    if (!bookingResult?.tokenId) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/tokens/${bookingResult.tokenId}/cancel?userId=${currentUserId}`,
        { method: "DELETE", headers: authHeaders }
      );
      if (!res.ok) throw new Error("Cancel failed");
      closeModal();
    } catch (err) {
      console.error("Cancel error:", err.message);
    }
  };

  return (
    <div className="service-page">

      {/* ── NAVBAR ─────────────────────────────────────── */}
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

      {/* ── DOCTOR LIST ────────────────────────────────── */}
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

      {/* ── BOOKING MODAL ──────────────────────────────── */}
      {selectedDoctor && (
        <div className="modal-overlay">
          <div className="modal-card compact">

            {/* ── SUCCESS CARD ─────────────────────────── */}
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
                  <button className="btn-cancel-token" onClick={handleCancelToken}>
                    Cancel Token
                  </button>
                </div>
              </div>

            ) : (

              /* ── BOOKING FORM ─────────────────────── */
              <>
                {/* MODAL HEADER */}
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

                {/* DOCTOR INFO STRIP */}
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

                  {/* SECTION — Personal */}
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

                  {/* SECTION — Appointment */}
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
                        max={(() => {
                          const d = new Date();
                          d.setDate(d.getDate() + 7);
                          return d.toISOString().split("T")[0];
                        })()}
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
                      placeholder="Symptoms, medical history or special requests..."
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

export default DoctorList;