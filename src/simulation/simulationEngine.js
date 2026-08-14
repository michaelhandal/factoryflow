// src/simulation/simulationEngine.js

/**
 * createSimulationState
 *
 * Builds the initial simulation state: every station starts empty (no
 * queue, no units in progress), the clock is at zero, and nothing has
 * been completed, passed, or rejected yet.
 *
 * @param {object[]} line - array of workstation objects
 * @returns {object} initial simulation state
 */
export function createSimulationState(line) {
  const stations = {};
  for (const station of line) {
    stations[station.id] = { queue: 0, inProgress: [], defectiveCount: 0 };
  }
  return {
    simulatedSeconds: 0,
    timeSinceLastArrival: 0,
    completedCount: 0, // good units that reached the end of the line
    totalDefectiveCount: 0, // units scrapped at any station, across the whole line
    stations,
  };
}

/**
 * stepSimulation
 *
 * Advances the simulation by one tick of dtSeconds. This is a PURE
 * function given a supplied random number generator — same inputs plus
 * same sequence of random draws always produce the same output, which
 * keeps it testable. In normal use, Math.random is passed in.
 *
 * When a unit finishes a station, it has a defectRate chance of being
 * rejected (scrapped) instead of moving to the next station — this is
 * the simulation's one deliberately stochastic element, representing
 * real-world quality variation.
 *
 * @param {object} state - current simulation state
 * @param {object[]} line - array of workstation objects, in process order
 * @param {number} dtSeconds - how many simulated seconds this tick represents
 * @param {number} arrivalIntervalSeconds - seconds between new raw-material
 *   arrivals into the first station (derived from required production rate)
 * @param {() => number} randomFn - random number generator returning [0, 1); defaults to Math.random
 * @returns {object} the new simulation state after this tick
 */
export function stepSimulation(state, line, dtSeconds, arrivalIntervalSeconds, randomFn = Math.random) {
  const stations = {};
  for (const station of line) {
    const prev = state.stations[station.id] || { queue: 0, inProgress: [], defectiveCount: 0 };
    stations[station.id] = {
      queue: prev.queue,
      inProgress: prev.inProgress.map((slot) => ({ ...slot })),
      defectiveCount: prev.defectiveCount,
    };
  }

  let simulatedSeconds = state.simulatedSeconds + dtSeconds;
  let timeSinceLastArrival = state.timeSinceLastArrival;
  let completedCount = state.completedCount;
  let totalDefectiveCount = state.totalDefectiveCount;

  // Feed new raw-material units into the first station at a steady rate.
  if (arrivalIntervalSeconds > 0 && line.length > 0) {
    timeSinceLastArrival += dtSeconds;
    while (timeSinceLastArrival >= arrivalIntervalSeconds) {
      timeSinceLastArrival -= arrivalIntervalSeconds;
      stations[line[0].id].queue += 1;
    }
  }

  // Process each station in line order.
  for (let i = 0; i < line.length; i++) {
    const station = line[i];
    const s = stations[station.id];

    // Advance every unit currently being processed at this station.
    const stillInProgress = [];
    let justCompleted = 0;
    for (const slot of s.inProgress) {
      const remaining = slot.remainingTime - dtSeconds;
      if (remaining <= 0) {
        justCompleted += 1;
      } else {
        stillInProgress.push({ remainingTime: remaining });
      }
    }
    s.inProgress = stillInProgress;

    // Each completed unit is checked against this station's defect rate.
    // Failures are scrapped (removed from the system); passes continue on.
    let goodUnits = 0;
    for (let u = 0; u < justCompleted; u++) {
      if (randomFn() < station.defectRate) {
        s.defectiveCount += 1;
        totalDefectiveCount += 1;
      } else {
        goodUnits += 1;
      }
    }

    if (goodUnits > 0) {
      if (i === line.length - 1) {
        completedCount += goodUnits;
      } else {
        stations[line[i + 1].id].queue += goodUnits;
      }
    }

    // Pull queued units into any free machine slots.
    while (s.inProgress.length < station.machines && s.queue > 0) {
      s.queue -= 1;
      s.inProgress.push({ remainingTime: station.cycleTimeSeconds });
    }
  }

  return { simulatedSeconds, timeSinceLastArrival, completedCount, totalDefectiveCount, stations };
}

/**
 * calculateTotalWIP
 *
 * WIP = every unit currently in the system (waiting in a queue, or being
 * processed) but not yet finished or scrapped. This is a direct count
 * from the live simulation state — not a formula-based estimate.
 *
 * @param {object} state - current simulation state
 * @param {object[]} line - array of workstation objects
 * @returns {number} total units currently in progress across the line
 */
export function calculateTotalWIP(state, line) {
  return line.reduce((sum, station) => {
    const s = state.stations[station.id];
    if (!s) return sum;
    return sum + s.queue + s.inProgress.length;
  }, 0);
}