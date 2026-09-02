import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-ink px-6 text-center">
      <svg viewBox="0 0 120 120" width="80" height="80" className="mb-6 text-route-soft" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="60" cy="60" r="45" strokeDasharray="6 6" />
        <path d="M40 70 L80 50" strokeLinecap="round" />
        <circle cx="40" cy="70" r="4" fill="currentColor" stroke="none" />
      </svg>
      <h1 className="font-display text-display-md mb-2">Off the map</h1>
      <p className="text-sm text-muted mb-6 max-w-xs">
        This page isn't on the route. Let's get you back to known ground.
      </p>
      <Link to="/dashboard" className="btn-primary">
        Back to your trips
      </Link>
    </div>
  );
}