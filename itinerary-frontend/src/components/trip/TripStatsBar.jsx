import React from 'react';
import { Calendar, MapPin, Wallet, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../utils/currencyHelpers';

export default function TripStatsBar({ trip, budgetSummary, dayCount }) {
  const stats = [
    { label: 'Duration', value: `${dayCount} day${dayCount === 1 ? '' : 's'}`, icon: Calendar },
    { label: 'Stops', value: trip.destinations?.length || 0, icon: MapPin },
    {
      label: 'Budget',
      value: budgetSummary ? formatCurrency(budgetSummary.totalBudget, budgetSummary.currency) : '—',
      icon: Wallet,
    },
    {
      label: 'Spent',
      value: budgetSummary ? formatCurrency(budgetSummary.totalSpent, budgetSummary.currency) : '—',
      icon: TrendingDown,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="card px-4 py-4">
          <s.icon className="w-4 h-4 text-text-faint mb-2" strokeWidth={1.75} />
          <p className="data-mono text-xs mb-1">{s.label}</p>
          <p className="font-display text-xl">{s.value}</p>
        </div>
      ))}
    </div>
  );
}