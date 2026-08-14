// src/components/FactoryDiagram.jsx
import { calculateEffectiveCapacity } from '../calculations/capacity';
import { calculateUtilization, classifyUtilization } from '../calculations/utilization';
import { identifyBottleneck } from '../calculations/bottleneck';

// A horizontal, connected diagram of the production line: one box per
// station, linked by arrows, color-coded by utilization status, with a
// live WIP queue indicator pulled from the running simulation (if any).

const STATUS_LABELS = {
  underutilized: 'Underutilized',
  healthy: 'Balanced',
  high: 'High load',
  overloaded: 'Overloaded',
};

function FactoryDiagram({ line, requiredRatePerHour, simState }) {
  const bottleneck = identifyBottleneck(line);

  if (!line || line.length === 0) {
    return (
      <div className="factory-diagram factory-diagram--empty">
        No stations yet — add one in the Production Line Builder below.
      </div>
    );
  }

  return (
    <div className="factory-diagram">
      <h2>Visual Factory</h2>
      <div className="factory-diagram__track">
        {line.map((station, index) => {
          const effectiveCapacity = calculateEffectiveCapacity(station);
          const utilization = calculateUtilization(station, requiredRatePerHour);
          const status = classifyUtilization(utilization);
          const isBottleneck = bottleneck && station.id === bottleneck.id;
          const queueCount = simState?.stations?.[station.id]?.queue ?? 0;

          return (
            <div className="factory-diagram__unit" key={station.id}>
              <div
                className={`factory-diagram__box factory-diagram__box--${status} ${
                  isBottleneck ? 'factory-diagram__box--bottleneck' : ''
                }`}
              >
                {isBottleneck && (
                  <span className="factory-diagram__box-badge">BOTTLENECK</span>
                )}
                <div className="factory-diagram__box-name">{station.name}</div>
                <div className="factory-diagram__box-stat">
                  {station.cycleTimeSeconds}s cycle
                </div>
                <div className="factory-diagram__box-stat">
                  {effectiveCapacity.toFixed(0)} units/hr
                </div>
                <div className="factory-diagram__box-stat">
                  {station.machines} machine{station.machines !== 1 ? 's' : ''}
                </div>
                {queueCount > 0 && (
                  <div className="factory-diagram__box-wip">
                    WIP queue: <strong>{queueCount}</strong>
                  </div>
                )}
                <div className={`factory-diagram__box-status factory-diagram__box-status--${status}`}>
                  {STATUS_LABELS[status]} ({(utilization * 100).toFixed(0)}%)
                </div>
              </div>

              {index < line.length - 1 && (
                <div className="factory-diagram__arrow">→</div>
              )}
            </div>
          );
        })}
      </div>

      <div className="factory-diagram__legend">
        <span className="factory-diagram__legend-item">
          <span className="factory-diagram__legend-swatch factory-diagram__legend-swatch--underutilized" />
          Underutilized
        </span>
        <span className="factory-diagram__legend-item">
          <span className="factory-diagram__legend-swatch factory-diagram__legend-swatch--healthy" />
          Balanced
        </span>
        <span className="factory-diagram__legend-item">
          <span className="factory-diagram__legend-swatch factory-diagram__legend-swatch--high" />
          High load
        </span>
        <span className="factory-diagram__legend-item">
          <span className="factory-diagram__legend-swatch factory-diagram__legend-swatch--overloaded" />
          Overloaded
        </span>
      </div>
    </div>
  );
}

export default FactoryDiagram;