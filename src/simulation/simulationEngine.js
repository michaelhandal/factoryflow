// src/simulation/simulationEngine.js

/**
 * createSimulationState
 *
 * Builds the initial simulation state: every station starts empty (no
 * queue, no units in progress), the clock is at zero, and nothing has
 * been completed yet.
 *
 * @param {object[]} line - array of workstation objects
 * @returns {object} initial simulation state
 */
export function createSimulationState(line) {
  const stations = {};
  for (const station of line) {
    stations[station.id] = { queue: 0, inProgress: [] };
  }
  return {
    simulatedSeconds: 0,
    timeSinceLastArrival: 0,
    completedCount: 0,
    stations,
  };
}

/**
 * stepSimulation
 *
 * Advances the simulation by one tick of dtSeconds. This is a PURE
 * function — given the same inputs it always returns the same new state,
 * with no side effects. That makes it easy to test independently of React.
 *
 * @param {object} state - current simulation state
 * @param {object[]} line - array of workstation objects, in process order
 * @param {number} dtSeconds - how many simulated seconds this tick represents
 * @param {number} arrivalIntervalSeconds - seconds between new raw-material
 *   arrivals into the first station (derived from required production rate)
 * @returns {object} the new simulation state after this tick
 */
export function stepSimulation(state, line, dtSeconds, arrivalIntervalSeconds) {
  // Copy every station's queue/inProgress so we never mutate the old state.
  const stations = {};
  for (const station of line) {
    const prev = state.stations[station.id] || { queue: 0, inProgress: [] };
    stations[station.id] = {
      queue: prev.queue,
      inProgress: prev.inProgress.map((slot) => ({ ...slot })),
    };
  }

  let simulatedSeconds = state.simulatedSeconds + dtSeconds;
  let timeSinceLastArrival = state.timeSinceLastArrival;
  let completedCount = state.completedCount;

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

    // Completed units move to the next station's queue, or finish the line.
    if (justCompleted > 0) {
      if (i === line.length - 1) {
        completedCount += justCompleted;
      } else {
        stations[line[i + 1].id].queue += justCompleted;
      }
    }

    // Pull queued units into any free machine slots.
    while (s.inProgress.length < station.machines && s.queue > 0) {
      s.queue -= 1;
      s.inProgress.push({ remainingTime: station.cycleTimeSeconds });
    }
  }

  return { simulatedSeconds, timeSinceLastArrival, completedCount, stations };
}

/**
 * calculateTotalWIP
 *
 * WIP = every unit currently in the system (waiting in a queue, or being
 * processed) but not yet finished. This is a direct count from the live
 * simulation state — not a formula-based estimate.
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