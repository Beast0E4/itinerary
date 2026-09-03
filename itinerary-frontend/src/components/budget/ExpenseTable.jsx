import React from 'react';
import { formatCurrency } from '../../utils/currencyHelpers';
import { formatDateShort } from '../../utils/dateHelpers';

export default function ExpenseTable({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return <p className="text-sm text-parchment-text/40 italic py-6 text-center">No expenses logged yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-surface-hair">
            <th className="py-2 pr-4 font-medium text-muted">Date</th>
            <th className="py-2 pr-4 font-medium text-muted">Description</th>
            <th className="py-2 pr-4 font-medium text-muted">Category</th>
            <th className="py-2 pr-4 font-medium text-muted text-right">Amount</th>
            <th className="py-2 pl-4 w-16" />
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e.id} className="border-b border-surface-hair/50 group hover:bg-surface-raised/40">
              <td className="py-2.5 pr-4 data-mono text-parchment-text/60">{formatDateShort(e.expenseDate)}</td>
              <td className="py-2.5 pr-4">{e.description}</td>
              <td className="py-2.5 pr-4">
                <span className="badge-stamp text-route-bright">{e.category.toLowerCase()}</span>
              </td>
              <td className="py-2.5 pr-4 data-mono text-right">{formatCurrency(e.amount, e.currency)}</td>
              <td className="py-2.5 pl-4">
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                  <button onClick={() => onEdit(e)} className="text-xs text-route-soft hover:underline">
                    Edit
                  </button>
                  <span className="text-parchment-text/20">·</span>
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