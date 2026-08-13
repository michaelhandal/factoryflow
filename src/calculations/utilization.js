// src/calculations/utilization.js
import { calculateEffectiveCapacity } from './capacity';

/**
 * calculateRequiredRatePerHour
 *
 * The production rate the line needs to sustain, in units/hour, derived
 * from customer demand and available production time.
 *
 * @param {number} customerDemandUnits - units needed per period
 * @param {number} availableProductionTimeHours - available time per period, in hours
 * @returns {number} required rate, in units per hour
 */
export function calculateRequiredRatePerHour(customerDemandUnits, availableProductionTimeHours) {
  if (!availableProductionTimeHours || availableProductionTimeHours <= 0) {
    return 0;
  }
  return customerDemandUnits / availableProductionTimeHours;
}

/**
 * calculateUtilization
 *
 * How much of a station's effective capacity is being used by the
 * required production rate.
 *
 * Formula: Utilization = Required Rate / Effective Capacity
 *
 * @param {object} station - a workstation object
 * @param {number} requiredRatePerHour - units/hour the line needs to sustain
 * @returns {number} utilization as a fraction (0 = 0%, 1 = 100%, can exceed 1)
 */
export function calculateUtilization(station, requiredRatePerHour) {
  const effectiveCapacity = calculateEffectiveCapacity(station);
  if (effectiveCapacity <= 0) {
    return 0;
  }
  return requiredRatePerHour / effectiveCapacity;
}

/**
 * classifyUtilization
 *
 * Buckets a utilization fraction into a human-readable status, using
 * commonly-used lean manufacturing thresholds. These are a practical
 * rule of thumb, not a strict physical law.
 *
 * @param {number} utilization - fraction (0.5 = 50%)
 * @returns {'underutilized'|'healthy'|'high'|'overloaded'}
 */
export function classifyUtilization(utilization) {
  if (utilization >= 1) return 'overloaded';
  if (utilization >= 0.85) return 'high';
  if (utilization >= 0.5) return 'healthy';
  return 'underutilized';
}