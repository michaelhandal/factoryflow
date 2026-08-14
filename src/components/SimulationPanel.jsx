// src/components/SimulationPanel.jsx
import WipIndicator from './WipIndicator';

// Displays simulation controls (Start/Pause/Reset/Speed) plus a live
// per-station breakdown of what's queued (visualized as blocks), being
// processed, and rejected as defective right now.

function formatSimTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${hours}h ${minutes}m ${seconds}s`;
}

function SimulationPanel({ line, simState, isRunning, speed, setSpeed, start, pause, reset, totalWIP }) {
  const totalProcessed = simState.completedCount + simState.totalDefectiveCount;
  const observedQualityRate = totalProcessed > 0
    ? simState.completedCount / totalProcessed
    : 1;

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
          <span className="simulation-panel__stat-label">Good Units</span>
          <span className="simulation-panel__stat-value">{simState.completedCount}</span>
        </div>
        <div className="simulation-panel__stat">
          <span className="simulation-panel__stat-label">Defective (Scrap)</span>
          <span className="simulation-panel__stat-value simulation-panel__stat-value--danger">
            {simState.totalDefectiveCount}
          </span>
        </div>
        <div className="simulation-panel__stat">
          <span className="simulation-panel__stat-label">Observed Quality Rate</span>
          <span className="simulation-panel__stat-value">{(observedQualityRate * 100).toFixed(1)}%</span>
        </div>
        <div className="simulation-panel__stat">
          <span className="simulation-panel__stat-label">Total WIP</span>
          <span className="simulation-panel__stat-value">{totalWIP}</span>
        </div>
      </div>

      <div className="simulation-panel__stations">
        {line.map((station) => {
          const s = simState.stations[station.id] || { queue: 0, inProgress: [], defectiveCount: 0 };
          return (
            <div className="simulation-panel__station-row" key={station.id}>
              <div className="simulation-panel__station-row-header">
                <span className="simulation-panel__station-name">{station.name}</span>
                <span className="simulation-panel__station-detail">
                  Processing: <strong>{s.inProgress.length}</strong> / {station.machines} machines busy
                </span>
                {s.defectiveCount > 0 && (
                  <span className="simulation-panel__station-detail simulation-panel__station-detail--danger">
                    Rejected: <strong>{s.defectiveCount}</strong>
                  </span>
                )}
              </div>
              <WipIndicator queueCount={s.queue} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SimulationPanel;