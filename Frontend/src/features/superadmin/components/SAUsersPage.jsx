import React, { useState } from "react";
import { getRoleBadge } from "../utils/saHelpers";

const SAUsersPage = ({ users, onRefresh }) => {
  const [search, setSearch] = useState("");

  const filtered = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase())
  );

  const roleCounts = ["SUPER_ADMIN", "ADMIN", "STAFF", "USER"].map(role => ({
    role,
    count: users.filter(u => u.role === role).length,
  }));

  return (
    <div className="sa-page">

      <div className="sa-page-actions">
        <div className="sa-search-box">
          <span className="sa-search-icon">🔍</span>
          <input
            placeholder="Search by name, email or role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="sa-btn-secondary" onClick={onRefresh}>
          ↻ Refresh
        </button>
      </div>

      {/* Role count cards */}
      <div className="sa-role-counts">
        {roleCounts.map(({ role, count }) => (
          <div key={role} className="sa-role-count-card">
            <span className={`sa-badge role-${getRoleBadge(role)}`}>
              {role.replace("_", " ")}
            </span>
            <span className="sa-role-count-num">{count}</span>
          </div>
        ))}
      </div>

      <div className="sa-card">
        <div className="sa-card-head">
          <div>
            <h3>All Users</h3>
            <p>{filtered.length} account{filtered.length !== 1 ? "s" : ""} in system</p>
          </div>
        </div>
        <div className="sa-table-wrap">
          <table className="sa-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id || u.userId}>
                  <td className="sa-cell-muted">{i + 1}</td>
                  <td>
                    <div className="sa-cell-user">
                      <div className={`sa-cell-avatar role-av-${getRoleBadge(u.role)}`}>
                        {u.username?.charAt(0)?.toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600 }}>{u.username}</span>
                    </div>
                  </td>
                  <td className="sa-cell-muted">{u.email}</td>
                  <td>
                    <span className={`sa-badge role-${getRoleBadge(u.role)}`}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="sa-empty-row">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SAUsersPage;