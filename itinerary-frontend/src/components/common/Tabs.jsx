import React from 'react';
import clsx from 'clsx';

export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="inline-flex bg-surface rounded-stub p-1 gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={clsx(
            'px-3.5 py-1.5 rounded-stub text-sm font-medium transition-colors',
            active === tab.value
              ? 'bg-route text-ink'
              : 'text-muted hover:text-parchment'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}