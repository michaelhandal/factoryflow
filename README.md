# Factory Flow

**Simulate. Analyze. Optimize.**

Factory Flow is a browser-based manufacturing simulation and optimization platform built as an industrial engineering portfolio project. It lets you build a production line, analyze it using real industrial engineering formulas, watch units flow through it in a live simulation, and get transparent, explained recommendations for how to improve it.

🚀 **Live Demo:** https://michaelhandal.github.io/factoryflow/

---

## Overview

Every manufacturing line answers the same underlying question: *how can we produce more, at lower cost, with less waste?* Factory Flow lets you build a simplified production line — a sequence of workstations, each with a cycle time, machine count, worker count, availability, and defect rate — and immediately see how that configuration performs, where its bottleneck is, how much it costs to run, and how it could be improved.

Nothing on the dashboard is hard-coded. Every number is derived live from the current line configuration using named, testable calculation functions.

## Features

- **Production Line Builder** — add, delete, reorder, and edit workstations with live-updating fields
- **Factory Dashboard** — throughput, capacity, line efficiency, OEE, bottleneck, WIP, average cycle time, and cost per unit, all calculated dynamically
- **Visual Factory Diagram** — a connected, color-coded view of the line showing utilization status and the bottleneck at a glance
- **Takt Time Analysis** — enter available time and customer demand to see which stations can't keep pace
- **Bottleneck Identification** — automatically finds the station that caps the whole line's output
- **Production Simulation** — a tick-based simulation with Start/Pause/Reset/Speed controls, showing units queuing, processing, and completing in real time
- **WIP Visualization** — live, color-coded block indicators showing work-in-progress accumulating at each station
- **Quality / Defects Model** — stations reject units at their configured defect rate; the simulation tracks good units vs. scrap
- **Cost Model** — total operating cost, cost per unit, cost per good unit, and the cost attributable to defects
- **Optimization Engine** — a transparent, rule-based heuristic that recommends specific changes (add a machine, reduce cycle time, improve availability, etc.) and explains *why*, for a chosen objective (max throughput, min cost/unit, or balanced line)
- **Before vs. After Comparison** — every optimization run shows the full before/after metrics with percentage change
- **Scenario Comparison** — save named snapshots of a line configuration (via `localStorage`) and compare them side by side
- **Analytics Charts** — capacity by station, utilization by station, cost breakdown, and WIP over time (via Recharts)
- **Sticky Section Navigation & Tooltips** — jump to any section instantly, and hover industrial-engineering terms for a plain-English explanation

## Industrial Engineering Concepts

Factory Flow implements the following concepts, each backed by a real, documented formula (see **Mathematical Models** below):

- Capacity planning (theoretical vs. effective capacity)
- Bottleneck analysis
- Takt time
- Utilization
- Line balancing / line efficiency
- Overall Equipment Effectiveness (OEE)
- Work-In-Progress (WIP) and Little's Law
- Quality / defect rate analysis
- Cost per unit / cost of poor quality
- Heuristic optimization

## Mathematical Models

All calculations live in `src/calculations/`, `src/simulation/`, and `src/optimization/`, separated from UI components so the engineering logic is easy to read and test independently.

| Metric | Formula |
|---|---|
| Theoretical Capacity | `machines × (3600 / cycleTimeSeconds)` |
| Effective Capacity | `theoreticalCapacity × availability` |
| Takt Time | `availableProductionTime / customerDemand` |
| Utilization | `requiredRate / effectiveCapacity` |
| Bottleneck | station with the minimum effective capacity |
| Line Efficiency | `totalWorkContent / (stations × slowestCycleTime)` |
| OEE | `availability × performance × quality` |
| Throughput | the bottleneck's effective capacity |
| Line Quality Rate | product of `(1 − defectRate)` across all stations |
| Effective Throughput | `throughput × lineQualityRate` |
| Little's Law | `WIP = Throughput × Flow Time` |
| Cost per Unit | `totalCostPerHour / throughput` |
| Cost per Good Unit | `totalCostPerHour / effectiveThroughput` |

Full derivations, variable definitions, and worked examples for each formula are documented as comments directly above each function in the corresponding file under `src/calculations/`.

## Optimization Methodology

Factory Flow uses a **transparent, rule-based heuristic search** — not machine learning — so every recommendation is traceable and explainable:

1. Generate a set of candidate single changes (add a machine, reduce cycle time 10%, improve availability, add a worker where understaffed)
2. Apply each candidate to a copy of the line and recompute the chosen objective (max throughput, min cost/unit, or balanced line)
3. Keep whichever single change most improves the objective
4. Repeat for up to 3 rounds, stopping early if no candidate helps

This is a **greedy local search** — it finds a good sequence of improvements, not a mathematically proven global optimum. Every recommendation includes the before/after capacity and objective score so it can be independently verified.

## Simulation Methodology

The simulation is a **discrete-time, tick-based model**. Each tick advances the simulated clock by a fixed number of seconds; units move between stations once their cycle time completes and the next station has an open machine slot, otherwise they queue as WIP. Units arrive into the first station at a steady rate derived from the configured customer demand. When a unit completes a station, it has a random chance (equal to that station's defect rate) of being rejected as scrap.

## Technology Stack

- **React 19** + **Vite** — component structure and fast dev/build tooling
- **JavaScript** (not TypeScript) — kept the project focused on the engineering logic
- **Plain CSS** with CSS custom properties — no utility framework, for full control over the dashboard's visual design
- **Recharts** — capacity, utilization, cost, and WIP-over-time charts
- **`localStorage`** — scenario persistence, with no backend required
- **GitHub Pages** — free static hosting via `gh-pages`

## Installation

```bash
git clone https://github.com/michaelhandal/factoryflow.git
cd factoryflow
npm install
npm run dev
```
Then open the local URL Vite prints (typically `http://localhost:5173`).

## Usage

1. Edit the default production line in the **Production Line Builder**, or use it as-is
2. Set your **Takt Time** inputs (available hours/day, customer demand)
3. Review the **Dashboard** and **Visual Factory** diagram for the current bottleneck and utilization
4. Click **Start** in the **Production Simulation** panel to watch units flow through the line
5. Try **Optimize Factory** with different objectives to get specific, explained recommendations
6. Save configurations as named **Scenarios** to compare different what-if setups side by side

## Example

With the default line (Cutting → Drilling → Assembly → Inspection → Packaging), Drilling starts as the bottleneck at ~72 units/hr. Running **Optimize Factory** with the "Maximum Throughput" objective recommends adding a machine to Drilling first, raising its capacity to ~144 units/hr and shifting the bottleneck to Assembly (~94.6 units/hr) — with a full before/after comparison shown in the Optimization panel.

## Assumptions

- Cycle times are deterministic in the steady-state formulas; the simulation's only stochastic element is defect rejection
- Stations run in a simple sequential line — no branching, parallel paths, or product mix
- Infinite buffer capacity between stations (no blocking)
- No changeover/setup times, shift patterns, or machine breakdown events are modeled
- OEE's Performance factor is fixed at 100% (see `src/calculations/oee.js` for the full explanation)
- No material cost per unit is tracked — only machine and labor cost per hour
- Defective units are scrapped outright; no rework loop is modeled
- Line efficiency uses raw cycle time (not machine-adjusted capacity), matching standard line-balancing definitions
- The optimizer is a greedy local search, not a proof of global optimality

## Limitations

- `localStorage`-based scenarios are local to one browser/device
- The simulation does not model random downtime events, only random defects
- Workers are not currently a capacity multiplier in the model (only machines are) — see `src/optimization/optimizer.js` for how this is handled
- Real factories often calculate OEE and line balancing differently depending on their own measurement systems; this is an educational, simplified model, not a production planning tool

## Future Improvements

- Add material cost per unit and a full landed-cost model
- Model random machine downtime events, not just random defects
- Support branching/parallel process routes, not just a single sequential line
- Add a rework loop for defective units instead of outright scrapping
- Migrate to TypeScript for stronger type safety as the codebase grows
- Add automated tests (Vitest) for every calculation function

## Author

Built by Michael Handal as an industrial engineering portfolio project.