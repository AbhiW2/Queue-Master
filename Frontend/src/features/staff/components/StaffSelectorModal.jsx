import React from "react";

const StaffSelectorModal = ({ branchInfo, options, selected, onSelect }) => {

  if (!options || options.length === 0) return null;

  const isHospital = branchInfo?.isHospital;

  return (
    <div className="sf-selector-overlay">
      <div className="sf-selector-modal">
        <div className="sf-selector-modal-head">
          <h3>
            {isHospital ? "🩺 Select Doctor" : "⚙️ Select Service Counter"}
          </h3>
          <p>
            {isHospital
              ? "Choose the doctor whose queue you will manage today"
              : "Choose the service counter you will manage today"}
          </p>
        </div>
        <div className="sf-selector-modal-body">
          {options.map(opt => (
            <div
              key={opt.id}
              className={`sf-option-card ${selected?.id === opt.id ? "active" : ""}`}
              onClick={() => onSelect(opt)}
            >
              <div className="sf-option-card-icon">
                {isHospital ? "🩺" : "⚙️"}
              </div>
              <div className="sf-option-card-info">
                <div className="sf-option-card-name">
                  {isHospital ? `Dr. ${opt.name}` : opt.name}
                </div>
                <div className="sf-option-card-sub">
                  {isHospital
                    ? `${opt.specialization || ""}${opt.timing ? " · " + opt.timing : ""}`
                    : `${opt.counter ? "Counter: " + opt.counter : ""}${opt.timing ? " · " + opt.timing : ""}`}
                </div>
              </div>
              <span className={`sf-option-card-status ${opt.status?.toLowerCase().replace(" ", "-")}`}>
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