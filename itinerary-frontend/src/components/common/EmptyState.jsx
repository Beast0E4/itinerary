import React from 'react';

export default function EmptyState({ title, description, action }) {
  return (
    <div className="ticket p-10 text-center flex flex-col items-center">
      <svg viewBox="0 0 64 64" width="48" height="48" className="mb-4 text-route-soft" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 52c8-16 16-8 24-24s16-8 24-24" strokeLinecap="round" strokeDasharray="4 5" />
        <circle cx="8" cy="52" r="3" />
        <circle cx="56" cy="4" r="3" />
      </svg>
      <h3 className="font-display text-lg mb-1.5">{title}</h3>
      <p className="text-sm text-parchment-text/70 max-w-xs mb-5">{description}</p>
      {action}
    </div>
  );
}