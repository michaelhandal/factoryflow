// src/components/SimulationPanel.jsx

// Displays simulation controls (Start/Pause/Reset/Speed) plus a live
// per-station breakdown of what's queued vs. being processed right now.

function formatSimTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${hours}h ${minutes}m ${seconds}s`;
}

function SimulationPanel({ line, simState, isRunning, speed, setSpeed, start, pause, reset, totalWIP }) {
  return (
    <div className="simulation-panel">
      <div className="simulation-panel__header">
        <h2>Production Simulation</h2>
        <div className="simulation-panel__controls">
          {isRunning ? (
            <button className="btn-secondary" onClick={pause}>Pause</button>
          ) : (
            <button className="btn-primary" onClick={start}>Start</button>
          )}
          <button className="btn-secondary" onClick={reset}>Reset</button>
          <select
            className="simulation-panel__speed-select"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          >
            <option value={1}>1x speed</option>
            <option value={2}>2x speed</option>
            <option value={5}>5x speed</option>
            <option value={10}>10x speed</option>
          </select>
        </div>
      </div>

      <div className="simulation-panel__stats">
        <div className="simulation-panel__stat">
          <span className="simulation-panel__stat-label">Simulated Time</span>
          <span className="simulation-panel__stat-value">{formatSimTime(simState.simulatedSeconds)}</span>
        </div>
        <div className="simulation-panel__stat">
          <span className="simulation-panel__stat-label">Units Completed</span>
          <span className="simulation-panel__stat-value">{simState.completedCount}</span>
        </div>
        <div className="simulation-panel__stat">
          <span className="simulation-panel__stat-label">Total WIP</span>
          <span className="simulation-panel__stat-value">{totalWIP}</span>
        </div>
      </div>

      <div className="simulation-panel__stations">
        {line.map((station) => {
          const s = simState.stations[station.id] || { queue: 0, inProgress: [] };
          return (
            <div className="simulation-panel__station-row" key={station.id}>
              <span className="simulation-panel__station-name">{station.name}</span>
              <span className="simulation-panel__station-detail">
                Waiting: <strong>{s.queue}</strong>
              </span>
              <span className="simulation-panel__station-detail">
                Processing: <strong>{s.inProgress.length}</strong> / {station.machines} machines busy
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SimulationPanel;