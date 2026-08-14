// src/components/TaktTimePanel.jsx
import { calculateTaktTime, findTaktTimeProblemStations } from '../calculations/taktTime';
import SectionHeader from './SectionHeader';
import Tooltip from './Tooltip';

function TaktTimePanel({ line, availableHours, setAvailableHours, customerDemand, setCustomerDemand }) {
  const availableSeconds = availableHours * 3600;
  const taktTimeSeconds = calculateTaktTime(availableSeconds, customerDemand);
  const problemStations = findTaktTimeProblemStations(line, taktTimeSeconds);

  return (
    <section id="takt-time" className="takt-panel">
      <SectionHeader
        title="Takt Time"
        description="The pace the line needs to keep to exactly meet customer demand — set your available time and demand below."
      />

      <div className="takt-panel__inputs">
        <div className="station-card__field">
          <label>
            Available production time (hours/day)
            <Tooltip text="Total scheduled production time per day, e.g. an 8-hour shift." />
          </label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={availableHours}
            onChange={(e) => setAvailableHours(Number(e.target.value))}
          />
        </div>
        <div className="station-card__field">
          <label>
            Customer demand (units/day)
            <Tooltip text="How many units the customer wants produced per day." />
          </label>
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
    </section>
  );
}

export default TaktTimePanel;