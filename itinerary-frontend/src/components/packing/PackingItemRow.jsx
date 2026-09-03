import React from 'react';
import clsx from 'clsx';

export default function PackingItemRow({ item, onToggle, onDelete }) {
  return (
    <div className="flex items-center gap-3 py-2 group">
      <button
        onClick={() => onToggle(item)}
        className={clsx(
          'w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors',
          item.isPacked ? 'bg-route border-route' : 'border-parchment-text/30'
        )}
        aria-label={item.isPacked ? 'Mark as not packed' : 'Mark as packed'}
      >
        {item.isPacked && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#12201E" strokeWidth="3">
            <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <span className={clsx('flex-1 text-sm', item.isPacked && 'line-through text-parchment-text/40')}>
        {item.itemName}
        {item.quantity > 1 && <span className="data-mono text-xs text-parchment-text/40 ml-1.5">×{item.quantity}</span>}
      </span>

      <button
        onClick={() => onDelete(item)}
        className="opacity-0 group-hover:opacity-100 text-parchment-text/40 hover:text-danger transition-opacity text-xs"
        aria-label="Remove"
      >
        Remove
      </button>
    </div>
  );
}