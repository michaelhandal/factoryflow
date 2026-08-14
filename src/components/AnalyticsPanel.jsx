// src/components/AnalyticsPanel.jsx
import CapacityChart from './charts/CapacityChart';
import UtilizationChart from './charts/UtilizationChart';
import CostBreakdownChart from './charts/CostBreakdownChart';
import WipOverTimeChart from './charts/WipOverTimeChart';
import SectionHeader from './SectionHeader';

function AnalyticsPanel({ line, requiredRatePerHour, wipHistory }) {
  return (
    <section id="analytics" className="analytics-panel">
      <SectionHeader
        title="Analytics"
        description="Charts summarizing capacity, utilization, cost distribution, and WIP behavior over time."
      />
      <div className="analytics-panel__grid">
        <CapacityChart line={line} />
        <UtilizationChart line={line} requiredRatePerHour={requiredRatePerHour} />
        <CostBreakdownChart line={line} />
        <WipOverTimeChart wipHistory={wipHistory} />
      </div>
    </section>
  );
}

export default AnalyticsPanel;