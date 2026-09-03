import React from 'react';
import PackingItemRow from './PackingItemRow';

export default function PackingListGroup({ category, items, onToggle, onDelete }) {
  const packedCount = items.filter((i) => i.isPacked).length;

  return (
    <div className="ticket p-5">
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="font-medium text-sm">{category}</h3>
        <span className="data-mono text-xs text-parchment-text/40">
          {packedCount}/{items.length}
        </span>
      </div>
      <div className="divide-y divide-surface-hair/50">
        {items.map((item) => (
          <PackingItemRow key={item.id} item={item} onToggle={onToggle} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}