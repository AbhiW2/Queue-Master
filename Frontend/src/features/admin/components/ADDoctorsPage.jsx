import React, { useState } from "react";
import { statusColor, renderStars } from "../utils/adHelpers";

const ADDoctorsPage = ({ doctors, setModal, setDoctorForm,
                         emptyDoctor, onDelete }) => {
  const [search, setSearch] = useState("");

  const filtered = doctors.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="ad-page-actions">
        <div className="ad-search-box">
          <span className="ad-search-icon">🔍</span>
          <input
            placeholder="Search by name or specialization..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="ad-btn-primary"
          onClick={() => { setModal({ type:"doctor", data:null }); setDoctorForm(emptyDoctor); }}>
          + Add Doctor
        </button>
      </div>

      <div className="ad-card">
        <div className="ad-card-head">
          <div>
            <h3>All Doctors</h3>
            <p>{filtered.length} doctor{filtered.length !== 1 ? "s" : ""} in your branch</p>
          </div>
        </div>
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>#</th><th>Doctor</th><th>Specialization</th>
                <th>Experience</th><th>Timing</th><th>Avg. Time</th>
                <th>Status</th><th>Rating</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <tr key={d.id}>
                  <td className="ad-cell-muted">{i + 1}</td>
                  <td>
                    <div className="ad-cell-user">
                      <div className="ad-cell-avatar">🩺</div>
                      <span style={{ fontWeight: 600 }}>{d.name}</span>
                    </div>
                  </td>
                  <td className="ad-cell-muted">{d.specialization}</td>
                  <td className="ad-cell-muted">{d.experience || "—"}</td>
                  <td className="ad-cell-muted">{d.timing || "—"}</td>
                  <td className="ad-cell-muted">{d.avgConsultationTime} min</td>
                  <td><span className={`ad-badge ${statusColor(d.status)}`}>{d.status}</span></td>
                  <td>
                    <span className="ad-stars">{renderStars(d.rating)}</span>
                    <span className="ad-cell-muted" style={{ fontSize:"12px", marginLeft:"4px" }}>
                      {d.rating.toFixed(1)}
                    </span>
                  </td>
                  <td>
                    <div className="ad-btn-actions">
                      <button className="ad-btn-icon edit" title="Edit"
                        onClick={() => {
                          setDoctorForm({
                            name: d.name, specialization: d.specialization,
                            experience: d.experience, timing: d.timing,
                            status: d.status, avgConsultationTime: d.avgConsultationTime
                          });
                          setModal({ type:"doctor", data:d });
                        }}>✏️</button>
                      <button className="ad-btn-icon del" title="Delete"
                        onClick={() => onDelete(d.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="ad-empty-row">No doctors found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ADDoctorsPage;