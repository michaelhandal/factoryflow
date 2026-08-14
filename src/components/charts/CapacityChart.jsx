// src/components/charts/CapacityChart.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { calculateEffectiveCapacity } from '../../calculations/capacity';
import { identifyBottleneck } from '../../calculations/bottleneck';

// Bar chart of each station's effective capacity, with the bottleneck
// station's bar highlighted in red so it's visually obvious at a glance.

function CapacityChart({ line }) {
  const bottleneck = identifyBottleneck(line);

  const data = line.map((station) => ({
    name: station.name,
    capacity: Math.round(calculateEffectiveCapacity(station) * 10) / 10,
    isBottleneck: bottleneck && station.id === bottleneck.id,
  }));

  return (
    <div className="chart-card">
      <h3>Capacity by Station</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="name" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
          <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
            labelStyle={{ color: 'var(--color-text-primary)' }}
          />
          <Bar dataKey="capacity" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.isBottleneck ? 'var(--color-danger)' : 'var(--color-accent)'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CapacityChart;