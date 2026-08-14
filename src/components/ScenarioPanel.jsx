// src/components/ScenarioPanel.jsx
import { useState, useEffect } from 'react';
import { loadScenarios, saveScenario, deleteScenario } from '../utils/scenarioStorage';
import { calculateScenarioMetrics } from '../calculations/scenarioMetrics';

// Lets the user save the current line as a named scenario, and compares
// all saved scenarios (plus the live current line) in one table.

function ScenarioPanel({ line }) {
  const [scenarios, setScenarios] = useState([]);
  const [newName, setNewName] = useState('');

  // Load saved scenarios once on mount.
  useEffect(() => {
    setScenarios(loadScenarios());
  }, []);

  function handleSave() {
    const name = newName.trim() || `Scenario ${scenarios.length + 1}`;
    const updated = saveScenario(name, line);
    setScenarios(updated);
    setNewName('');
  }

  function handleDelete(id) {
    const updated = deleteScenario(id);
    setScenarios(updated);
  }

  const currentMetrics = calculateScenarioMetrics(line);

  return (
    <div className="scenario-panel">
      <h2>Scenario Comparison</h2>

      <div className="scenario-panel__save-row">
        <input
          type="text"
          placeholder="Scenario name (e.g. 'Add machine to Drilling')"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="scenario-panel__name-input"
        />
        <button className="btn-primary" onClick={handleSave}>
          Save Current Line as Scenario
        </button>
      </div>

      <table className="scenario-panel__table">
        <thead>
          <tr>
            <th>Scenario</th>
            <th>Throughput</th>
            <th>Efficiency</th>
            <th>OEE</th>
            <th>Cost/Unit</th>
            <th>Bottleneck</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr className="scenario-panel__row--current">
            <td><strong>Current Line (live)</strong></td>
            <td>{currentMetrics.throughput.toFixed(1)} u/hr</td>
            <td>{(currentMetrics.lineEfficiency * 100).toFixed(1)}%</td>
            <td>{(currentMetrics.oee * 100).toFixed(1)}%</td>
            <td>${currentMetrics.costPerUnit.toFixed(2)}</td>
            <td>{currentMetrics.bottleneckName}</td>
            <td></td>
          </tr>
          {scenarios.map((scenario) => {
            const metrics = calculateScenarioMetrics(scenario.line);
            return (
              <tr key={scenario.id}>
                <td>{scenario.name}</td>
                <td>{metrics.throughput.toFixed(1)} u/hr</td>
                <td>{(metrics.lineEfficiency * 100).toFixed(1)}%</td>
                <td>{(metrics.oee * 100).toFixed(1)}%</td>
                <td>${metrics.costPerUnit.toFixed(2)}</td>
                <td>{metrics.bottleneckName}</td>
                <td>
                  <button
                    className="scenario-panel__delete-btn"
                    onClick={() => handleDelete(scenario.id)}
                    title="Delete scenario"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {scenarios.length === 0 && (
        <p className="scenario-panel__empty">
          No saved scenarios yet — name and save your current line above to start comparing configurations.
        </p>
      )}
    </div>
  );
}

export default ScenarioPanel;