import React from "react";

const StaffSelectorModal = ({ branchInfo, options, selected, onSelect }) => {
  if (!options || options.length === 0) return null;
  const isHospital = branchInfo?.isHospital;

  return (
    <div className="sf-overlay">
      <div className="sf-modal">
        <div className="sf-modal-head">
          <h3>{isHospital ? "🩺 Select Doctor" : "⚙️ Select Service Counter"}</h3>
          <p>
            {isHospital
              ? "Choose the doctor whose queue you will manage today"
              : "Choose the service counter you will manage today"}
          </p>
        </div>
        <div className="sf-modal-body">
          {options.map(opt => (
            <div
              key={opt.id}
              className={`sf-opt ${selected?.id === opt.id ? "active" : ""}`}
              onClick={() => onSelect(opt)}
            >
              <div className="sf-opt-icon">{isHospital ? "🩺" : "⚙️"}</div>
              <div className="sf-opt-info">
                <div className="sf-opt-name">
                  {isHospital ? `Dr. ${opt.name}` : opt.name}
                </div>
                <div className="sf-opt-sub">
                  {isHospital
                    ? `${opt.specialization || ""}${opt.timing ? " · " + opt.timing : ""}`
                    : `${opt.counter ? "Counter: " + opt.counter : ""}${opt.timing ? " · " + opt.timing : ""}`}
                </div>
              </div>
              <span className={`sf-opt-status ${opt.status?.toLowerCase().replace(/\s+/g, "-")}`}>
                {opt.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffSelectorModal;