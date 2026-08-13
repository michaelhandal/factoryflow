// src/calculations/oee.js

// Performance factor is fixed at 1.0 (100%) in this simplified model.
// Real OEE systems measure Performance as actual speed vs. ideal speed,
// capturing minor stops and slow-running that isn't full downtime.
// Our model doesn't simulate a station running slower than its stated
// cycle time — the cycle time IS the actual speed — so there's no
// separate performance loss to measure yet. This is a deliberate
// simplification, stated openly rather than hidden inside the formula.
const ASSUMED_PERFORMANCE_FACTOR = 1.0;

/**
 * calculateOEE
 *
 * Overall Equipment Effectiveness — combines three types of loss into a
 * single score: time the station wasn't running (Availability), speed
 * lost while running (Performance), and units lost to defects (Quality).
 *
 * Formula: OEE = Availability × Performance × Quality
 *
 * @param {object} station - a workstation object
 * @returns {{ oee: number, availability: number, performance: number, quality: number }}
 *   oee and each factor as fractions (0–1)
 */
export function calculateOEE(station) {
  const availability = station.availability;
  const performance = ASSUMED_PERFORMANCE_FACTOR;
  const quality = 1 - station.defectRate;

  const oee = availability * performance * quality;

  return { oee, availability, performance, quality };
}

/**
 * calculateLineOEE
 *
 * A simple line-level OEE: the average of each station's OEE. This is a
 * simplification — it doesn't weight by how losses compound across a real
 * sequential line — but gives a reasonable single-number summary for the
 * dashboard.
 *
 * @param {object[]} line - array of workstation objects
 * @returns {number} average OEE across all stations, as a fraction
 */
export function calculateLineOEE(line) {
  if (!line || line.length === 0) return 0;
  const total = line.reduce((sum, station) => sum + calculateOEE(station).oee, 0);
  return total / line.length;
}