import React from 'react';
import { formatCurrency } from '../../utils/currencyHelpers';
import { formatDateShort } from '../../utils/dateHelpers';

export default function ExpenseTable({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return <p className="text-sm text-text-faint italic py-6 text-center">No expenses logged yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-surface-border">
            <th className="py-2 pr-4 font-medium text-text-muted">Date</th>
            <th className="py-2 pr-4 font-medium text-text-muted">Description</th>
            <th className="py-2 pr-4 font-medium text-text-muted">Category</th>
            <th className="py-2 pr-4 font-medium text-text-muted text-right">Amount</th>
            <th className="py-2 pl-4 w-16" />
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e.id} className="border-b border-surface-border/50 group hover:bg-surface-hover/40">
              <td className="py-2.5 pr-4 data-mono">{formatDateShort(e.expenseDate)}</td>
              <td className="py-2.5 pr-4 text-text">{e.description}</td>
              <td className="py-2.5 pr-4">
                <span className="badge-accent">{e.category.toLowerCase()}</span>
              </td>
              <td className="py-2.5 pr-4 data-mono text-text text-right">{formatCurrency(e.amount, e.currency)}</td>
              <td className="py-2.5 pl-4">
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                  <button onClick={() => onEdit(e)} className="text-xs text-accent hover:underline">
                    Edit
                  </button>
                  <span className="text-text-faint">·</span>
                  <button onClick={() => onDelete(e)} className="text-xs text-danger hover:underline">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}