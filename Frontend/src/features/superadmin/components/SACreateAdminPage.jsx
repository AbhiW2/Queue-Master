import React from "react";
import { getCategoryEmoji } from "../utils/saHelpers";

const SACreateAdminPage = ({ adminForm, setAdminForm, branches,
                             onSubmit, setActivePage }) => {
  return (
    <div className="sa-page">
      <div className="sa-form-layout">
        <div className="sa-card sa-form-card">
          <div className="sa-card-head">
            <div>
              <h3>Create Admin Account</h3>
              <p>Assign a new admin to manage a branch</p>
            </div>
          </div>
          <form className="sa-form" onSubmit={onSubmit}>
            <div className="sa-form-section">Account Details</div>
            <div className="sa-form-grid">
              <div className="sa-form-group">
                <label>Username <span className="req">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. admin_hosp1"
                  value={adminForm.username}
                  onChange={e => setAdminForm({ ...adminForm, username: e.target.value })}
                  required
                />
              </div>
              <div className="sa-form-group">
                <label>Email Address <span className="req">*</span></label>
                <input
                  type="email"
                  placeholder="admin@branch.com"
                  value={adminForm.email}
                  onChange={e => setAdminForm({ ...adminForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="sa-form-group">
                <label>Password <span className="req">*</span></label>
                <input
                  type="password"
                  placeholder="Set a strong password"
                  value={adminForm.password}
                  onChange={e => setAdminForm({ ...adminForm, password: e.target.value })}
                  required
                />
              </div>
              <div className="sa-form-group">
                <label>Confirm Password <span className="req">*</span></label>
                <input
                  type="password"
                  placeholder="Repeat password"
                  value={adminForm.confirmPassword}
                  onChange={e => setAdminForm({ ...adminForm, confirmPassword: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="sa-form-section">Branch Assignment</div>
            <div className="sa-form-grid">
              <div className="sa-form-group full">
                <label>Assign to Branch <span className="req">*</span></label>
                <select
                  value={adminForm.branchId}
                  onChange={e => setAdminForm({ ...adminForm, branchId: e.target.value })}
                  required
                >
                  <option value="">— Select Branch —</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>
                      {getCategoryEmoji(b.categoryId)} {b.name} — {b.location}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sa-form-group">
                <label>Role</label>
                <input
                  type="text" value="ADMIN" disabled
                  style={{ opacity: 0.55 }}
                />
              </div>
            </div>

            <div className="sa-form-actions">
              <button type="button" className="sa-btn-secondary"
                onClick={() => setActivePage("admins")}>
                Cancel
              </button>
              <button type="submit" className="sa-btn-primary">
                Create Admin
              </button>
            </div>
          </form>
        </div>

        <div className="sa-form-side">
          <div className="sa-info-card">
            <div className="sa-info-icon">👤</div>
            <h4>Admin Responsibilities</h4>
            <p>
              An admin manages one branch only. They can add doctors,
              services, create staff accounts, and monitor the queue
              for their assigned branch.
            </p>
          </div>
          <div className="sa-info-card">
            <div className="sa-info-icon">🔒</div>
            <h4>Password Policy</h4>
            <p>
              Use a strong password with at least 8 characters including
              uppercase, lowercase, and a number. Share credentials securely.
            </p>
          </div>
          <div className="sa-info-card">
            <div className="sa-info-icon">⚠️</div>
            <h4>One Admin Per Branch</h4>
            <p>
              Each branch should have exactly one admin. Creating multiple
              admins for the same branch may cause conflicts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SACreateAdminPage;