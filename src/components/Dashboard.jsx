// src/components/Dashboard.jsx
import { buildDashboardMetrics } from '../calculations/dashboard';
import SectionHeader from './SectionHeader';
import Tooltip from './Tooltip';

const METRIC_TOOLTIPS = {
  throughput: 'The rate of units the line can sustain, capped by its slowest station (the bottleneck).',
  oee: 'Overall Equipment Effectiveness = Availability × Performance × Quality — a standard manufacturing health score.',
  wip: 'Work-In-Progress: units currently in the system, either waiting in a queue or being processed.',
  efficiency: 'How well work is balanced across stations, compared to a perfectly balanced ideal line.',
};

function MetricCard({ label, value, unit, tone, tooltip }) {
  return (
    <div className={`metric-card ${tone ? `metric-card--${tone}` : ''}`}>
      <span className="metric-card__label">
        {label}
        {tooltip && <Tooltip text={tooltip} />}
      </span>
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
    <section id="dashboard" className="dashboard">
      <SectionHeader
        title="Factory Dashboard"
        description="A live, at-a-glance summary of the whole production line — every number here is calculated directly from your current configuration."
      />
      <div className="dashboard__grid">
        <MetricCard
          label="Throughput"
          value={metrics.throughput.toFixed(1)}
          unit="units/hr"
          tooltip={METRIC_TOOLTIPS.throughput}
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
          tooltip={METRIC_TOOLTIPS.efficiency}
        />
        <MetricCard
          label="OEE"
          value={(metrics.oee * 100).toFixed(1)}
          unit="%"
          tooltip={METRIC_TOOLTIPS.oee}
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
          tooltip={METRIC_TOOLTIPS.wip}
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
    </section>
  );
}

export default Dashboard;