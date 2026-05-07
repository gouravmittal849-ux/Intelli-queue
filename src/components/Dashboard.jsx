import { calcWaitTime, crowdLevel } from "../utils/queueLogic";

export default function Dashboard({ doctors, myPatient, currentDoctor }) {
  const totalPatients = doctors.reduce((s, d) => s + d.queueLength, 0);
  const availableDoctors = doctors.filter((d) => d.available).length;
  const avgWait =
    doctors.length > 0
      ? Math.round(
          doctors
            .filter((d) => d.available)
            .reduce((s, d) => s + calcWaitTime(d.queueLength, d.speed), 0) /
            Math.max(1, availableDoctors)
        )
      : 0;

  const highCrowdDepts = [
    ...new Set(
      doctors
        .filter((d) => crowdLevel(d.queueLength) === "high")
        .map((d) => d.departmentName)
    ),
  ];

  const myWait = currentDoctor
    ? calcWaitTime(
        Math.max(0, myPatient.positionInQueue - 1),
        currentDoctor.speed
      )
    : "--";

  const stats = [
    {
      label: "Total Patients Waiting",
      value: totalPatients,
      icon: "👥",
      color: "#3498db",
      sub: "across all departments",
    },
    {
      label: "Available Doctors",
      value: `${availableDoctors}/${doctors.length}`,
      icon: "👨‍⚕️",
      color: "#2ecc71",
      sub: "currently on duty",
    },
    {
      label: "Avg Wait Time",
      value: `${avgWait} min`,
      icon: "⏱",
      color: "#f39c12",
      sub: "hospital-wide average",
    },
    {
      label: "Your Wait Time",
      value: `${myWait} min`,
      icon: "🎫",
      color: "#9b59b6",
      sub: `Token ${myPatient.tokenNumber}`,
    },
  ];

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2>📊 Dashboard Overview</h2>
        <p>Live hospital statistics</p>
      </div>

      <div className="stats-cards">
        {stats.map((s, i) => (
          <div key={i} className="stat-card" style={{ borderTop: `4px solid ${s.color}` }}>
            <div className="stat-card-icon" style={{ color: s.color }}>
              {s.icon}
            </div>
            <div className="stat-card-body">
              <p className="stat-card-label">{s.label}</p>
              <p className="stat-card-value" style={{ color: s.color }}>
                {s.value}
              </p>
              <p className="stat-card-sub">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {highCrowdDepts.length > 0 && (
        <div className="crowd-warning">
          <span>🔴</span>
          <p>
            High crowd in:{" "}
            <strong>{highCrowdDepts.join(", ")}</strong> — consider switching
            departments if possible.
          </p>
        </div>
      )}
    </div>
  );
}
