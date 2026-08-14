// src/calculations/quality.js
import { calculateThroughput } from './dashboard';

/**
 * calculateStationQualityRate
 *
 * The fraction of units that pass a single station without being
 * rejected as defective.
 *
 * Formula: qualityRate = 1 - defectRate
 *
 * @param {object} station - a workstation object
 * @returns {number} quality rate as a fraction (0-1)
 */
export function calculateStationQualityRate(station) {
  return 1 - station.defectRate;
}

/**
 * calculateLineQualityRate
 *
 * A unit must pass EVERY station to become a finished good product.
 * Treating each station's defect chance as an independent event, the
 * probabilities of passing each station multiply together.
 *
 * Formula: lineQualityRate = product of (1 - defectRate) across all stations
 *
 * @param {object[]} line - array of workstation objects
 * @returns {number} overall line quality rate as a fraction (0-1)
 */
export function calculateLineQualityRate(line) {
  if (!line || line.length === 0) return 1;
  return line.reduce((rate, station) => rate * calculateStationQualityRate(station), 1);
}

/**
 * calculateEffectiveThroughput
 *
 * The rate of GOOD units the line produces — throughput adjusted down by
 * how much is lost to defects across the whole line.
 *
 * Formula: effectiveThroughput = throughput x lineQualityRate
 *
 * @param {object[]} line - array of workstation objects
 * @returns {number} effective (good-unit) throughput, in units per hour
 */
export function calculateEffectiveThroughput(line) {
  const throughput = calculateThroughput(line);
  const qualityRate = calculateLineQualityRate(line);
  return throughput * qualityRate;
}