import React from 'react';
import clsx from 'clsx';
import { formatCurrency } from '../../utils/currencyHelpers';

export default function BudgetOverviewCard({ summary, onEditBudget }) {
  const pct = Math.min(summary.percentUsed, 100);
  const over = summary.percentUsed > 100;

  return (
    <div className="ticket p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="data-mono text-xs text-parchment-text/50 mb-1">Total budget</p>
          <p className="font-display text-3xl">{formatCurrency(summary.totalBudget, summary.currency)}</p>
        </div>
        <button onClick={onEditBudget} className="text-sm text-route-soft hover:underline">
          Edit
        </button>
      </div>

      <div className="h-2.5 bg-surface-hair rounded-full overflow-hidden mb-2">
        <div
          className={clsx('h-full rounded-full transition-all duration-500', over ? 'bg-danger' : 'bg-route')}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex justify-between text-sm">
        <span className={clsx('data-mono', over ? 'text-danger' : 'text-parchment-text/70')}>
          {formatCurrency(summary.totalSpent, summary.currency)} spent
        </span>
        <span className="data-mono text-parchment-text/50">
          {over ? 'over by ' : ''}
          {formatCurrency(Math.abs(summary.remaining), summary.currency)}
          {!over && ' left'}
        </span>
      </div>
    </div>
  );
}