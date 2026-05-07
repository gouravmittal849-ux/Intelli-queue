import { calcWaitTime, crowdLevel, waitStatusMessage } from "../utils/queueLogic";

const LEVEL_COLORS = {
  low: { bg: "#d4edda", text: "#155724", dot: "#28a745" },
  medium: { bg: "#fff3cd", text: "#856404", dot: "#ffc107" },
  high: { bg: "#f8d7da", text: "#721c24", dot: "#dc3545" },
};

export default function DoctorCard({
  doctor,
  isRecommended,
  isCurrent,
  timeSaved,
  onSwitch,
  myPosition,
}) {
  const waitMins = calcWaitTime(doctor.queueLength, doctor.speed);
  const level = crowdLevel(doctor.queueLength);
  const colors = LEVEL_COLORS[level];
  const statusMsg = waitStatusMessage(doctor);

  return (
    <div
      className={`doctor-card ${isRecommended ? "recommended" : ""} ${
        isCurrent ? "current-doctor" : ""
      } ${!doctor.available ? "unavailable" : ""}`}
    >
      {/* Badges row */}
      <div className="card-badges">
        {isRecommended && (
          <span className="badge badge-recommended">⭐ Recommended</span>
        )}
        {isCurrent && <span className="badge badge-current">📍 Your Doctor</span>}
        {!doctor.available && (
          <span className="badge badge-unavailable">🔴 Unavailable</span>
        )}
        {isRecommended && timeSaved > 0 && (
          <span className="badge badge-save">⏱ Save {timeSaved} mins</span>
        )}
      </div>

      {/* Doctor info */}
      <div className="card-header">
        <div className="avatar">{doctor.avatar}</div>
        <div className="doctor-info">
          <h3>{doctor.name}</h3>
          <p className="dept-tag">{doctor.departmentName}</p>
          <p className="experience">🎓 {doctor.experience} experience</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="stats-grid">
        <div className="stat">
          <span className="stat-label">Queue</span>
          <span className="stat-value" style={{ color: colors.dot }}>
            {doctor.queueLength} patients
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Wait Time</span>
          <span className="stat-value">{waitMins} mins</span>
        </div>
        <div className="stat">
          <span className="stat-label">Speed</span>
          <span className="stat-value">{doctor.speed}/hr</span>
        </div>
        <div className="stat">
          <span className="stat-label">Avg Consult</span>
          <span className="stat-value">{doctor.avgConsultTime} mins</span>
        </div>
      </div>

      {/* Crowd level pill */}
      <div
        className="crowd-pill"
        style={{ background: colors.bg, color: colors.text }}
      >
        <span
          className="crowd-dot"
          style={{ background: colors.dot }}
        />
        {level.charAt(0).toUpperCase() + level.slice(1)} crowd · {statusMsg}
      </div>

      {/* Performance row */}
      <div className="perf-row">
        <span>👥 {doctor.patientsToday} patients today</span>
        {myPosition && isCurrent && (
          <span className="position-tag">You are #{myPosition} in line</span>
        )}
      </div>

      {/* Switch button */}
      {isRecommended && !isCurrent && doctor.available && onSwitch && (
        <button className="btn-switch" onClick={() => onSwitch(doctor)}>
          🔄 Switch to Faster Option
        </button>
      )}
    </div>
  );
}
