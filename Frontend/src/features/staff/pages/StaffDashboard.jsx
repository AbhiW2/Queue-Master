

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/StaffDashboard.scss";

import StaffSidebar       from "../components/StaffSidebar";
import StaffTopbar        from "../components/StaffTopbar";
import StaffSelectorModal from "../components/StaffSelectorModal";
import StaffStats         from "../components/StaffStats";
import StaffQueuePanel    from "../components/StaffQueuePanel";

const API = "http://localhost:8080/api/staff";

const StaffDashboard = () => {
  const navigate  = useNavigate();
  const username  = localStorage.getItem("username");

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization : `Bearer ${localStorage.getItem("token")}`
  });

  // ── UI state ──
  const [activePage, setActivePage] = useState("queue");
  const [collapsed,  setCollapsed]  = useState(false);
  const [toast,      setToast]      = useState(null);
  const [loading,    setLoading]    = useState(false);

  // ── Data state ──
  const [branchInfo, setBranchInfo] = useState(null);
  const [options,    setOptions]    = useState([]);
  const [selected,   setSelected]   = useState(null);
  const [queue,      setQueue]      = useState([]);
  const [stats,      setStats]      = useState(null);

  // ── Auth guard ──
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!["STAFF", "ADMIN", "SUPER_ADMIN"].includes(role)) navigate("/login");
  }, []);

  useEffect(() => { init(); }, []);

  // Auto-refresh every 20s when a counter is selected
  useEffect(() => {
    if (!selected) return;
    const id = setInterval(() => loadQueue(), 20000);
    return () => clearInterval(id);
  }, [selected]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Init ──
  const init = async () => {
    try {
      const infoRes = await axios.get(`${API}/branch-info`, { headers: getHeaders() });
      const info    = infoRes.data;
      setBranchInfo(info);

      let list = [];
      let resolvedInfo = { ...info };

      if (info.isHospital) {
        const res = await axios.get(`${API}/doctors`, { headers: getHeaders() });
        list = Array.isArray(res.data) ? res.data : [];
      } else {
        const res = await axios.get(`${API}/services`, { headers: getHeaders() });
        list = Array.isArray(res.data) ? res.data : [];

        // Smart fallback: if services empty, try doctors
        if (list.length === 0) {
          try {
            const fallback = await axios.get(`${API}/doctors`, { headers: getHeaders() });
            const doctorList = Array.isArray(fallback.data) ? fallback.data : [];
            if (doctorList.length > 0) {
              list = doctorList;
              resolvedInfo = { ...info, isHospital: true };
              setBranchInfo(resolvedInfo);
            }
          } catch (_) {}
        }
      }

      setOptions(list);

      if (list.length === 1) {
        setSelected(list[0]);
        setTimeout(() => loadQueueWith(list[0], resolvedInfo), 100);
      } else if (list.length === 0) {
        showToast("No doctors or services found. Ask Admin to add them.", "error");
      }
    } catch (e) {
      showToast(e.response?.data?.message || "Failed to load branch info.", "error");
    }
  };

  const loadQueueWith = async (opt, info) => {
    if (!opt || !info) return;
    setLoading(true);
    try {
      const queueUrl = info.isHospital
        ? `${API}/queue/doctor/${opt.id}`
        : `${API}/queue/service/${opt.id}`;
      const statsUrl = info.isHospital
        ? `${API}/stats/doctor/${opt.id}`
        : `${API}/stats/service/${opt.id}`;
      const [qRes, sRes] = await Promise.all([
        axios.get(queueUrl, { headers: getHeaders() }),
        axios.get(statsUrl, { headers: getHeaders() }),
      ]);
      setQueue(Array.isArray(qRes.data) ? qRes.data : []);
      setStats(sRes.data);
    } catch (e) {
      showToast("Failed to load queue.", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadQueue = async (opt = selected) => {
    if (!opt || !branchInfo) return;
    setLoading(true);
    try {
      const isHospital = branchInfo.isHospital;
      const queueUrl   = isHospital
        ? `${API}/queue/doctor/${opt.id}`
        : `${API}/queue/service/${opt.id}`;
      const statsUrl   = isHospital
        ? `${API}/stats/doctor/${opt.id}`
        : `${API}/stats/service/${opt.id}`;
      const [qRes, sRes] = await Promise.all([
        axios.get(queueUrl, { headers: getHeaders() }),
        axios.get(statsUrl, { headers: getHeaders() }),
      ]);
      setQueue(Array.isArray(qRes.data) ? qRes.data : []);
      setStats(sRes.data);
    } catch (e) {
      showToast("Failed to load queue.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout   = () => { localStorage.clear(); navigate("/login"); };
  const handleSelect   = async (opt) => { setSelected(opt); await loadQueue(opt); };

  // ── Call Next ──
  const handleCallNext = async () => {
    if (!selected || !branchInfo) return;
    try {
      const url = branchInfo.isHospital
        ? `${API}/call-next/doctor/${selected.id}`
        : `${API}/call-next/service/${selected.id}`;
      const res = await axios.post(url, {}, { headers: getHeaders() });
      showToast(`🔔 Now serving: ${res.data.displayToken}`, "info");
      await loadQueue();
    } catch (e) {
      showToast(e.response?.data?.message || "No more tokens in queue.", "error");
    }
  };

  // ── Core status-update (used by all 4 actions) ──
  const updateStatus = async (tokenId, status) => {
    try {
      await axios.patch(
        `${API}/token/${tokenId}/status`,
        { status },
        { headers: getHeaders() }
      );
      const toastMap = {
        COMPLETED : "✅ Token marked as served",
        SKIPPED   : "⏭  Token skipped",
        NO_SHOW   : "✗  Marked as no-show",
        BOOKED    : "⏸  Token held — moved to end of queue",
      };
      showToast(toastMap[status] || "Updated", "success");
      await loadQueue();
    } catch (e) {
      showToast(e.response?.data?.message || "Failed to update token.", "error");
    }
  };

  // ── The four staff actions ──
  const handleComplete = (id) => updateStatus(id, "COMPLETED");
  const handleSkip     = (id) => updateStatus(id, "SKIPPED");
  const handleHold     = (id) => updateStatus(id, "BOOKED");   // re-queue at end
  const handleNoShow   = (id) => updateStatus(id, "NO_SHOW");

  const completedTokens = queue.filter(t =>
    ["COMPLETED", "CANCELLED", "NO_SHOW", "SKIPPED"].includes(t.status));

  return (
    <div className={`sf-root ${collapsed ? "collapsed" : ""}`}>

      {/* ── TOAST ── */}
      {toast && (
        <div className={`sf-toast sf-toast--${toast.type}`}>
          <span className="sf-toast-icon">
            {toast.type === "success" ? "✓" : toast.type === "info" ? "🔔" : "✕"}
          </span>
          {toast.message}
        </div>
      )}

      {/* ── SELECTOR MODAL ── */}
      {!selected && branchInfo && options.length > 0 && (
        <StaffSelectorModal
          branchInfo={branchInfo}
          options={options}
          selected={selected}
          onSelect={handleSelect}
        />
      )}

      {/* ── SIDEBAR ── */}
      <StaffSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activePage={activePage}
        setActivePage={setActivePage}
        username={username}
        branchInfo={branchInfo}
        onLogout={handleLogout}
      />

      {/* ── MAIN ── */}
      <main className="sf-main">
        <StaffTopbar
          activePage={activePage}
          branchInfo={branchInfo}
          selected={selected}
          onRefresh={() => loadQueue()}
        />

        <div className="sf-content">

          {/* ── QUEUE PAGE ── */}
          {activePage === "queue" && (
            <>
              {selected ? (
                <>
                  {/* Managing bar */}
                  <div className="sf-managing-bar">
                    <div className="sf-managing-bar-info">
                      <span className="sf-managing-bar-dot" />
                      Managing:&nbsp;
                      <strong>
                        {branchInfo?.isHospital ? `Dr. ${selected.name}` : selected.name}
                      </strong>
                      {selected.counter && (
                        <span className="sf-managing-bar-counter">
                          Counter {selected.counter}
                        </span>
                      )}
                    </div>
                    <button
                      className="sf-btn-change"
                      onClick={() => { setSelected(null); setQueue([]); setStats(null); }}
                    >
                      ⇄ Change
                    </button>
                  </div>

                  {/* ── QUICK ACTIONS BAR ── */}
                  <div className="sf-quick-actions">
                    <div className="sf-quick-actions-title">Quick Actions</div>
                    <div className="sf-quick-actions-row">
                      <button
                        className="sf-quick-btn sf-quick-btn--callnext"
                        onClick={handleCallNext}
                        disabled={!(stats?.waiting > 0)}
                      >
                        <span className="sf-quick-icon">▶</span>
                        <span className="sf-quick-text">
                          <strong>Call Next</strong>
                          <small>
                            {stats?.waiting > 0
                              ? `${stats.waiting} waiting`
                              : "None waiting"}
                          </small>
                        </span>
                      </button>

                      <div className="sf-quick-legend">
                        <div className="sf-legend-item">
                          <span className="sf-legend-dot served" />
                          <span>Mark Served — service complete ✓</span>
                        </div>
                        <div className="sf-legend-item">
                          <span className="sf-legend-dot hold" />
                          <span>Hold — move patient to end of queue ⏸</span>
                        </div>
                        <div className="sf-legend-item">
                          <span className="sf-legend-dot skip" />
                          <span>Skip — patient loses their turn ⏭</span>
                        </div>
                        <div className="sf-legend-item">
                          <span className="sf-legend-dot noshow" />
                          <span>No Show — patient didn't arrive ✗</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <StaffStats
                    stats={stats}
                    selected={selected}
                    branchInfo={branchInfo}
                    onCallNext={handleCallNext}
                  />

                  <StaffQueuePanel
                    queue={queue}
                    loading={loading}
                    onComplete={handleComplete}
                    onSkip={handleSkip}
                    onHold={handleHold}
                    onNoShow={handleNoShow}
                  />
                </>
              ) : (
                <div className="sf-empty-state">
                  <div className="sf-empty-state-icon">
                    {options.length === 0 ? "⚠️" : "👆"}
                  </div>
                  <h3>
                    {options.length === 0 ? "No counters found" : "No counter selected"}
                  </h3>
                  <p>
                    {options.length === 0
                      ? `Ask your Admin to add ${branchInfo?.isHospital ? "doctors" : "service counters"} to your branch.`
                      : `Select a ${branchInfo?.isHospital ? "doctor" : "service counter"} to start managing the queue`}
                  </p>
                  {options.length === 0 && (
                    <button className="sf-btn-change" style={{ marginTop: "16px" }} onClick={init}>
                      ↻ Retry
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          {/* ── HISTORY PAGE ── */}
          {activePage === "history" && (
            <div className="sf-card">
              <div className="sf-card-head">
                <div>
                  <h3>📋 Queue History — Today</h3>
                  <p>{completedTokens.length} finished tokens</p>
                </div>
              </div>
              <div className="sf-tokens-list">
                {completedTokens.length === 0 ? (
                  <div className="sf-empty">
                    <div className="sf-empty-icon">📋</div>
                    No completed tokens yet today
                  </div>
                ) : (
                  completedTokens.map(t => {
                    const sc = t.status?.toLowerCase().replace(/_/g, "-");
                    return (
                      <div key={t.tokenId} className={`sf-token-row ${sc}`}>
                        <div className={`sf-token-badge ${sc}`}>{t.displayToken}</div>
                        <div className="sf-token-row-info">
                          <div className="sf-token-row-name">👤 {t.customerName || "—"}</div>
                          <div className="sf-token-row-sub">{t.serviceName} · #{t.tokenNumber}</div>
                        </div>
                        <span className={`sf-status-pill ${sc}`}>
                          {t.status?.replace(/_/g, " ")}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;