import React from 'react';
import { Compass } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-surface-border px-6 sm:px-10 py-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-accent" strokeWidth={2} />
          <span className="font-display text-lg text-text">Compass</span>
        </div>
        <p className="data-mono text-xs">Built for the next trip.</p>
      </div>
    </footer>
  );
}