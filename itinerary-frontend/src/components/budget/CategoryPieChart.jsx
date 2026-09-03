import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/currencyHelpers';

const COLORS = ['#4FA491', '#DE9F52', '#6FC4B0', '#C6863B', '#3B7E70'];
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
      <div className="ticket p-6 flex items-center justify-center h-64">
        <p className="text-sm text-parchment-text/40">No expenses logged yet</p>
      </div>
    );
  }

  return (
    <div className="ticket p-6">
      <p className="data-mono text-xs text-parchment-text/50 mb-2">By category</p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatCurrency(value, currency)}
            contentStyle={{ background: '#233634', border: '1px solid #2C423E', borderRadius: 8, fontSize: 13 }}
            itemStyle={{ color: '#F3ECDA' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
            <span className="text-parchment-text/70 truncate">{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}