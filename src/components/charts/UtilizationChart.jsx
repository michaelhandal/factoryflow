// src/components/charts/UtilizationChart.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { calculateUtilization, classifyUtilization } from '../../calculations/utilization';

const STATUS_COLORS = {
  underutilized: 'var(--color-text-muted)',
  healthy: 'var(--color-success)',
  high: 'var(--color-warning)',
  overloaded: 'var(--color-danger)',
};

// Bar chart of each station's utilization %, color-coded by the same
// underutilized/healthy/high/overloaded thresholds used elsewhere in the app.

function UtilizationChart({ line, requiredRatePerHour }) {
  const data = line.map((station) => {
    const utilization = calculateUtilization(station, requiredRatePerHour);
    return {
      name: station.name,
      utilization: Math.round(utilization * 1000) / 10, // percentage, 1 decimal
      status: classifyUtilization(utilization),
    };
  });

  return (
    <div className="chart-card">
      <h3>Utilization by Station</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="name" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
          <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} unit="%" />
          <Tooltip
            contentStyle={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
            labelStyle={{ color: 'var(--color-text-primary)' }}
            formatter={(value) => [`${value}%`, 'Utilization']}
          />
          <ReferenceLine y={100} stroke="var(--color-danger)" strokeDasharray="4 4" />
          <Bar dataKey="utilization" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={STATUS_COLORS[entry.status]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default UtilizationChart;