import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-surface-hair px-6 sm:px-10 py-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="font-display text-lg text-parchment">Atlas</span>
        <p className="data-mono text-xs text-muted">Built for the next trip.</p>
      </div>
    </footer>
  );
}