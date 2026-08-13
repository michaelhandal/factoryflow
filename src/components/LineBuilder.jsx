// src/components/LineBuilder.jsx
import StationCard from './StationCard';

// Renders the full list of workstations plus an "Add Station" button.
// Owns no state itself — it receives the line and reports changes upward,
// so App.jsx remains the single source of truth for the production line.

function LineBuilder({ line, onLineChange }) {
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

  // Swaps a station with its neighbor in the given direction.
  // direction is either -1 (move up / earlier in the line) or +1 (move down / later).
  function handleMoveStation(index, direction) {
    const targetIndex = index + direction;

    // Guard against moving past either end of the array.
    if (targetIndex < 0 || targetIndex >= line.length) return;

    const newLine = [...line];
    // Swap the two entries.
    [newLine[index], newLine[targetIndex]] = [newLine[targetIndex], newLine[index]];
    onLineChange(newLine);
  }

  return (
    <div className="line-builder">
      <div className="line-builder__header">
        <h2>Production Line Builder</h2>
        <button className="btn-primary" onClick={handleAddStation}>
          + Add Station
        </button>
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
          />
        ))}
      </div>
    </div>
  );
}

export default LineBuilder;