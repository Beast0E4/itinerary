import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-bg">
      <div className="flex flex-col justify-center px-8 sm:px-16 py-12">
        <Link to="/" className="mb-12 inline-flex items-center gap-2 w-fit">
          <Compass className="w-5 h-5 text-accent" strokeWidth={2} />
          <span className="font-display text-2xl text-text">Compass</span>
        </Link>
        <div className="max-w-sm w-full">
          <Outlet />
        </div>
      </div>

      <div className="hidden lg:flex relative items-center justify-center bg-surface overflow-hidden border-l border-surface-border">
        <svg viewBox="0 0 400 500" className="w-3/4" aria-hidden="true">
          <path
            d="M 60 460 C 120 380, 40 300, 110 220 S 260 140, 220 60"
            className="route-line animate-draw-route"
            strokeDasharray="1000"
          />
          {[
            [60, 460],
            [110, 220],
            [220, 60],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={6} className="waypoint-dot" />
          ))}
        </svg>
        <p className="absolute bottom-12 left-12 right-12 font-display text-display-md text-text leading-tight">
          Plan the route.
          <br />
          Not just the dates.
        </p>
      </div>
    </div>
  );
}