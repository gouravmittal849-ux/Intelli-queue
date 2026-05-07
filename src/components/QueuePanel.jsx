import { calcWaitTime } from "../utils/queueLogic";

export default function QueuePanel({
  myPatient,
  currentDoctor,
  isEmergency,
  onEmergencyToggle,
}) {
  if (!currentDoctor) return null;

  const waitMins = calcWaitTime(
    Math.max(0, myPatient.positionInQueue - 1),
    currentDoctor.speed
  );

  const progressPct = Math.max(
    5,
    Math.min(95, ((10 - myPatient.positionInQueue) / 10) * 100)
  );

  const checkInMins = Math.round(
    (Date.now() - myPatient.checkInTime.getTime()) / 60000
  );

  return (
    <div className="queue-panel">
      <div className="queue-panel-header">
        <h2>🎫 Your Queue Status</h2>
      </div>

      {/* Token info */}
      <div className="token-row">
        <div className="token-box">
          <p className="token-label">Token</p>
          <p className="token-value">{myPatient.tokenNumber}</p>
        </div>
        <div className="token-box">
          <p className="token-label">Position</p>
          <p className="token-value highlight">
            #{isEmergency ? 1 : myPatient.positionInQueue}
          </p>
        </div>
        <div className="token-box">
          <p className="token-label">Est. Wait</p>
          <p className="token-value">{isEmergency ? "0" : waitMins} mins</p>
        </div>
        <div className="token-box">
          <p className="token-label">Checked In</p>
          <p className="token-value">{checkInMins} mins ago</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-section">
        <div className="progress-label">
          <span>Queue Progress</span>
          <span>{Math.round(progressPct)}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Doctor info */}
      <div className="assigned-doctor">
        <div className="avatar sm">{currentDoctor.avatar}</div>
        <div>
          <p className="assigned-label">Assigned Doctor</p>
          <p className="assigned-name">{currentDoctor.name}</p>
          <p className="assigned-dept">{currentDoctor.departmentName}</p>
        </div>
      </div>

      {/* Emergency override */}
      {isEmergency && (
        <div className="emergency-banner">
          🚨 Emergency Override Active — You are now #1 in queue
        </div>
      )}

      {/* Action buttons */}
      <div className="queue-actions">
        <button
          className={`btn-action ${isEmergency ? "btn-emergency-off" : "btn-emergency"}`}
          onClick={onEmergencyToggle}
        >
          {isEmergency ? "🔕 Cancel Emergency" : "🚨 Emergency Priority"}
        </button>
      </div>
    </div>
  );
}
