// src/calculations/scenarioMetrics.js
import { calculateThroughput, calculateAverageCycleTime } from './dashboard';
import { calculateLineEfficiency } from './lineEfficiency';
import { calculateLineOEE } from './oee';
import { calculateCostPerUnit } from './cost';
import { identifyBottleneck } from './bottleneck';

/**
 * calculateScenarioMetrics
 *
 * Computes the standard comparison metrics for a single production line
 * (used for both saved scenarios and the current live line), reusing all
 * of our existing calculation functions. Nothing here is scenario-specific
 * math — it's just a convenience bundle for the comparison table.
 *
 * @param {object[]} line - a production line (current or saved)
 * @returns {object} key comparison metrics
 */
export function calculateScenarioMetrics(line) {
  const bottleneck = identifyBottleneck(line);
  return {
    throughput: calculateThroughput(line),
    lineEfficiency: calculateLineEfficiency(line),
    oee: calculateLineOEE(line),
    costPerUnit: calculateCostPerUnit(line),
    averageCycleTime: calculateAverageCycleTime(line),
    bottleneckName: bottleneck ? bottleneck.name : '—',
    stationCount: line.length,
  };
}