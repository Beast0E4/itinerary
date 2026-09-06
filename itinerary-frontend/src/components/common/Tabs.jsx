import React from 'react';
import clsx from 'clsx';

export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="inline-flex bg-bg-soft border border-surface-border rounded-md p-1 gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={clsx(
            'px-3.5 py-1.5 rounded-sm text-sm font-medium transition-colors',
            active === tab.value
              ? 'bg-accent text-bg'
              : 'text-text-muted hover:text-text'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}