import React from 'react';
import { formatCurrency } from '../../utils/currencyHelpers';

export default function TripStatsBar({ trip, budgetSummary, dayCount }) {
  const stats = [
    { label: 'Duration', value: `${dayCount} day${dayCount === 1 ? '' : 's'}` },
    { label: 'Stops', value: trip.destinations?.length || 0 },
    {
      label: 'Budget',
      value: budgetSummary ? formatCurrency(budgetSummary.totalBudget, budgetSummary.currency) : '—',
    },
    {
      label: 'Spent',
      value: budgetSummary ? formatCurrency(budgetSummary.totalSpent, budgetSummary.currency) : '—',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-surface-hair rounded-ticket overflow-hidden">
      {stats.map((s) => (
        <div key={s.label} className="bg-surface px-5 py-4">
          <p className="data-mono text-xs text-muted mb-1">{s.label}</p>
          <p className="font-display text-xl">{s.value}</p>
        </div>
      ))}
    </div>
  );
}