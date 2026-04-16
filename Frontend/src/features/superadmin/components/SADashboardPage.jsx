import React from "react";
import { getCategoryEmoji, getCategoryLabel } from "../utils/saHelpers";

const SADashboardPage = ({ stats, branches, setActivePage }) => {
  return (
    <div className="sa-page">

      {/* ── Stats ─────────────────────────────────────────── */}
      <div className="sa-stats-grid">
        <div className="sa-stat-card" onClick={() => setActivePage("branches")}>
          <div className="sa-stat-icon branches">🏢</div>
          <div>
            <div className="sa-stat-val">{stats.branches}</div>
            <div className="sa-stat-lbl">Total Branches</div>
            <div className="sa-stat-sub">Across all services</div>
          </div>
        </div>
        <div className="sa-stat-card" onClick={() => setActivePage("admins")}>
          <div className="sa-stat-icon admins">👤</div>
          <div>
            <div className="sa-stat-val">{stats.admins}</div>
            <div className="sa-stat-lbl">Branch Admins</div>
            <div className="sa-stat-sub">1 per branch</div>
          </div>
        </div>
        <div className="sa-stat-card" onClick={() => setActivePage("users")}>
          <div className="sa-stat-icon users">👥</div>
          <div>
            <div className="sa-stat-val">{stats.users}</div>
            <div className="sa-stat-lbl">Registered Users</div>
            <div className="sa-stat-sub">All roles combined</div>
          </div>
        </div>
        <div className="sa-stat-card">
          <div className="sa-stat-icon tokens">🎫</div>
          <div>
            <div className="sa-stat-val">4</div>
            <div className="sa-stat-lbl">Service Types</div>
            <div className="sa-stat-sub">Hospital, Bank, Govt, Hotel</div>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ─────────────────────────────────── */}
      <div>
        <div className="sa-section-title">Quick Actions</div>
        <div className="sa-quick-actions">
          {[
            { icon:"🏢", label:"Add New Branch",   page:"add-branch"   },
            { icon:"👤", label:"Create Admin",      page:"create-admin" },
            { icon:"👥", label:"View All Users",    page:"users"        },
            { icon:"🎫", label:"Token Overview",    page:"tokens"       },
          ].map(a => (
            <button key={a.label} className="sa-quick-btn"
              onClick={() => setActivePage(a.page)}>
              <span className="sa-quick-icon">{a.icon}</span>
              <span className="sa-quick-label">{a.label}</span>
              <span className="sa-quick-arrow">→</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Recent Branches ───────────────────────────────── */}
      <div>
        <div className="sa-section-title">Recent Branches</div>
        <div className="sa-card">
          <div className="sa-table-wrap">
            <table className="sa-table">
              <thead>
                <tr>
                  <th>Branch</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {branches.slice(0, 5).map(b => (
                  <tr key={b.id}>
                    <td>
                      <div className="sa-cell-main">
                        {getCategoryEmoji(b.categoryId)} {b.name}
                      </div>
                    </td>
                    <td>
                      <span className={`sa-badge cat-${b.categoryId}`}>
                        {getCategoryLabel(b.categoryId)}
                      </span>
                    </td>
                    <td className="sa-cell-muted">{b.location}</td>
                    <td>
                      <span className={`sa-badge ${b.status?.toLowerCase()}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {branches.length === 0 && (
                  <tr>
                    <td colSpan={4} className="sa-empty-row">
                      No branches added yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SADashboardPage;