import { calcWaitTime, calcTimeSaved } from "../utils/queueLogic";

export default function SuggestionEngine({
  bestDoctor,
  currentDoctor,
  onSwitch,
}) {
  if (!bestDoctor || !currentDoctor) return null;

  const isSameDoctor = bestDoctor.id === currentDoctor.id;
  const timeSaved = calcTimeSaved(currentDoctor, bestDoctor);
  const currentWait = calcWaitTime(currentDoctor.queueLength, currentDoctor.speed);
  const bestWait = calcWaitTime(bestDoctor.queueLength, bestDoctor.speed);

  return (
    <div className="suggestion-engine">
      <div className="suggestion-header">
        <span className="suggestion-icon">🧠</span>
        <div>
          <h2>Smart Suggestion Engine</h2>
          <p>AI-powered queue optimization (simulated)</p>
        </div>
      </div>

      {isSameDoctor ? (
        <div className="suggestion-ok">
          <span className="ok-icon">✅</span>
          <div>
            <strong>You're already with the best doctor!</strong>
            <p>
              {currentDoctor.name} has the shortest wait time of{" "}
              <strong>{currentWait} mins</strong>.
            </p>
          </div>
        </div>
      ) : (
        <div className="suggestion-alert">
          <div className="suggestion-compare">
            <div className="compare-box current">
              <p className="compare-label">Current Doctor</p>
              <p className="compare-name">{currentDoctor.name}</p>
              <p className="compare-dept">{currentDoctor.departmentName}</p>
              <p className="compare-wait">{currentWait} mins wait</p>
              <p className="compare-queue">{currentDoctor.queueLength} in queue</p>
            </div>

            <div className="compare-arrow">
              <span>→</span>
              <span className="save-tag">Save {timeSaved} mins</span>
            </div>

            <div className="compare-box best">
              <p className="compare-label">⭐ Recommended</p>
              <p className="compare-name">{bestDoctor.name}</p>
              <p className="compare-dept">{bestDoctor.departmentName}</p>
              <p className="compare-wait">{bestWait} mins wait</p>
              <p className="compare-queue">{bestDoctor.queueLength} in queue</p>
            </div>
          </div>

          <button className="btn-switch-main" onClick={() => onSwitch(bestDoctor)}>
            🔄 Switch to {bestDoctor.name} — Save {timeSaved} mins
          </button>
        </div>
      )}
    </div>
  );
}
