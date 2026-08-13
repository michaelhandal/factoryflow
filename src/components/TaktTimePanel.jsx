// src/components/TaktTimePanel.jsx
import { calculateTaktTime, findTaktTimeProblemStations } from '../calculations/taktTime';

// Lets the user enter available production time (in hours, for convenience)
// and customer demand (units), then shows the resulting takt time and
// flags any stations whose cycle time exceeds it.
// State now lives in App.jsx so other components (like utilization) can
// also use availableHours/customerDemand.

function TaktTimePanel({ line, availableHours, setAvailableHours, customerDemand, setCustomerDemand }) {
  const availableSeconds = availableHours * 3600;
  const taktTimeSeconds = calculateTaktTime(availableSeconds, customerDemand);
  const problemStations = findTaktTimeProblemStations(line, taktTimeSeconds);

  return (
    <div className="takt-panel">
      <h2>Takt Time</h2>

      <div className="takt-panel__inputs">
        <div className="station-card__field">
          <label>Available production time (hours/day)</label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={availableHours}
            onChange={(e) => setAvailableHours(Number(e.target.value))}
          />
        </div>
        <div className="station-card__field">
          <label>Customer demand (units/day)</label>
          <input
            type="number"
            min="0"
            step="1"
            value={customerDemand}
            onChange={(e) => setCustomerDemand(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="takt-panel__result">
        <span className="takt-panel__result-label">Takt Time</span>
        <span className="takt-panel__result-value">{taktTimeSeconds.toFixed(1)} sec/unit</span>
      </div>

      {problemStations.length > 0 ? (
        <div className="takt-panel__warning">
          <strong>{problemStations.length} station{problemStations.length > 1 ? 's' : ''}</strong> cannot keep pace with demand (cycle time exceeds takt time):
          <ul>
            {problemStations.map((s) => (
              <li key={s.id}>
                {s.name} — {s.cycleTimeSeconds}s cycle time vs {taktTimeSeconds.toFixed(1)}s takt time
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="takt-panel__ok">
          ✓ Every station's cycle time is within takt time.
        </div>
      )}
    </div>
  );
}

export default TaktTimePanel;