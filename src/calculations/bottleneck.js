// src/calculations/bottleneck.js
import { calculateEffectiveCapacity } from './capacity';

/**
 * identifyBottleneck
 *
 * Finds the workstation with the lowest effective capacity — the station
 * that caps how fast the entire line can produce, since no station can
 * output faster than what feeds into it, and nothing downstream can exceed
 * what the bottleneck lets through.
 *
 * @param {object[]} line - array of workstation objects
 * @returns {object|null} the bottleneck station (with an added
 *   `effectiveCapacityPerHour` field for convenience), or null if the line
 *   is empty
 */
export function identifyBottleneck(line) {
  if (!line || line.length === 0) {
    return null;
  }

  let bottleneck = null;
  let lowestCapacity = Infinity;

  for (const station of line) {
    const capacity = calculateEffectiveCapacity(station);
    if (capacity < lowestCapacity) {
      lowestCapacity = capacity;
      bottleneck = station;
    }
  }

  return {
    ...bottleneck,
    effectiveCapacityPerHour: lowestCapacity,
  };
}