// src/components/OptimizationPanel.jsx
import { useState } from 'react';
import { runOptimization, OBJECTIVES } from '../optimization/optimizer';
import { calculateThroughput } from '../calculations/dashboard';
import { calculateLineEfficiency } from '../calculations/lineEfficiency';
import { calculateCostPerUnit } from '../calculations/cost';
import { calculateLineOEE } from '../calculations/oee';
import { identifyBottleneck } from '../calculations/bottleneck';

// Lets the user pick an optimization objective, run the heuristic optimizer,
// see WHY each recommended change was made, and apply the result to the
// real production line if they choose to.

function BeforeAfterRow({ label, before, after, format, lowerIsBetter }) {
  const improved = lowerIsBetter ? after < before : after > before;
  const pctChange = before !== 0 ? ((after - before) / Math.abs(before)) * 100 : 0;

  return (
    <tr>
      <td>{label}</td>
      <td>{format(before)}</td>
      <td>{format(after)}</td>
      <td className={improved ? 'optimization-panel__change--good' : 'optimization-panel__change--neutral'}>
        {pctChange >= 0 ? '+' : ''}{pctChange.toFixed(1)}%
      </td>
    </tr>
  );
}

function OptimizationPanel({ line, onApply }) {
  const [objectiveKey, setObjectiveKey] = useState('throughput');
  const [result, setResult] = useState(null);

  function handleOptimize() {
    setResult(runOptimization(line, objectiveKey));
  }

  function handleApply() {
    if (result) {
      onApply(result.finalLine);
      setResult(null);
    }
  }

  function handleDiscard() {
    setResult(null);
  }

  // Build the before/after comparison table data once we have a result.
  const comparison = result && {
    before: {
      throughput: calculateThroughput(line),
      efficiency: calculateLineEfficiency(line),
      cost: calculateCostPerUnit(line),
      oee: calculateLineOEE(line),
      bottleneck: identifyBottleneck(line)?.name ?? '—',
    },
    after: {
      throughput: calculateThroughput(result.finalLine),
      efficiency: calculateLineEfficiency(result.finalLine),
      cost: calculateCostPerUnit(result.finalLine),
      oee: calculateLineOEE(result.finalLine),
      bottleneck: identifyBottleneck(result.finalLine)?.name ?? '—',
    },
  };

  return (
    <div className="optimization-panel">
      <h2>Optimize Factory</h2>

      <div className="optimization-panel__controls">
        <select
          className="optimization-panel__objective-select"
          value={objectiveKey}
          onChange={(e) => setObjectiveKey(e.target.value)}
        >
          {Object.entries(OBJECTIVES).map(([key, obj]) => (
            <option key={key} value={key}>{obj.label}</option>
          ))}
        </select>
        <button className="btn-primary" onClick={handleOptimize}>
          Optimize Factory
        </button>
      </div>

      {result && (
        <div className="optimization-panel__result">
          {result.steps.length === 0 ? (
            <p className="optimization-panel__no-changes">
              No single change found that improves {result.objectiveLabel} — the line already appears well-tuned for this objective given the available moves.
            </p>
          ) : (
            <>
              <h3>Recommended Changes</h3>
              <div className="optimization-panel__steps">
                {result.steps.map((step) => (
                  <div className="optimization-panel__step" key={step.round}>
                    <div className="optimization-panel__step-header">
                      <span className="optimization-panel__step-number">Step {step.round}</span>
                      <span className="optimization-panel__step-desc">{step.description}</span>
                    </div>
                    <div className="optimization-panel__step-detail">
                      <span>
                        Capacity: {step.beforeCapacity.toFixed(1)} → {step.afterCapacity.toFixed(1)} units/hr
                      </span>
                      <span>
                        {result.objectiveLabel}: {step.beforeScore.toFixed(2)} → {step.afterScore.toFixed(2)}
                      </span>
                      {step.estimatedCostDelta > 0 && (
                        <span className="optimization-panel__step-cost">
                          Est. additional cost: +${step.estimatedCostDelta.toFixed(2)}/hr
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <h3>Before vs. After</h3>
              <table className="optimization-panel__table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Before</th>
                    <th>After</th>
                    <th>Change</th>
                  </tr>
                </thead>
                <tbody>
                  <BeforeAfterRow
                    label="Throughput (units/hr)"
                    before={comparison.before.throughput}
                    after={comparison.after.throughput}
                    format={(v) => v.toFixed(1)}
                  />
                  <BeforeAfterRow
                    label="Line Efficiency"
                    before={comparison.before.efficiency}
                    after={comparison.after.efficiency}
                    format={(v) => `${(v * 100).toFixed(1)}%`}
                  />
                  <BeforeAfterRow
                    label="OEE"
                    before={comparison.before.oee}
                    after={comparison.after.oee}
                    format={(v) => `${(v * 100).toFixed(1)}%`}
                  />
                  <BeforeAfterRow
                    label="Cost per Unit"
                    before={comparison.before.cost}
                    after={comparison.after.cost}
                    format={(v) => `$${v.toFixed(2)}`}
                    lowerIsBetter
                  />
                  <tr>
                    <td>Bottleneck</td>
                    <td>{comparison.before.bottleneck}</td>
                    <td>{comparison.after.bottleneck}</td>
                    <td>—</td>
                  </tr>
                </tbody>
              </table>

              <div className="optimization-panel__actions">
                <button className="btn-primary" onClick={handleApply}>
                  Apply These Changes
                </button>
                <button className="btn-secondary" onClick={handleDiscard}>
                  Discard
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default OptimizationPanel;