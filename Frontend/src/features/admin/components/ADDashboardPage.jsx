import React from "react";
import { statusColor, renderStars } from "../utils/adHelpers";

const ADDashboardPage = ({ stats, isHospital, doctors, services,
                           queue, setActivePage, setModal,
                           setDoctorForm, setServiceForm, setStaffForm,
                           emptyDoctor, emptyService, emptyStaff }) => {

  const queueCounts = [
    { cls: "",          lbl: "Total Today", val: queue.length },
    { cls: "active",    lbl: "Active",      val: queue.filter(t => ["BOOKED","CALLED","IN_PROGRESS"].includes(t.status)).length },
    { cls: "completed", lbl: "Completed",   val: queue.filter(t => t.status === "COMPLETED").length },
    { cls: "cancelled", lbl: "Cancelled",   val: queue.filter(t => t.status === "CANCELLED").length },
  ];

  return (
    <>
      {/* ── Stats ───────────────────────────────────────── */}
      <div className="ad-stats-grid">
        {[
          isHospital
            ? { icon:"🩺", cls:"doctors",   val: stats?.totalDoctors   ?? 0, lbl:"Total Doctors",   sub:"In your branch",         page:"doctors"  }
            : { icon:"⚙️",  cls:"services",  val: stats?.totalServices  ?? 0, lbl:"Branch Services", sub:"Active service counters", page:"services" },
          { icon:"👥", cls:"staff",     val: stats?.totalStaff           ?? 0, lbl:"Staff Members",   sub:"Assigned to branch",     page:"staff"    },
          { icon:"🎫", cls:"active",    val: stats?.activeTokensToday    ?? 0, lbl:"Active Tokens",   sub:"Today in queue",         page:"queue"    },
          { icon:"✅", cls:"completed", val: stats?.completedTokensToday ?? 0, lbl:"Completed",       sub:"Today",                  page:"queue"    },
          { icon:"❌", cls:"cancelled", val: stats?.cancelledTokensToday ?? 0, lbl:"Cancelled",       sub:"Today",                  page:"queue"    },
        ].map(s => (
          <div key={s.lbl} className="ad-stat-card" onClick={() => setActivePage(s.page)}>
            <div className={`ad-stat-icon ${s.cls}`}>{s.icon}</div>
            <div>
              <div className="ad-stat-val">{s.val}</div>
              <div className="ad-stat-lbl">{s.lbl}</div>
              <div className="ad-stat-sub">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Quick Actions ────────────────────────────────── */}
      <div>
        <div className="ad-section-title">Quick Actions</div>
        <div className="ad-quick-actions">
          {[
            ...(isHospital
              ? [{ icon:"🩺", label:"Add Doctor",  action:() => { setModal({type:"doctor",data:null});  setDoctorForm(emptyDoctor); }}]
              : [{ icon:"⚙️",  label:"Add Service", action:() => { setModal({type:"service",data:null}); setServiceForm(emptyService); }}]
            ),
            { icon:"👤", label:"Add Staff",   action:() => { setModal({type:"staff",data:null}); setStaffForm(emptyStaff); }},
            { icon:"🎫", label:"View Queue",  action:() => setActivePage("queue") },
          ].map(a => (
            <button key={a.label} className="ad-quick-btn" onClick={a.action}>
              <span className="ad-quick-icon">{a.icon}</span>
              <span className="ad-quick-label">{a.label}</span>
              <span className="ad-quick-arrow">→</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Recent Doctors (Hospital) ────────────────────── */}
      {isHospital && (
        <div>
          <div className="ad-section-title">Recent Doctors</div>
          <div className="ad-card">
            <div className="ad-table-wrap">
              <table className="ad-table">
                <thead>
                  <tr><th>Doctor</th><th>Specialization</th><th>Timing</th><th>Status</th><th>Rating</th></tr>
                </thead>
                <tbody>
                  {doctors.slice(0, 5).map(d => (
                    <tr key={d.id}>
                      <td><div className="ad-cell-main">🩺 {d.name}</div></td>
                      <td className="ad-cell-muted">{d.specialization}</td>
                      <td className="ad-cell-muted">{d.timing || "—"}</td>
                      <td><span className={`ad-badge ${statusColor(d.status)}`}>{d.status}</span></td>
                      <td><span className="ad-stars">{renderStars(d.rating)}</span></td>
                    </tr>
                  ))}
                  {doctors.length === 0 && (
                    <tr><td colSpan={5} className="ad-empty-row">No doctors added yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Recent Services (Non-Hospital) ──────────────── */}
      {!isHospital && (
        <div>
          <div className="ad-section-title">Recent Services</div>
          <div className="ad-card">
            <div className="ad-table-wrap">
              <table className="ad-table">
                <thead>
                  <tr><th>Service</th><th>Counter</th><th>Timing</th><th>Avg. Time</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {services.slice(0, 5).map(s => (
                    <tr key={s.id}>
                      <td><div className="ad-cell-main">⚙️ {s.name}</div></td>
                      <td className="ad-cell-muted">{s.counter || "—"}</td>
                      <td className="ad-cell-muted">{s.timing  || "—"}</td>
                      <td className="ad-cell-muted">{s.avgServiceTimeMinutes} min</td>
                      <td><span className={`ad-badge ${statusColor(s.status)}`}>{s.status}</span></td>
                    </tr>
                  ))}
                  {services.length === 0 && (
                    <tr><td colSpan={5} className="ad-empty-row">No services added yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Live Queue ───────────────────────────────────── */}
      <div>
        <div className="ad-section-title">Today's Queue — Live</div>
        <div className="ad-queue-stats">
          {queueCounts.map(s => (
            <div key={s.lbl} className={`ad-queue-stat ${s.cls}`}>
              <div className="val">{s.val}</div>
              <div className="lbl">{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ADDashboardPage;