import React, { useState } from "react";
import { getCategoryEmoji, getRoleBadge } from "../utils/saHelpers";

const SAAdminsPage = ({ admins, setActivePage, onDelete }) => {
  const [search, setSearch] = useState("");

  const filtered = admins.filter(a =>
    a.username?.toLowerCase().includes(search.toLowerCase()) ||
    a.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sa-page">
      <div className="sa-page-actions">
        <div className="sa-search-box">
          <span className="sa-search-icon">🔍</span>
          <input
            placeholder="Search admins by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="sa-btn-primary"
          onClick={() => setActivePage("create-admin")}>
          + Create Admin
        </button>
      </div>

      <div className="sa-card">
        <div className="sa-card-head">
          <div>
            <h3>All Admins</h3>
            <p>Each admin manages one branch</p>
          </div>
        </div>
        <div className="sa-table-wrap">
          <table className="sa-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Admin</th>
                <th>Email</th>
                <th>Assigned Branch</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={a.id || a.userId}>
                  <td className="sa-cell-muted">{i + 1}</td>
                  <td>
                    <div className="sa-cell-user">
                      <div className="sa-cell-avatar">
                        {a.username?.charAt(0)?.toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600 }}>{a.username}</span>
                    </div>
                  </td>
                  <td className="sa-cell-muted">{a.email}</td>
                  <td>
                    {a.branch
                      ? <div className="sa-cell-main">
                          {getCategoryEmoji(a.branch?.category?.id)}&nbsp;
                          {a.branch?.name}
                        </div>
                      : <span className="sa-cell-muted">Not assigned</span>
                    }
                  </td>
                  <td>
                    <span className={`sa-badge role-${getRoleBadge(a.role)}`}>
                      {a.role}
                    </span>
                  </td>
                  <td>
                    <button className="sa-btn-danger-sm"
                      onClick={() => onDelete(a.id || a.userId)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="sa-empty-row">No admins found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SAAdminsPage;