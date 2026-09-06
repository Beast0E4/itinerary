import React from 'react';
import clsx from 'clsx';
import { Pencil } from 'lucide-react';
import { formatCurrency } from '../../utils/currencyHelpers';

export default function BudgetOverviewCard({ summary, onEditBudget }) {
  const pct = Math.min(summary.percentUsed, 100);
  const over = summary.percentUsed > 100;

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="data-mono text-xs mb-1">Total budget</p>
          <p className="font-display text-3xl">{formatCurrency(summary.totalBudget, summary.currency)}</p>
        </div>
        <button onClick={onEditBudget} className="btn-ghost text-sm">
          <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
          Edit
        </button>
      </div>

      <div className="h-2 bg-bg-soft rounded-full overflow-hidden mb-2">
        <div
          className={clsx('h-full rounded-full transition-all duration-500', over ? 'bg-danger' : 'bg-accent')}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex justify-between text-sm">
        <span className={clsx('data-mono', over && 'text-danger')}>
          {formatCurrency(summary.totalSpent, summary.currency)} spent
        </span>
        <span className="data-mono">
          {over ? 'over by ' : ''}
          {formatCurrency(Math.abs(summary.remaining), summary.currency)}
          {!over && ' left'}
        </span>
      </div>
    </div>
  );
}