import React from 'react';
import { Compass } from 'lucide-react';

export default function EmptyState({ title, description, action, icon: Icon = Compass }) {
  return (
    <div className="card p-10 text-center flex flex-col items-center">
      <div className="w-12 h-12 rounded-full bg-accent-subtle flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-accent" strokeWidth={1.75} />
      </div>
      <h3 className="font-display text-lg mb-1.5">{title}</h3>
      <p className="text-sm text-text-muted max-w-xs mb-5">{description}</p>
      {action}
    </div>
  );
}