// src/components/CostPanel.jsx
import { buildCostBreakdown } from '../calculations/cost';
import SectionHeader from './SectionHeader';
// Shows the full cost breakdown: total hourly cost, cost per unit, cost
// per good unit, cost of defects, and a per-station cost table.

function CostPanel({ line }) {
  const cost = buildCostBreakdown(line);

  return (
    <section id="cost" className="cost-panel">
      <SectionHeader
        title="Cost Model"
        description="Operating cost breakdown, including the hidden cost of scrapped defective units."
      />

      <div className="cost-panel__summary">
        <div className="cost-panel__summary-item">
          <span className="cost-panel__summary-label">Total Operating Cost</span>
          <span className="cost-panel__summary-value">${cost.totalCostPerHour.toFixed(2)}/hr</span>
        </div>
        <div className="cost-panel__summary-item">
          <span className="cost-panel__summary-label">Cost per Unit</span>
          <span className="cost-panel__summary-value">${cost.costPerUnit.toFixed(2)}</span>
        </div>
        <div className="cost-panel__summary-item">
          <span className="cost-panel__summary-label">Cost per Good Unit</span>
          <span className="cost-panel__summary-value">${cost.costPerGoodUnit.toFixed(2)}</span>
        </div>
        <div className="cost-panel__summary-item">
          <span className="cost-panel__summary-label">Cost of Defects</span>
          <span className="cost-panel__summary-value cost-panel__summary-value--danger">
            ${cost.defectCostPerHour.toFixed(2)}/hr
          </span>
        </div>
      </div>

      <table className="cost-panel__table">
        <thead>
          <tr>
            <th>Station</th>
            <th>Machine Cost/hr</th>
            <th>Labor Cost/hr</th>
            <th>Total/hr</th>
          </tr>
        </thead>
        <tbody>
          {cost.perStation.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>${s.machineCostPerHour.toFixed(2)}</td>
              <td>${s.laborCostPerHour.toFixed(2)}</td>
              <td><strong>${s.totalCostPerHour.toFixed(2)}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="cost-panel__note">
        This model reflects only machine and labor cost per hour, as tracked in the station data — no per-unit material cost is included yet (see project limitations).
      </p>
    </section>
  );
}

export default CostPanel;