// src/components/Dashboard.jsx
import { buildDashboardMetrics } from '../calculations/dashboard';

// The top-level metric dashboard: large cards summarizing the whole line's
// performance at a glance. All values are derived live from the current
// production line — nothing here is hard-coded.

function MetricCard({ label, value, unit, tone }) {
  return (
    <div className={`metric-card ${tone ? `metric-card--${tone}` : ''}`}>
      <span className="metric-card__label">{label}</span>
      <span className="metric-card__value">
        {value}
        {unit && <span className="metric-card__unit"> {unit}</span>}
      </span>
    </div>
  );
}

function Dashboard({ line, wip }) {
  const metrics = buildDashboardMetrics(line, wip);

  return (
    <div className="dashboard">
      <h2>Factory Dashboard</h2>
      <div className="dashboard__grid">
        <MetricCard
          label="Throughput"
          value={metrics.throughput.toFixed(1)}
          unit="units/hr"
        />
        <MetricCard
          label="Production Capacity"
          value={metrics.productionCapacity.toFixed(1)}
          unit="units/hr"
        />
        <MetricCard
          label="Line Efficiency"
          value={(metrics.lineEfficiency * 100).toFixed(1)}
          unit="%"
        />
        <MetricCard
          label="OEE"
          value={(metrics.oee * 100).toFixed(1)}
          unit="%"
        />
        <MetricCard
          label="Bottleneck"
          value={metrics.bottleneckName}
          tone="danger"
        />
        <MetricCard
          label="WIP"
          value={metrics.wip === null ? '—' : metrics.wip}
          unit={metrics.wip === null ? '' : 'units'}
        />
        <MetricCard
          label="Avg Cycle Time"
          value={metrics.averageCycleTime.toFixed(1)}
          unit="sec"
        />
        <MetricCard
          label="Cost per Unit"
          value={`$${metrics.costPerUnit.toFixed(2)}`}
        />
      </div>
    </div>
  );
}

export default Dashboard;