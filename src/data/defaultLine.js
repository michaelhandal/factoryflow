// src/data/defaultLine.js

// This file defines the SHAPE of a workstation, and gives us a starting
// example production line to develop and test against.

// ---- WORKSTATION SHAPE ----
// {
//   id: string              — unique identifier, e.g. "station-1"
//   name: string             — display name, e.g. "Cutting"
//   processType: string      — free-text description, e.g. "Manual + CNC"
//   cycleTimeSeconds: number — time to process ONE unit at this station, in seconds
//   machines: number         — number of parallel machines at this station
//   workers: number          — number of workers assigned to this station
//   availability: number     — fraction of scheduled time the station is actually running, 0–1
//                               (accounts for breakdowns, changeovers, minor stops)
//   defectRate: number       — fraction of units that fail QC at this station, 0–1
//   machineCostPerHour: number — operating cost of running the machines, $/hour
//   laborCostPerHour: number   — cost of the workers assigned here, $/hour (combined, not per worker)
// }
//
// We deliberately do NOT store calculated values (like capacity or utilization)
// on the workstation object itself. Those are always DERIVED from these raw
// inputs by functions in src/calculations/ — never hand-entered or hard-coded.
// This guarantees the dashboard can never show a stale or inconsistent number.

export function createDefaultLine() {
  return [
    {
      id: 'station-1',
      name: 'Cutting',
      processType: 'CNC Cutting',
      cycleTimeSeconds: 30,
      machines: 2,
      workers: 1,
      availability: 0.95,
      defectRate: 0.01,
      machineCostPerHour: 40,
      laborCostPerHour: 25,
    },
    {
      id: 'station-2',
      name: 'Drilling',
      processType: 'Manual Drilling',
      cycleTimeSeconds: 45,
      machines: 1,
      workers: 1,
      availability: 0.90,
      defectRate: 0.015,
      machineCostPerHour: 20,
      laborCostPerHour: 25,
    },
    {
      id: 'station-3',
      name: 'Assembly',
      processType: 'Manual Assembly',
      cycleTimeSeconds: 70,
      machines: 2,
      workers: 2,
      availability: 0.92,
      defectRate: 0.02,
      machineCostPerHour: 15,
      laborCostPerHour: 50,
    },
    {
      id: 'station-4',
      name: 'Inspection',
      processType: 'Manual QC',
      cycleTimeSeconds: 25,
      machines: 1,
      workers: 1,
      availability: 0.97,
      defectRate: 0.005,
      machineCostPerHour: 5,
      laborCostPerHour: 25,
    },
    {
      id: 'station-5',
      name: 'Packaging',
      processType: 'Automated Packaging',
      cycleTimeSeconds: 20,
      machines: 1,
      workers: 1,
      availability: 0.96,
      defectRate: 0.001,
      machineCostPerHour: 12,
      laborCostPerHour: 20,
    },
  ];
}