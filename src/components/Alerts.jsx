import { useEffect, useState } from "react";

const ALERT_TYPES = {
  info: { bg: "#d1ecf1", border: "#bee5eb", text: "#0c5460", icon: "ℹ️" },
  warning: { bg: "#fff3cd", border: "#ffeeba", text: "#856404", icon: "⚠️" },
  success: { bg: "#d4edda", border: "#c3e6cb", text: "#155724", icon: "✅" },
  danger: { bg: "#f8d7da", border: "#f5c6cb", text: "#721c24", icon: "🚨" },
};

export default function Alerts({ alerts, onDismiss }) {
  const [visible, setVisible] = useState({});

  useEffect(() => {
    const init = {};
    alerts.forEach((a) => (init[a.id] = true));
    setVisible(init);
  }, [alerts]);

  const dismiss = (id) => {
    setVisible((prev) => ({ ...prev, [id]: false }));
    if (onDismiss) onDismiss(id);
  };

  const activeAlerts = alerts.filter((a) => visible[a.id]);

  if (!activeAlerts.length) {
    return (
      <div className="alerts-section">
        <div className="section-header">
          <h2>🔔 Smart Alerts</h2>
          <p>System notifications</p>
        </div>
        <div className="no-alerts">
          <span>🎉</span>
          <p>No active alerts — all clear!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="alerts-section">
      <div className="section-header">
        <h2>🔔 Smart Alerts</h2>
        <p>{activeAlerts.length} active notification{activeAlerts.length > 1 ? "s" : ""}</p>
      </div>

      <div className="alerts-list">
        {activeAlerts.map((alert) => {
          const cfg = ALERT_TYPES[alert.type] || ALERT_TYPES.info;
          return (
            <div
              key={alert.id}
              className="alert-item"
              style={{
                background: cfg.bg,
                borderLeft: `4px solid ${cfg.border}`,
                color: cfg.text,
              }}
            >
              <div className="alert-content">
                <span className="alert-icon">{cfg.icon}</span>
                <div>
                  {alert.title && (
                    <p className="alert-title">{alert.title}</p>
                  )}
                  <p className="alert-msg">{alert.message}</p>
                  <p className="alert-time">{alert.time}</p>
                </div>
              </div>
              <button
                className="alert-dismiss"
                onClick={() => dismiss(alert.id)}
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
