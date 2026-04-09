import React from "react";

// ── Doctor Modal ──────────────────────────────────────────────
export const DoctorModal = ({ modal, doctorForm, setDoctorForm,
                              onSubmit, onClose }) => (
  <div className="ad-modal-overlay"
    onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="ad-modal">
      <div className="ad-modal-head">
        <div>
          <h3>{modal.data ? "Edit Doctor" : "Add New Doctor"}</h3>
          <p>{modal.data ? "Update doctor details" : "Add a doctor to your branch"}</p>
        </div>
        <button className="ad-modal-close" onClick={onClose}>✕</button>
      </div>
      <form onSubmit={onSubmit}>
        <div className="ad-modal-body">
          <div className="ad-modal-form">
            <div className="ad-form-group">
              <label>Full Name <span className="req">*</span></label>
              <input placeholder="e.g. Dr. Rajesh Kumar"
                value={doctorForm.name} required
                onChange={e => setDoctorForm({ ...doctorForm, name: e.target.value })} />
            </div>
            <div className="ad-form-group">
              <label>Specialization <span className="req">*</span></label>
              <input placeholder="e.g. Cardiology"
                value={doctorForm.specialization} required
                onChange={e => setDoctorForm({ ...doctorForm, specialization: e.target.value })} />
            </div>
            <div className="ad-form-group">
              <label>Experience</label>
              <input placeholder="e.g. 10 years"
                value={doctorForm.experience}
                onChange={e => setDoctorForm({ ...doctorForm, experience: e.target.value })} />
            </div>
            <div className="ad-form-group">
              <label>Timing</label>
              <input placeholder="e.g. 9AM – 1PM"
                value={doctorForm.timing}
                onChange={e => setDoctorForm({ ...doctorForm, timing: e.target.value })} />
            </div>
            <div className="ad-form-group">
              <label>Avg. Consultation (min)</label>
              <input type="number" min="1" max="120"
                value={doctorForm.avgConsultationTime}
                onChange={e => setDoctorForm({ ...doctorForm, avgConsultationTime: parseInt(e.target.value) })} />
            </div>
            <div className="ad-form-group">
              <label>Status</label>
              <select value={doctorForm.status}
                onChange={e => setDoctorForm({ ...doctorForm, status: e.target.value })}>
                <option>Available</option>
                <option>Busy</option>
                <option>On Leave</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
        </div>
        <div className="ad-modal-actions">
          <button type="button" className="ad-btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="ad-btn-primary">
            {modal.data ? "Update Doctor" : "Add Doctor"}
          </button>
        </div>
      </form>
    </div>
  </div>
);

// ── Service Modal ─────────────────────────────────────────────
export const ServiceModal = ({ modal, serviceForm, setServiceForm,
                               onSubmit, onClose }) => (
  <div className="ad-modal-overlay"
    onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="ad-modal">
      <div className="ad-modal-head">
        <div>
          <h3>{modal.data ? "Edit Service" : "Add New Service"}</h3>
          <p>{modal.data ? "Update service details" : "Add a service to your branch"}</p>
        </div>
        <button className="ad-modal-close" onClick={onClose}>✕</button>
      </div>
      <form onSubmit={onSubmit}>
        <div className="ad-modal-body">
          <div className="ad-modal-form">
            <div className="ad-form-group">
              <label>Service Name <span className="req">*</span></label>
              <input placeholder="e.g. Account Opening"
                value={serviceForm.name} required
                onChange={e => setServiceForm({ ...serviceForm, name: e.target.value })} />
            </div>
            <div className="ad-form-group">
              <label>Description</label>
              <input placeholder="Brief description"
                value={serviceForm.description}
                onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })} />
            </div>
            <div className="ad-form-group">
              <label>Counter</label>
              <input placeholder="e.g. Counter A"
                value={serviceForm.counter}
                onChange={e => setServiceForm({ ...serviceForm, counter: e.target.value })} />
            </div>
            <div className="ad-form-group">
              <label>Timing</label>
              <input placeholder="e.g. 10AM – 4PM"
                value={serviceForm.timing}
                onChange={e => setServiceForm({ ...serviceForm, timing: e.target.value })} />
            </div>
            <div className="ad-form-group">
              <label>Avg. Service Time (min)</label>
              <input type="number" min="1" max="120"
                value={serviceForm.avgServiceTimeMinutes}
                onChange={e => setServiceForm({ ...serviceForm, avgServiceTimeMinutes: parseInt(e.target.value) })} />
            </div>
            <div className="ad-form-group">
              <label>Status</label>
              <select value={serviceForm.status}
                onChange={e => setServiceForm({ ...serviceForm, status: e.target.value })}>
                <option>Available</option>
                <option>Busy</option>
                <option>Closed</option>
              </select>
            </div>
          </div>
        </div>
        <div className="ad-modal-actions">
          <button type="button" className="ad-btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="ad-btn-primary">
            {modal.data ? "Update Service" : "Add Service"}
          </button>
        </div>
      </form>
    </div>
  </div>
);

// ── Staff Modal ───────────────────────────────────────────────
export const StaffModal = ({ staffForm, setStaffForm, onSubmit, onClose }) => (
  <div className="ad-modal-overlay"
    onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="ad-modal">
      <div className="ad-modal-head">
        <div>
          <h3>Create Staff Account</h3>
          <p>Staff will be assigned to your branch automatically</p>
        </div>
        <button className="ad-modal-close" onClick={onClose}>✕</button>
      </div>
      <form onSubmit={onSubmit}>
        <div className="ad-modal-body">
          <div className="ad-modal-form">
            <div className="ad-form-group">
              <label>Username <span className="req">*</span></label>
              <input placeholder="e.g. staff_raj"
                value={staffForm.username} required
                onChange={e => setStaffForm({ ...staffForm, username: e.target.value })} />
            </div>
            <div className="ad-form-group">
              <label>Email Address <span className="req">*</span></label>
              <input type="email" placeholder="staff@branch.com"
                value={staffForm.email} required
                onChange={e => setStaffForm({ ...staffForm, email: e.target.value })} />
            </div>
            <div className="ad-form-group">
              <label>Password <span className="req">*</span></label>
              <input type="password" placeholder="Set a strong password"
                value={staffForm.password} required
                onChange={e => setStaffForm({ ...staffForm, password: e.target.value })} />
            </div>
            <div className="ad-form-group">
              <label>Confirm Password <span className="req">*</span></label>
              <input type="password" placeholder="Repeat password"
                value={staffForm.confirmPassword} required
                onChange={e => setStaffForm({ ...staffForm, confirmPassword: e.target.value })} />
            </div>
          </div>
        </div>
        <div className="ad-modal-actions">
          <button type="button" className="ad-btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="ad-btn-primary">Create Staff</button>
        </div>
      </form>
    </div>
  </div>
);