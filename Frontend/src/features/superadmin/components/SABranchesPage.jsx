import React, { useState } from "react";
import { getCategoryEmoji, getCategoryLabel } from "../utils/saHelpers";

const SABranchesPage = ({ branches, setActivePage, onDelete }) => {
  const [search, setSearch] = useState("");

  const filtered = branches.filter(b =>
    b.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sa-page">
      <div className="sa-page-actions">
        <div className="sa-search-box">
          <span className="sa-search-icon">🔍</span>
          <input
            placeholder="Search branches by name or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="sa-btn-primary"
          onClick={() => setActivePage("add-branch")}>
          + Add Branch
        </button>
      </div>

      <div className="sa-card">
        <div className="sa-card-head">
          <div>
            <h3>All Branches</h3>
            <p>{filtered.length} branch{filtered.length !== 1 ? "es" : ""} found</p>
          </div>
        </div>
        <div className="sa-table-wrap">
          <table className="sa-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Branch Name</th>
                <th>Category</th>
                <th>Location</th>
                <th>Timing</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => (
                <tr key={b.id}>
                  <td className="sa-cell-muted">{i + 1}</td>
                  <td>
                    <div className="sa-cell-main">
                      <span className="sa-cell-emoji">
                        {getCategoryEmoji(b.categoryId)}
                      </span>
                      {b.name}
                    </div>
                  </td>
                  <td>
                    <span className={`sa-badge cat-${b.categoryId}`}>
                      {getCategoryLabel(b.categoryId)}
                    </span>
                  </td>
                  <td className="sa-cell-muted">{b.location}</td>
                  <td className="sa-cell-muted">{b.timing || "—"}</td>
                  <td>
                    <span className={`sa-badge ${b.status?.toLowerCase()}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <button className="sa-btn-danger-sm"
                      onClick={() => onDelete(b.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="sa-empty-row">
                    No branches found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SABranchesPage;