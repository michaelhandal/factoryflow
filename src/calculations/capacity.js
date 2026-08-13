// src/calculations/capacity.js

// SECONDS_PER_HOUR is used to convert a per-unit cycle time (in seconds)
// into an hourly production rate. Defined once here so it's never a
// "magic number" scattered through the codebase.
const SECONDS_PER_HOUR = 3600;

/**
 * calculateTheoreticalCapacity
 *
 * The maximum units/hour a station could produce if it ran perfectly,
 * with zero downtime.
 *
 * Formula: machines × (3600 / cycleTimeSeconds)
 *
 * @param {object} station - a workstation object (see src/data/defaultLine.js)
 * @returns {number} theoretical capacity, in units per hour
 */
export function calculateTheoreticalCapacity(station) {
  if (station.cycleTimeSeconds <= 0) {
    // A station that takes 0 seconds per unit is not physically meaningful.
    // Returning 0 avoids a divide-by-zero (Infinity) breaking downstream math.
    return 0;
  }
  const unitsPerHourPerMachine = SECONDS_PER_HOUR / station.cycleTimeSeconds;
  return station.machines * unitsPerHourPerMachine;
}

/**
 * calculateEffectiveCapacity
 *
 * The realistic units/hour a station can produce, accounting for downtime
 * (availability).
 *
 * Formula: theoreticalCapacity × availability
 *
 * @param {object} station - a workstation object
 * @returns {number} effective capacity, in units per hour
 */
export function calculateEffectiveCapacity(station) {
  const theoretical = calculateTheoreticalCapacity(station);
  return theoretical * station.availability;
}