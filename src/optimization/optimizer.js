// src/optimization/optimizer.js
import { calculateThroughput } from '../calculations/dashboard';
import { calculateCostPerUnit } from '../calculations/cost';
import { calculateLineEfficiency } from '../calculations/lineEfficiency';
import { calculateEffectiveCapacity } from '../calculations/capacity';

const MAX_ROUNDS = 3;
const CYCLE_TIME_REDUCTION_FACTOR = 0.9; // -10%
const AVAILABILITY_IMPROVEMENT = 0.03; // +3 percentage points
const MAX_AVAILABILITY = 0.99;

// Each objective defines how to SCORE a line, and whether higher or lower
// is better — this is the only place objective-specific logic lives, so
// adding a new objective later means adding one entry here.
const OBJECTIVES = {
  throughput: {
    label: 'Maximum Throughput',
    score: (line) => calculateThroughput(line),
    higherIsBetter: true,
  },
  cost: {
    label: 'Minimum Cost per Unit',
    score: (line) => calculateCostPerUnit(line),
    higherIsBetter: false,
  },
  balance: {
    label: 'Balanced Production Line',
    score: (line) => calculateLineEfficiency(line),
    higherIsBetter: true,
  },
};

/**
 * generateCandidateMoves
 *
 * Builds the full list of single changes the optimizer is allowed to try
 * this round, one per (station, move type) combination.
 *
 * @param {object[]} line - current production line
 * @returns {object[]} candidate moves, each with a description and an apply() function
 */
function generateCandidateMoves(line) {
  const candidates = [];

  line.forEach((station, index) => {
    // Move 1: add a machine
    candidates.push({
      stationId: station.id,
      stationName: station.name,
      description: `Add 1 machine to ${station.name}`,
      apply: (l) => l.map((s, i) => (i === index ? { ...s, machines: s.machines + 1 } : s)),
      costDelta: () => station.machineCostPerHour, // rough estimate: one more machine's worth of cost
    });

    // Move 2: reduce cycle time by 10% (process improvement)
    candidates.push({
      stationId: station.id,
      stationName: station.name,
      description: `Reduce ${station.name}'s cycle time by 10% (process improvement)`,
      apply: (l) => l.map((s, i) =>
        i === index ? { ...s, cycleTimeSeconds: s.cycleTimeSeconds * CYCLE_TIME_REDUCTION_FACTOR } : s
      ),
      costDelta: () => 0,
    });

    // Move 3: improve availability by 3 points (capped at 99%)
    if (station.availability < MAX_AVAILABILITY) {
      candidates.push({
        stationId: station.id,
        stationName: station.name,
        description: `Improve ${station.name}'s availability by 3 percentage points (reliability improvement)`,
        apply: (l) => l.map((s, i) =>
          i === index
            ? { ...s, availability: Math.min(s.availability + AVAILABILITY_IMPROVEMENT, MAX_AVAILABILITY) }
            : s
        ),
        costDelta: () => 0,
      });
    }

    // Move 4: add a worker, only when clearly understaffed relative to machines
    // (a realistic staffing fix, not a capacity lever in our current model).
    if (station.workers < station.machines) {
      candidates.push({
        stationId: station.id,
        stationName: station.name,
        description: `Add 1 worker to ${station.name} (currently understaffed relative to machine count)`,
        apply: (l) => l.map((s, i) => (i === index ? { ...s, workers: s.workers + 1 } : s)),
        costDelta: () => station.laborCostPerHour / Math.max(station.workers, 1),
      });
    }
  });

  return candidates;
}

/**
 * runOptimization
 *
 * Runs the greedy local search: each round, tries every candidate move,
 * keeps whichever single move most improves the chosen objective, and
 * repeats for up to MAX_ROUNDS rounds (stopping early if no move helps).
 *
 * @param {object[]} initialLine - the starting production line
 * @param {'throughput'|'cost'|'balance'} objectiveKey - which objective to optimize for
 * @returns {{ finalLine: object[], steps: object[], objectiveLabel: string }}
 *   steps is an ordered array of applied changes, each with a full
 *   before/after explanation for the UI.
 */
export function runOptimization(initialLine, objectiveKey) {
  const objective = OBJECTIVES[objectiveKey];
  let currentLine = initialLine;
  const steps = [];

  for (let round = 0; round < MAX_ROUNDS; round++) {
    const currentScore = objective.score(currentLine);
    const candidates = generateCandidateMoves(currentLine);

    let bestCandidate = null;
    let bestScore = currentScore;
    let bestLine = null;

    for (const candidate of candidates) {
      const trialLine = candidate.apply(currentLine);
      const trialScore = objective.score(trialLine);

      const improved = objective.higherIsBetter
        ? trialScore > bestScore
        : trialScore < bestScore;

      if (improved) {
        bestScore = trialScore;
        bestCandidate = candidate;
        bestLine = trialLine;
      }
    }

    // No candidate improved the objective this round — stop early.
    if (!bestCandidate) break;

    const beforeStation = currentLine.find((s) => s.id === bestCandidate.stationId);
    const afterStation = bestLine.find((s) => s.id === bestCandidate.stationId);

    steps.push({
      round: round + 1,
      description: bestCandidate.description,
      stationName: bestCandidate.stationName,
      beforeCapacity: calculateEffectiveCapacity(beforeStation),
      afterCapacity: calculateEffectiveCapacity(afterStation),
      beforeScore: currentScore,
      afterScore: bestScore,
      estimatedCostDelta: bestCandidate.costDelta(),
    });

    currentLine = bestLine;
  }

  return { finalLine: currentLine, steps, objectiveLabel: objective.label };
}

export { OBJECTIVES };