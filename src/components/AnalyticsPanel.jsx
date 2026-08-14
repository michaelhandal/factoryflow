// src/components/AnalyticsPanel.jsx
import CapacityChart from './charts/CapacityChart';
import UtilizationChart from './charts/UtilizationChart';
import CostBreakdownChart from './charts/CostBreakdownChart';
import WipOverTimeChart from './charts/WipOverTimeChart';

function AnalyticsPanel({ line, requiredRatePerHour, wipHistory }) {
  return (
    <div className="analytics-panel">
      <h2>Analytics</h2>
      <div className="analytics-panel__grid">
        <CapacityChart line={line} />
        <UtilizationChart line={line} requiredRatePerHour={requiredRatePerHour} />
        <CostBreakdownChart line={line} />
        <WipOverTimeChart wipHistory={wipHistory} />
      </div>
    </div>
  );
}

export default AnalyticsPanel;