import React, { useState } from "react";

const ADStaffPage = ({ staff, setModal, setStaffForm, emptyStaff, onDelete }) => {
  const [search, setSearch] = useState("");

  const filtered = staff.filter(s =>
    s.username?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="ad-page-actions">
        <div className="ad-search-box">
          <span className="ad-search-icon">🔍</span>
          <input
            placeholder="Search staff by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="ad-btn-primary"
          onClick={() => { setModal({ type:"staff", data:null }); setStaffForm(emptyStaff); }}>
          + Add Staff
        </button>
      </div>

      <div className="ad-card">
        <div className="ad-card-head">
          <div>
            <h3>Staff Members</h3>
            <p>{filtered.length} staff member{filtered.length !== 1 ? "s" : ""} in your branch</p>
          </div>
        </div>
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr><th>#</th><th>Staff Member</th><th>Email</th><th>Role</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id}>
                  <td className="ad-cell-muted">{i + 1}</td>
                  <td>
                    <div className="ad-cell-user">
                      <div className="ad-cell-avatar">
                        {s.username?.charAt(0)?.toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600 }}>{s.username}</span>
                    </div>
                  </td>
                  <td className="ad-cell-muted">{s.email}</td>
                  <td><span className="ad-badge role-staff">{s.role}</span></td>
                  <td>
                    <button className="ad-btn-icon del" title="Remove"
                      onClick={() => onDelete(s.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="ad-empty-row">No staff members yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ADStaffPage;