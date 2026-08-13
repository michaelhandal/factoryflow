// src/components/StationCard.jsx
import { calculateEffectiveCapacity, calculateTheoreticalCapacity } from '../calculations/capacity';

// Renders ONE workstation as an editable card.
// This component has no knowledge of the rest of the line — it just displays
// the station it's given, and reports changes back up via onChange/onDelete/onMove.

function StationCard({ station, onChange, onDelete, onMoveUp, onMoveDown, isFirst, isLast, isBottleneck }) {
  const theoreticalCapacity = calculateTheoreticalCapacity(station);
  const effectiveCapacity = calculateEffectiveCapacity(station);

  function handleFieldChange(field, rawValue) {
    const isNumericField = field !== 'name' && field !== 'processType';
    const value = isNumericField ? Number(rawValue) : rawValue;
    onChange({ ...station, [field]: value });
  }

  return (
    <div className={`station-card ${isBottleneck ? 'station-card--bottleneck' : ''}`}>
      <div className="station-card__header">
        <div className="station-card__move-controls">
          <button
            className="station-card__move-btn"
            onClick={onMoveUp}
            disabled={isFirst}
            title="Move up"
          >
            ↑
          </button>
          <button
            className="station-card__move-btn"
            onClick={onMoveDown}
            disabled={isLast}
            title="Move down"
          >
            ↓
          </button>
        </div>

        <input
          className="station-card__name-input"
          type="text"
          value={station.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
        />
        {isBottleneck && <span className="station-card__bottleneck-badge">BOTTLENECK</span>}
        <button
          className="station-card__delete-btn"
          onClick={() => onDelete(station.id)}
          title="Delete station"
        >
          ✕
        </button>
      </div>

      <div className="station-card__capacity-readout">
        <span>Theoretical capacity: <strong>{theoreticalCapacity.toFixed(1)}</strong> units/hr</span>
        <span>Effective capacity: <strong>{effectiveCapacity.toFixed(1)}</strong> units/hr</span>
      </div>

      <div className="station-card__field">
        <label>Process type</label>
        <input
          type="text"
          value={station.processType}
          onChange={(e) => handleFieldChange('processType', e.target.value)}
        />
      </div>

      <div className="station-card__grid">
        <div className="station-card__field">
          <label>Cycle time (sec)</label>
          <input
            type="number"
            min="0"
            step="1"
            value={station.cycleTimeSeconds}
            onChange={(e) => handleFieldChange('cycleTimeSeconds', e.target.value)}
          />
        </div>

        <div className="station-card__field">
          <label>Machines</label>
          <input
            type="number"
            min="1"
            step="1"
            value={station.machines}
            onChange={(e) => handleFieldChange('machines', e.target.value)}
          />
        </div>

        <div className="station-card__field">
          <label>Workers</label>
          <input
            type="number"
            min="0"
            step="1"
            value={station.workers}
            onChange={(e) => handleFieldChange('workers', e.target.value)}
          />
        </div>

        <div className="station-card__field">
          <label>Availability (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            step="1"
            value={Math.round(station.availability * 100)}
            onChange={(e) => handleFieldChange('availability', Number(e.target.value) / 100)}
          />
        </div>

        <div className="station-card__field">
          <label>Defect rate (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={Math.round(station.defectRate * 1000) / 10}
            onChange={(e) => handleFieldChange('defectRate', Number(e.target.value) / 100)}
          />
        </div>

        <div className="station-card__field">
          <label>Machine cost ($/hr)</label>
          <input
            type="number"
            min="0"
            step="1"
            value={station.machineCostPerHour}
            onChange={(e) => handleFieldChange('machineCostPerHour', e.target.value)}
          />
        </div>

        <div className="station-card__field">
          <label>Labor cost ($/hr)</label>
          <input
            type="number"
            min="0"
            step="1"
            value={station.laborCostPerHour}
            onChange={(e) => handleFieldChange('laborCostPerHour', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default StationCard;