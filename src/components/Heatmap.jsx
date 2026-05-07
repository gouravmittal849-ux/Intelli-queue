import { crowdLevel, calcWaitTime } from "../utils/queueLogic";

const LEVEL_CONFIG = {
  low: {
    bg: "linear-gradient(135deg, #d4edda, #a8d5b5)",
    border: "#28a745",
    text: "#155724",
    label: "Low",
    icon: "🟢",
  },
  medium: {
    bg: "linear-gradient(135deg, #fff3cd, #ffe08a)",
    border: "#ffc107",
    text: "#856404",
    label: "Medium",
    icon: "🟡",
  },
  high: {
    bg: "linear-gradient(135deg, #f8d7da, #f5a8ae)",
    border: "#dc3545",
    text: "#721c24",
    label: "High",
    icon: "🔴",
  },
};

export default function Heatmap({ doctors }) {
  // Group by department and pick the max queue length per dept
  const deptMap = {};
  doctors.forEach((d) => {
    if (!deptMap[d.department]) {
      deptMap[d.department] = {
        name: d.departmentName,
        totalQueue: 0,
        doctorCount: 0,
        maxSpeed: 0,
      };
    }
    deptMap[d.department].totalQueue += d.queueLength;
    deptMap[d.department].doctorCount += 1;
    deptMap[d.department].maxSpeed = Math.max(
      deptMap[d.department].maxSpeed,
      d.speed
    );
  });

  const departments = Object.entries(deptMap).map(([id, data]) => ({
    id,
    ...data,
    avgQueue: Math.round(data.totalQueue / data.doctorCount),
    waitTime: calcWaitTime(
      Math.round(data.totalQueue / data.doctorCount),
      data.maxSpeed
    ),
  }));

  // Sort by avgQueue descending
  departments.sort((a, b) => b.avgQueue - a.avgQueue);

  return (
    <div className="heatmap-section">
      <div className="section-header">
        <h2>🗺️ Live Crowd Heatmap</h2>
        <p>Real-time department crowd levels</p>
      </div>

      <div className="heatmap-legend">
        {Object.entries(LEVEL_CONFIG).map(([level, cfg]) => (
          <span key={level} className="legend-item">
            {cfg.icon} {cfg.label}
          </span>
        ))}
      </div>

      <div className="heatmap-grid">
        {departments.map((dept) => {
          const level = crowdLevel(dept.avgQueue);
          const cfg = LEVEL_CONFIG[level];
          const barPct = Math.min(100, (dept.avgQueue / 15) * 100);

          return (
            <div
              key={dept.id}
              className="heatmap-card"
              style={{
                background: cfg.bg,
                borderLeft: `4px solid ${cfg.border}`,
              }}
            >
              <div className="heatmap-card-top">
                <div>
                  <h3 style={{ color: cfg.text }}>{dept.name}</h3>
                  <p style={{ color: cfg.text }}>
                    {dept.doctorCount} doctor{dept.doctorCount > 1 ? "s" : ""}
                  </p>
                </div>
                <span
                  className="level-badge"
                  style={{ background: cfg.border, color: "#fff" }}
                >
                  {cfg.icon} {cfg.label}
                </span>
              </div>

              <div className="heatmap-bar-wrap">
                <div
                  className="heatmap-bar"
                  style={{ width: `${barPct}%`, background: cfg.border }}
                />
              </div>

              <div className="heatmap-stats">
                <span>👥 Avg {dept.avgQueue} in queue</span>
                <span>⏱ ~{dept.waitTime} min wait</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
