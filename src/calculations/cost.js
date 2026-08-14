// src/calculations/cost.js
import { calculateThroughput } from './dashboard';
import { calculateEffectiveThroughput } from './quality';

/**
 * calculateTotalCostPerHour
 *
 * Sum of every station's machine and labor cost. This is a FIXED hourly
 * cost in our model — it doesn't scale with units produced, since we
 * don't track a separate material cost per unit (not in our data model;
 * noted as a future improvement).
 *
 * @param {object[]} line - array of workstation objects
 * @returns {number} total operating cost, in dollars per hour
 */
export function calculateTotalCostPerHour(line) {
  return line.reduce(
    (sum, station) => sum + station.machineCostPerHour + station.laborCostPerHour,
    0
  );
}

/**
 * calculateCostPerUnit
 *
 * Total hourly cost spread across every unit the line ATTEMPTS to produce
 * (throughput), regardless of whether that unit turns out defective.
 *
 * Formula: costPerUnit = totalCostPerHour / throughput
 *
 * @param {object[]} line - array of workstation objects
 * @returns {number} cost per attempted unit, in dollars
 */
export function calculateCostPerUnit(line) {
  const throughput = calculateThroughput(line);
  if (throughput <= 0) return 0;
  return calculateTotalCostPerHour(line) / throughput;
}

/**
 * calculateCostPerGoodUnit
 *
 * Total hourly cost spread across only the GOOD (non-defective) units the
 * line produces. This is the more meaningful real-world cost figure, since
 * scrapped units still cost money but generate no sellable output.
 *
 * Formula: costPerGoodUnit = totalCostPerHour / effectiveThroughput
 *
 * @param {object[]} line - array of workstation objects
 * @returns {number} cost per good unit, in dollars
 */
export function calculateCostPerGoodUnit(line) {
  const effectiveThroughput = calculateEffectiveThroughput(line);
  if (effectiveThroughput <= 0) return 0;
  return calculateTotalCostPerHour(line) / effectiveThroughput;
}

/**
 * calculateDefectCostPerHour
 *
 * The portion of hourly spend effectively wasted on units that end up
 * scrapped rather than sold.
 *
 * Formula: defectCost = costPerUnit x (throughput - effectiveThroughput)
 *
 * @param {object[]} line - array of workstation objects
 * @returns {number} cost of defects, in dollars per hour
 */
export function calculateDefectCostPerHour(line) {
  const throughput = calculateThroughput(line);
  const effectiveThroughput = calculateEffectiveThroughput(line);
  const costPerUnit = calculateCostPerUnit(line);
  return costPerUnit * (throughput - effectiveThroughput);
}

/**
 * buildCostBreakdown
 *
 * Aggregates all cost figures, plus a per-station breakdown (useful for
 * a cost chart later in Phase 15).
 *
 * @param {object[]} line - array of workstation objects
 * @returns {object} full cost breakdown
 */
export function buildCostBreakdown(line) {
  return {
    totalCostPerHour: calculateTotalCostPerHour(line),
    costPerUnit: calculateCostPerUnit(line),
    costPerGoodUnit: calculateCostPerGoodUnit(line),
    defectCostPerHour: calculateDefectCostPerHour(line),
    perStation: line.map((station) => ({
      id: station.id,
      name: station.name,
      machineCostPerHour: station.machineCostPerHour,
      laborCostPerHour: station.laborCostPerHour,
      totalCostPerHour: station.machineCostPerHour + station.laborCostPerHour,
    })),
  };
}