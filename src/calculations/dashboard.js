// src/calculations/dashboard.js
import { identifyBottleneck } from './bottleneck';
import { calculateLineEfficiency } from './lineEfficiency';
import { calculateLineOEE } from './oee';
import { calculateCostPerUnit } from './cost';

/**
 * calculateThroughput
 *
 * In a sequential production line, the whole line can never sustain a
 * higher output rate than its slowest station (the bottleneck) allows.
 * So line-level throughput equals the bottleneck's effective capacity.
 *
 * @param {object[]} line - array of workstation objects
 * @returns {number} throughput, in units per hour
 */
export function calculateThroughput(line) {
  const bottleneck = identifyBottleneck(line);
  return bottleneck ? bottleneck.effectiveCapacityPerHour : 0;
}

/**
 * calculateAverageCycleTime
 *
 * Simple mean of every station's cycle time. Gives a quick sense of scale
 * for the line, separate from the bottleneck-driven throughput number.
 *
 * @param {object[]} line - array of workstation objects
 * @returns {number} average cycle time, in seconds
 */
export function calculateAverageCycleTime(line) {
  if (!line || line.length === 0) return 0;
  const total = line.reduce((sum, s) => sum + s.cycleTimeSeconds, 0);
  return total / line.length;
}

/**
 * buildDashboardMetrics
 *
 * Aggregates all line-level metrics into one object for the dashboard.
 * `wip` comes from the live simulation engine (Phase 8). `costPerUnit`
 * now comes from the real cost model (Phase 11).
 *
 * @param {object[]} line - array of workstation objects
 * @param {number|null} wip - current work-in-progress from the simulation, or null if unavailable
 * @returns {object} dashboard metrics
 */
export function buildDashboardMetrics(line, wip = null) {
  const bottleneck = identifyBottleneck(line);

  return {
    throughput: calculateThroughput(line),
    productionCapacity: calculateThroughput(line), // same basis for now — see Phase 7 note
    lineEfficiency: calculateLineEfficiency(line),
    oee: calculateLineOEE(line),
    bottleneckName: bottleneck ? bottleneck.name : '—',
    wip,
    averageCycleTime: calculateAverageCycleTime(line),
    costPerUnit: calculateCostPerUnit(line),
  };
}