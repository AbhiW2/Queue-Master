import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ServiceModern.scss";

const Banks = () => {
  const navigate = useNavigate();

  const banks = [
    { name: "State Bank of India", status: "Open", time: "10:00 AM – 4:00 PM" },
    { name: "HDFC Bank", status: "Open", time: "9:30 AM – 3:30 PM" },
    { name: "ICICI Bank", status: "Limited", time: "10:00 AM – 3:00 PM" },
    { name: "Axis Bank", status: "Open", time: "9:00 AM – 4:00 PM" },
    { name: "Punjab National Bank", status: "Busy", time: "10:00 AM – 4:00 PM" },
  ];

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
            <h2>Banks</h2>
            <p>Select a bank to continue</p>
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="service-table">
        {banks.map((bank) => (
          <div
            key={bank.name}
            className="service-row"
            onClick={() =>
              navigate(`/banks/${encodeURIComponent(bank.name)}/services`)
            }
            tabIndex="0"
          >
            <div className="row-main">
              <div className="service-name">{bank.name}</div>
              <div className="service-meta">⏱ {bank.time}</div>
            </div>

            <div className={`status ${bank.status.toLowerCase()}`}>
              {bank.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Banks;



// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/ServiceModern.scss";

// const Banks = () => {
//   const navigate = useNavigate();
//   const [selectedBank, setSelectedBank] = useState(null);

//   const banks = [
//     { name: "State Bank of India", status: "Open", time: "10:00 AM – 4:00 PM" },
//     { name: "HDFC Bank", status: "Open", time: "9:30 AM – 3:30 PM" },
//     { name: "ICICI Bank", status: "Limited", time: "10:00 AM – 3:00 PM" },
//     { name: "Axis Bank", status: "Open", time: "9:00 AM – 4:00 PM" },
//     { name: "Punjab National Bank", status: "Busy", time: "10:00 AM – 4:00 PM" },
//   ];

//   const handleTokenClick = (bank) => {
//     setSelectedBank(bank);
//   };

//   const closeModal = () => {
//     setSelectedBank(null);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert(`Token booked successfully at ${selectedBank.name}`);
//     closeModal();
//   };

//   return (
//     <div className="service-page">
//       {/* NAVBAR */}
//       <div className="service-navbar">
//         <button className="back-btn" onClick={() => navigate(-1)}>
//           ← Back
//         </button>

//         <div className="nav-brand">
//           <div className="logo">🏦</div>
//           <div>
//             <h2>Banks</h2>
//             <p>Select a bank to get your service token</p>
//           </div>
//         </div>
//       </div>

//       {/* LIST */}
//       <div className="service-table">
//         {banks.map((bank) => (
//           <div key={bank.name} className="service-row doctor-board">
//             <div className="doctor-left">
//               <div className="doctor-avatar">{bank.name.charAt(0)}</div>

//               <div className="doctor-info-vertical">
//                 <div className="doctor-name">{bank.name}</div>
//                 <div className="doctor-line">
//                   <span className="label">Working Hours:</span>
//                   <span>{bank.time}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="doctor-right">
//               <span className={`status ${bank.status.toLowerCase()}`}>
//                 {bank.status}
//               </span>

//               <button
//                 className="token-btn"
//                 disabled={bank.status === "Busy"}
//                 onClick={() => handleTokenClick(bank)}
//               >
//                 Get Token
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* BOOKING MODAL */}
//       {selectedBank && (
//         <div className="modal-overlay">
//           <div className="modal-card compact">
//             <div className="modal-header">
//               <div>
//                 <h3>Book Bank Service Token</h3>
//                 <div className="doctor-ref">{selectedBank.name}</div>
//               </div>
//               <button className="close-btn" onClick={closeModal}>✕</button>
//             </div>

//             <form className="modal-form" onSubmit={handleSubmit}>
//               <div className="form-grid">
//                 <input type="text" placeholder="Full Name" required />
//                 <input type="tel" placeholder="Mobile Number" required />
//                 <input type="email" placeholder="Email Address" />
//                 <select required>
//                   <option value="">Select Service</option>
//                   <option>Cash Deposit</option>
//                   <option>Cash Withdrawal</option>
//                   <option>Account Opening</option>
//                   <option>Loan Inquiry</option>
//                   <option>Passbook Update</option>
//                 </select>
//                 <input type="date" required />
//                 <input type="time" required />
//               </div>

//               <textarea
//                 rows="2"
//                 placeholder="Additional Notes (optional)"
//               ></textarea>

//               <div className="modal-actions">
//                 <button type="button" className="cancel-btn" onClick={closeModal}>
//                   Cancel
//                 </button>
//                 <button type="submit" className="confirm-btn">
//                   Confirm Booking
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Banks;
