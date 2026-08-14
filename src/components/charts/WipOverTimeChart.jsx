// src/components/charts/WipOverTimeChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Line graph of total WIP over simulated time. Fed by a history array
// that useSimulation records as the simulation runs.

function WipOverTimeChart({ wipHistory }) {
  if (!wipHistory || wipHistory.length === 0) {
    return (
      <div className="chart-card">
        <h3>WIP Over Time</h3>
        <p className="chart-card__empty">Run the simulation to see WIP accumulate over time.</p>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h3>WIP Over Time</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={wipHistory} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="time"
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            label={{ value: 'Simulated seconds', position: 'insideBottom', offset: -4, fill: 'var(--color-text-secondary)', fontSize: 11 }}
          />
          <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
            labelStyle={{ color: 'var(--color-text-primary)' }}
          />
          <Line type="monotone" dataKey="wip" stroke="var(--color-accent)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WipOverTimeChart;