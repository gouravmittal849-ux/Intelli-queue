// ─── Queue Logic & Calculations ───────────────────────────────────────────────

/**
 * Calculate wait time in minutes
 * wait_time = (queue_length / speed_per_hour) * 60
 */
export function calcWaitTime(queueLength, speed) {
  if (speed <= 0) return Infinity;
  return Math.round((queueLength / speed) * 60);
}

/**
 * Score a doctor for recommendation (lower = better)
 * Score = wait_time with a penalty for unavailability
 */
export function scoreDoctor(doctor) {
  if (!doctor.available) return Infinity;
  return calcWaitTime(doctor.queueLength, doctor.speed);
}

/**
 * Find the best doctor from a list
 */
export function findBestDoctor(doctors) {
  const available = doctors.filter((d) => d.available);
  if (!available.length) return null;
  return available.reduce((best, d) =>
    scoreDoctor(d) < scoreDoctor(best) ? d : best
  );
}

/**
 * Calculate how many minutes a switch would save
 */
export function calcTimeSaved(currentDoctor, targetDoctor) {
  const currentWait = calcWaitTime(currentDoctor.queueLength, currentDoctor.speed);
  const targetWait = calcWaitTime(targetDoctor.queueLength, targetDoctor.speed);
  return Math.max(0, currentWait - targetWait);
}

/**
 * Determine crowd level for heatmap
 */
export function crowdLevel(queueLength) {
  if (queueLength <= 4) return "low";
  if (queueLength <= 9) return "medium";
  return "high";
}

/**
 * Get a human-readable wait status message
 */
export function waitStatusMessage(doctor) {
  const avgWait = calcWaitTime(doctor.queueLength, doctor.speed);
  const baselineWait = calcWaitTime(6, doctor.speed); // baseline: 6 patients
  if (avgWait < baselineWait * 0.8) return "🚀 Running faster than usual";
  if (avgWait > baselineWait * 1.3)
    return `⚠️ Expected delay: +${Math.round(avgWait - baselineWait)} mins`;
  return "✅ On schedule";
}

