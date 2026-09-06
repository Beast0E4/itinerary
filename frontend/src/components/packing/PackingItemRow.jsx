import React from 'react';
import clsx from 'clsx';
import { Check } from 'lucide-react';

export default function PackingItemRow({ item, onToggle, onDelete }) {
  return (
    <div className="flex items-center gap-3 py-2 group">
      <button
        onClick={() => onToggle(item)}
        className={clsx(
          'w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors',
          item.isPacked ? 'bg-accent border-accent' : 'border-surface-border'
        )}
        aria-label={item.isPacked ? 'Mark as not packed' : 'Mark as packed'}
      >
        {item.isPacked && <Check className="w-3 h-3 text-bg" strokeWidth={3} />}
      </button>

      <span className={clsx('flex-1 text-sm', item.isPacked ? 'line-through text-text-faint' : 'text-text')}>
        {item.itemName}
        {item.quantity > 1 && <span className="data-mono text-xs ml-1.5">×{item.quantity}</span>}
      </span>

      <button
        onClick={() => onDelete(item)}
        className="opacity-0 group-hover:opacity-100 text-text-faint hover:text-danger transition-opacity text-xs"
        aria-label="Remove"
      >
        Remove
      </button>
    </div>
  );
}