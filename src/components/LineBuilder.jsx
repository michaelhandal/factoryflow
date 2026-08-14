// src/components/LineBuilder.jsx
import StationCard from './StationCard';
import { identifyBottleneck } from '../calculations/bottleneck';
import { calculateLineEfficiency } from '../calculations/lineEfficiency';
import SectionHeader from './SectionHeader';
// Renders the full list of workstations plus an "Add Station" button.
// Owns no state itself — it receives the line and reports changes upward,
// so App.jsx remains the single source of truth for the production line.

function LineBuilder({ line, onLineChange, requiredRatePerHour }) {
  const bottleneck = identifyBottleneck(line);
  const lineEfficiency = calculateLineEfficiency(line);

  function handleStationChange(updatedStation) {
    const newLine = line.map((s) => (s.id === updatedStation.id ? updatedStation : s));
    onLineChange(newLine);
  }

  function handleStationDelete(stationId) {
    const newLine = line.filter((s) => s.id !== stationId);
    onLineChange(newLine);
  }

  function handleAddStation() {
    const newId = `station-${Date.now()}`;
    const newStation = {
      id: newId,
      name: 'New Station',
      processType: '',
      cycleTimeSeconds: 30,
      machines: 1,
      workers: 1,
      availability: 0.95,
      defectRate: 0.01,
      machineCostPerHour: 20,
      laborCostPerHour: 25,
    };
    onLineChange([...line, newStation]);
  }

  function handleMoveStation(index, direction) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= line.length) return;

    const newLine = [...line];
    [newLine[index], newLine[targetIndex]] = [newLine[targetIndex], newLine[index]];
    onLineChange(newLine);
  }

  return (
    <section id="line-builder" className="line-builder">
      <SectionHeader
        title="Production Line Builder"
        description="Add, remove, reorder, and edit every workstation — every calculation on this page updates live from these values."
      />
      <div className="line-builder__header">
        <button className="btn-primary" onClick={handleAddStation}>
          + Add Station
        </button>
      </div>

      <div className="line-builder__summary-row">
        {bottleneck && (
          <div className="bottleneck-banner">
            <span className="bottleneck-banner__label">Bottleneck</span>
            <span className="bottleneck-banner__station">{bottleneck.name}</span>
            <span className="bottleneck-banner__detail">
              {bottleneck.effectiveCapacityPerHour.toFixed(1)} units/hr — this caps the entire line's output
            </span>
          </div>
        )}

        <div className="efficiency-banner">
          <span className="efficiency-banner__label">Line Efficiency</span>
          <span className="efficiency-banner__value">{(lineEfficiency * 100).toFixed(1)}%</span>
        </div>
      </div>

      <div className="line-builder__list">
        {line.map((station, index) => (
          <StationCard
            key={station.id}
            station={station}
            onChange={handleStationChange}
            onDelete={handleStationDelete}
            onMoveUp={() => handleMoveStation(index, -1)}
            onMoveDown={() => handleMoveStation(index, 1)}
            isFirst={index === 0}
            isLast={index === line.length - 1}
            isBottleneck={bottleneck && station.id === bottleneck.id}
            requiredRatePerHour={requiredRatePerHour}
          />
        ))}
      </div>
    </section>
  );
}

export default LineBuilder;