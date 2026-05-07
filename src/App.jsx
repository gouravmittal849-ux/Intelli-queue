// Import useState hook from React to manage state in the component
import { useState } from "react";

// Import mock data - list of doctors and current patient info
import { INITIAL_DOCTORS, MY_PATIENT } from "./data/mockData";

// Import helper functions for queue calculations
import { findBestDoctor, calcTimeSaved, calcWaitTime } from "./utils/queueLogic";

// Import all page components
import Dashboard from "./components/Dashboard";
import DoctorCard from "./components/DoctorCard";
import SuggestionEngine from "./components/SuggestionEngine";
import QueuePanel from "./components/QueuePanel";
import Heatmap from "./components/Heatmap";
import Alerts from "./components/Alerts";

// Import CSS styles
import "./App.css";

// This counter helps give each new alert a unique id
let alertIdCounter = 10;

// Helper function to create a new alert object
function makeAlert(type, title, message) {
  return {
    id: ++alertIdCounter,   // unique id each time
    type,                   // "info", "warning", "success", or "danger"
    title,
    message,
    time: new Date().toLocaleTimeString(), // current time as string
  };
}

// Navigation menu items shown in the sidebar
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "doctors",   label: "Doctors",   icon: "👨‍⚕️" },
  { id: "queue",     label: "My Queue",  icon: "🎫" },
  { id: "heatmap",   label: "Heatmap",   icon: "🗺️" },
  { id: "alerts",    label: "Alerts",    icon: "🔔" },
];

// Main App component - this is the root of the whole website
export default function App() {

  // activeTab stores which page is currently open (default: "dashboard")
  const [activeTab, setActiveTab] = useState("dashboard");

  // doctors stores the list of all doctors (loaded from mockData)
  const doctors = INITIAL_DOCTORS;

  // myPatient stores the current logged-in patient's info
  const [myPatient, setMyPatient] = useState(MY_PATIENT);

  // isEmergency tracks whether emergency mode is ON or OFF
  const [isEmergency, setIsEmergency] = useState(false);

  // alerts stores the list of notification messages shown to the patient
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "info",
      title: "Queue Update",
      message: "You are 5th in line. Please be ready.",
      time: new Date().toLocaleTimeString(),
    },
    {
      id: 2,
      type: "warning",
      title: "Arrival Reminder",
      message: "Please reach the hospital in the next 10 minutes.",
      time: new Date().toLocaleTimeString(),
    },
    {
      id: 3,
      type: "success",
      title: "Check-in Confirmed",
      message: `Token ${MY_PATIENT.tokenNumber} successfully registered.`,
      time: new Date().toLocaleTimeString(),
    },
  ]);

  // Find the doctor assigned to the current patient
  const currentDoctor = doctors.find((d) => d.id === myPatient.assignedDoctorId);

  // Find the best (shortest wait) doctor from all doctors
  const bestDoctor = findBestDoctor(doctors);

  // --- FUNCTIONS (Event Handlers) ---

  // Add a new alert to the top of the alerts list (max 10 alerts kept)
  function addAlert(newAlert) {
    setAlerts(function(prevAlerts) {
      return [newAlert, ...prevAlerts].slice(0, 10);
    });
  }

  // Called when patient clicks "Switch Doctor" button
  function handleSwitch(targetDoctor) {
    // Calculate how many minutes will be saved by switching
    const saved = calcTimeSaved(currentDoctor, targetDoctor);

    // Update patient's assigned doctor and their new position in queue
    setMyPatient(function(prev) {
      return {
        ...prev,                                      // keep all old values
        assignedDoctorId: targetDoctor.id,            // update doctor
        positionInQueue: targetDoctor.queueLength + 1 // join at end of new queue
      };
    });

    // Show a success alert about the switch
    addAlert(makeAlert(
      "success",
      "Doctor Switched",
      "Switched to " + targetDoctor.name + ". You saved ~" + saved + " minutes!"
    ));

    // Go to the Queue page automatically
    setActiveTab("queue");
  }

  // Called when patient clicks the Emergency button
  function handleEmergencyToggle() {
    const turningOn = !isEmergency; // flip the current value
    setIsEmergency(turningOn);

    if (turningOn) {
      // Move patient to position 1 (front of queue)
      setMyPatient(function(prev) {
        return { ...prev, positionInQueue: 1 };
      });
      addAlert(makeAlert(
        "danger",
        "Emergency Override Active",
        "You have been moved to the front of the queue."
      ));
    } else {
      addAlert(makeAlert("info", "Emergency Cancelled", "Queue order restored."));
    }
  }

  // Called when patient clicks the X button on an alert to remove it
  function handleDismissAlert(id) {
    setAlerts(function(prevAlerts) {
      return prevAlerts.filter(function(a) { return a.id !== id; });
    });
  }

  // Count of current alerts (shown as badge on sidebar)
  const unreadAlerts = alerts.length;

  // --- RENDER (What gets shown on screen) ---
  return (
    <div className="app">

      {/* ── LEFT SIDEBAR ── */}
      <aside className="sidebar">

        {/* App logo and name */}
        <div className="sidebar-brand">
          <span className="brand-icon">🏥</span>
          <div>
            <h1>SmartQueue</h1>
            <p>Hospital Management</p>
          </div>
        </div>

        {/* Navigation buttons */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(function(item) {
            return (
              <button
                key={item.id}
                className={"nav-item " + (activeTab === item.id ? "active" : "")}
                onClick={function() { setActiveTab(item.id); }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>

                {/* Show red badge with count only on Alerts tab */}
                {item.id === "alerts" && unreadAlerts > 0 && (
                  <span className="nav-badge">{unreadAlerts}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Patient info at bottom of sidebar */}
        <div className="sidebar-footer">
          <div className="patient-chip">
            <span className="patient-avatar">👤</span>
            <div>
              <p className="patient-name">Patient</p>
              <p className="patient-token">{myPatient.tokenNumber}</p>
            </div>
          </div>
        </div>

      </aside>

      {/* ── RIGHT MAIN CONTENT ── */}
      <main className="main-content">

        {/* Top header bar */}
        <header className="top-bar">
          <div>
            {/* Show the icon and name of the current active page */}
            <h2 className="page-title">
              {NAV_ITEMS.find(function(n) { return n.id === activeTab; })?.icon}{" "}
              {NAV_ITEMS.find(function(n) { return n.id === activeTab; })?.label}
            </h2>
            <p className="page-sub">Last updated: {new Date().toLocaleTimeString()}</p>
          </div>

          <div className="top-bar-right">
            {/* Show emergency badge only when emergency is ON */}
            {isEmergency && (
              <span className="emergency-chip">🚨 Emergency Active</span>
            )}
          </div>
        </header>

        {/* Page content area - shows different component based on activeTab */}
        <div className="content-area">

          {/* DASHBOARD PAGE */}
          {activeTab === "dashboard" && (
            <>
              <Dashboard
                doctors={doctors}
                myPatient={myPatient}
                currentDoctor={currentDoctor}
              />
              <SuggestionEngine
                bestDoctor={bestDoctor}
                currentDoctor={currentDoctor}
                onSwitch={handleSwitch}
              />
            </>
          )}

          {/* DOCTORS PAGE */}
          {activeTab === "doctors" && (
            <div className="doctors-section">
              <div className="section-header">
                <h2>👨‍⚕️ All Doctors</h2>
                <p>{doctors.filter(function(d) { return d.available; }).length} available now</p>
              </div>
              <div className="doctors-grid">
                {doctors.map(function(doc) {
                  return (
                    <DoctorCard
                      key={doc.id}
                      doctor={doc}
                      isRecommended={bestDoctor?.id === doc.id}
                      isCurrent={currentDoctor?.id === doc.id}
                      timeSaved={
                        bestDoctor?.id === doc.id && currentDoctor
                          ? calcTimeSaved(currentDoctor, doc)
                          : 0
                      }
                      onSwitch={handleSwitch}
                      myPosition={
                        currentDoctor?.id === doc.id
                          ? myPatient.positionInQueue
                          : null
                      }
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* QUEUE PAGE */}
          {activeTab === "queue" && (
            <div className="queue-section">
              <QueuePanel
                myPatient={myPatient}
                currentDoctor={currentDoctor}
                isEmergency={isEmergency}
                onEmergencyToggle={handleEmergencyToggle}
              />

              {/* Doctor performance stats - only shown if a doctor is assigned */}
              {currentDoctor && (
                <div className="doctor-perf-card">
                  <h3>📈 Doctor Performance Insights</h3>
                  <div className="perf-grid">
                    <div className="perf-item">
                      <p className="perf-label">Avg Consultation Time</p>
                      <p className="perf-val">{currentDoctor.avgConsultTime} mins</p>
                    </div>
                    <div className="perf-item">
                      <p className="perf-label">Patients Handled Today</p>
                      <p className="perf-val">{currentDoctor.patientsToday}</p>
                    </div>
                    <div className="perf-item">
                      <p className="perf-label">Consultation Speed</p>
                      <p className="perf-val">{currentDoctor.speed}/hr</p>
                    </div>
                    <div className="perf-item">
                      <p className="perf-label">Experience</p>
                      <p className="perf-val">{currentDoctor.experience}</p>
                    </div>
                    <div className="perf-item">
                      <p className="perf-label">Current Queue</p>
                      <p className="perf-val">{currentDoctor.queueLength} patients</p>
                    </div>
                    <div className="perf-item">
                      <p className="perf-label">Est. Wait Time</p>
                      <p className="perf-val">
                        {calcWaitTime(currentDoctor.queueLength, currentDoctor.speed)} mins
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* HEATMAP PAGE */}
          {activeTab === "heatmap" && (
            <Heatmap doctors={doctors} />
          )}

          {/* ALERTS PAGE */}
          {activeTab === "alerts" && (
            <Alerts alerts={alerts} onDismiss={handleDismissAlert} />
          )}

        </div>
      </main>

    </div>
  );
}
