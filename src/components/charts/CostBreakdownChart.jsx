// src/components/charts/CostBreakdownChart.jsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { buildCostBreakdown } from '../../calculations/cost';

// Donut chart showing each station's share of total hourly operating cost.

const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#a855f7', '#06b6d4', '#f97316'];

function CostBreakdownChart({ line }) {
  const cost = buildCostBreakdown(line);
  const data = cost.perStation.map((s) => ({
    name: s.name,
    value: Math.round(s.totalCostPerHour * 100) / 100,
  }));

  return (
    <div className="chart-card">
      <h3>Cost Breakdown by Station</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
            labelStyle={{ color: 'var(--color-text-primary)' }}
            formatter={(value) => [`$${value}/hr`, 'Cost']}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: 'var(--color-text-secondary)' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CostBreakdownChart;