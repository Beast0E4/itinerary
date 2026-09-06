import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-6 text-center">
      <div className="w-14 h-14 rounded-full bg-accent-subtle flex items-center justify-center mb-5">
        <Compass className="w-7 h-7 text-accent" strokeWidth={1.75} />
      </div>
      <h1 className="font-display text-display-md mb-2">Off the map</h1>
      <p className="text-sm text-text-muted mb-6 max-w-xs">
        This page isn't on the route. Let's get you back to known ground.
      </p>
      <Link to="/dashboard" className="btn-primary">
        Back to your trips
      </Link>
    </div>
  );
}