import React, { useState } from "react";
import { statusColor } from "../utils/adHelpers";

const ADServicesPage = ({ services, setModal, setServiceForm,
                          emptyService, onDelete }) => {
  const [search, setSearch] = useState("");

  const filtered = services.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.counter?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="ad-page-actions">
        <div className="ad-search-box">
          <span className="ad-search-icon">🔍</span>
          <input
            placeholder="Search by service name or counter..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="ad-btn-primary"
          onClick={() => { setModal({ type:"service", data:null }); setServiceForm(emptyService); }}>
          + Add Service
        </button>
      </div>

      <div className="ad-card">
        <div className="ad-card-head">
          <div>
            <h3>Branch Services</h3>
            <p>{filtered.length} service{filtered.length !== 1 ? "s" : ""} configured</p>
          </div>
        </div>
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>#</th><th>Service Name</th><th>Counter</th>
                <th>Timing</th><th>Avg. Time</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id}>
                  <td className="ad-cell-muted">{i + 1}</td>
                  <td>
                    <div className="ad-cell-user">
                      <div className="ad-cell-avatar">⚙️</div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{s.name}</div>
                        {s.description && (
                          <div style={{ fontSize:"12px", color:"#94a3b8" }}>
                            {s.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="ad-cell-muted">{s.counter || "—"}</td>
                  <td className="ad-cell-muted">{s.timing  || "—"}</td>
                  <td className="ad-cell-muted">{s.avgServiceTimeMinutes} min</td>
                  <td><span className={`ad-badge ${statusColor(s.status)}`}>{s.status}</span></td>
                  <td>
                    <div className="ad-btn-actions">
                      <button className="ad-btn-icon edit" title="Edit"
                        onClick={() => {
                          setServiceForm({
                            name: s.name, description: s.description,
                            counter: s.counter, timing: s.timing,
                            status: s.status,
                            avgServiceTimeMinutes: s.avgServiceTimeMinutes
                          });
                          setModal({ type:"service", data:s });
                        }}>✏️</button>
                      <button className="ad-btn-icon del" title="Delete"
                        onClick={() => onDelete(s.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="ad-empty-row">No services found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ADServicesPage;