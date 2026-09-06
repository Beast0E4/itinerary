import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/currencyHelpers';

const COLORS = ['#4FBF9F', '#E8A34D', '#63D4B3', '#8FA39C', '#2F8E76'];
const LABELS = {
  accommodation: 'Accommodation',
  transport: 'Transport',
  food: 'Food',
  activities: 'Activities',
  misc: 'Misc',
};

export default function CategoryPieChart({ breakdown, currency }) {
  const data = Object.entries(breakdown)
    .map(([key, val]) => ({ name: LABELS[key] || key, value: val.spent }))
    .filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="card p-6 flex items-center justify-center h-64">
        <p className="text-sm text-text-faint">No expenses logged yet</p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <p className="data-mono text-xs mb-2">By category</p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatCurrency(value, currency)}
            contentStyle={{ background: '#182420', border: '1px solid #223330', borderRadius: 8, fontSize: 13 }}
            itemStyle={{ color: '#EDF3F0' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
            <span className="text-text-muted truncate">{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}