import React from "react";

const SAAddBranchPage = ({ branchForm, setBranchForm, onSubmit, setActivePage }) => {
  return (
    <div className="sa-page">
      <div className="sa-form-layout">
        <div className="sa-card sa-form-card">
          <div className="sa-card-head">
            <div>
              <h3>Branch Information</h3>
              <p>Fill in the details to register a new branch</p>
            </div>
          </div>
          <form className="sa-form" onSubmit={onSubmit}>
            <div className="sa-form-section">Branch Details</div>
            <div className="sa-form-grid">
              <div className="sa-form-group full">
                <label>Branch Name <span className="req">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. City Hospital — Block A"
                  value={branchForm.name}
                  onChange={e => setBranchForm({ ...branchForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="sa-form-group">
                <label>Service Category <span className="req">*</span></label>
                <select
                  value={branchForm.categoryId}
                  onChange={e => setBranchForm({ ...branchForm, categoryId: e.target.value })}
                  required
                >
                  <option value="">— Select Category —</option>
                  <option value="1">🏥 Hospital</option>
                  <option value="2">🏦 Bank</option>
                  <option value="3">🏛️ Government Office</option>
                  <option value="4">🏨 Hotel</option>
                </select>
              </div>
              <div className="sa-form-group">
                <label>Location <span className="req">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Pune, Maharashtra"
                  value={branchForm.location}
                  onChange={e => setBranchForm({ ...branchForm, location: e.target.value })}
                  required
                />
              </div>
              <div className="sa-form-group">
                <label>Timing</label>
                <input
                  type="text"
                  placeholder="e.g. 9AM–5PM or 24hrs"
                  value={branchForm.timing}
                  onChange={e => setBranchForm({ ...branchForm, timing: e.target.value })}
                />
              </div>
              <div className="sa-form-group">
                <label>Status</label>
                <select
                  value={branchForm.status}
                  onChange={e => setBranchForm({ ...branchForm, status: e.target.value })}
                >
                  <option value="Open">Open</option>
                  <option value="Busy">Busy</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
            <div className="sa-form-actions">
              <button type="button" className="sa-btn-secondary"
                onClick={() => setActivePage("branches")}>
                Cancel
              </button>
              <button type="submit" className="sa-btn-primary">
                Save Branch
              </button>
            </div>
          </form>
        </div>

        <div className="sa-form-side">
          <div className="sa-info-card">
            <div className="sa-info-icon">💡</div>
            <h4>Adding a Branch</h4>
            <p>
              After adding a branch, create an Admin and assign them to this
              branch. The admin will manage doctors, services, and staff
              within the branch.
            </p>
          </div>
          <div className="sa-info-card">
            <div className="sa-info-icon">📋</div>
            <h4>Timing Format</h4>
            <p>
              Use formats like <strong>9AM–5PM</strong>,{" "}
              <strong>9:00AM–5:00PM</strong>, or{" "}
              <strong>24hrs</strong> for round-the-clock services.
            </p>
          </div>
          <div className="sa-info-card">
            <div className="sa-info-icon">🏥</div>
            <h4>Category Matters</h4>
            <p>
              Hospital branches use <strong>Doctor queues</strong>. Bank,
              Government, and Hotel branches use <strong>Service counters</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SAAddBranchPage;