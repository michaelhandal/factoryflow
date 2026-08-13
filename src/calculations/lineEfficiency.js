// src/calculations/lineEfficiency.js

/**
 * calculateTotalWorkContent
 *
 * Sum of cycle times across every station — the total processing time
 * required to fully produce one unit through the whole line.
 *
 * @param {object[]} line - array of workstation objects
 * @returns {number} total work content, in seconds
 */
export function calculateTotalWorkContent(line) {
  return line.reduce((sum, station) => sum + station.cycleTimeSeconds, 0);
}

/**
 * calculateLineEfficiency
 *
 * Measures how well work is balanced across the line, by comparing the
 * actual total work content against the "ideal" scenario where every
 * station took exactly as long as the slowest station.
 *
 * Formula: Line Efficiency = Total Work Content / (Stations × Slowest Cycle Time)
 *
 * Note: this uses raw cycle time (not effective capacity) — line balancing
 * is about how processing TIME is distributed across stations, independent
 * of machine count or availability.
 *
 * @param {object[]} line - array of workstation objects
 * @returns {number} line efficiency as a fraction (1.0 = perfectly balanced)
 */
export function calculateLineEfficiency(line) {
  if (!line || line.length === 0) {
    return 0;
  }

  const totalWorkContent = calculateTotalWorkContent(line);
  const slowestCycleTime = Math.max(...line.map((s) => s.cycleTimeSeconds));

  if (slowestCycleTime <= 0) {
    return 0;
  }

  const idealTotalTime = line.length * slowestCycleTime;
  return totalWorkContent / idealTotalTime;
}