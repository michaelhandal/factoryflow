// src/calculations/taktTime.js

/**
 * calculateTaktTime
 *
 * Takt time is the maximum time allowed per unit to exactly meet customer
 * demand within the available production time. It's the "pace" the line
 * needs to keep — not a measure of what the line CAN do (that's capacity),
 * but what it NEEDS to do.
 *
 * Formula: Takt Time = Available Production Time / Customer Demand
 *
 * @param {number} availableProductionTimeSeconds - total scheduled production time, in seconds
 * @param {number} customerDemandUnits - number of units the customer wants in that time
 * @returns {number} takt time, in seconds per unit
 */
export function calculateTaktTime(availableProductionTimeSeconds, customerDemandUnits) {
  if (!customerDemandUnits || customerDemandUnits <= 0) {
    // Demand of zero (or invalid) makes takt time undefined/meaningless.
    return 0;
  }
  return availableProductionTimeSeconds / customerDemandUnits;
}

/**
 * findTaktTimeProblemStations
 *
 * A station whose cycle time EXCEEDS takt time cannot keep pace with
 * customer demand, regardless of how it compares to other stations on
 * the line. This flags those stations.
 *
 * @param {object[]} line - array of workstation objects
 * @param {number} taktTimeSeconds - the line's takt time
 * @returns {object[]} the subset of stations whose cycleTimeSeconds > taktTimeSeconds
 */
export function findTaktTimeProblemStations(line, taktTimeSeconds) {
  if (!taktTimeSeconds || taktTimeSeconds <= 0) {
    return [];
  }
  return line.filter((station) => station.cycleTimeSeconds > taktTimeSeconds);
}