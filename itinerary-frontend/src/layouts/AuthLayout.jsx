import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-ink">
      {/* Left: form panel */}
      <div className="flex flex-col justify-center px-8 sm:px-16 py-12">
        <Link to="/" className="mb-12 inline-flex items-baseline gap-2 w-fit">
          <span className="font-display text-2xl text-parchment">Atlas</span>
          <span className="data-mono text-muted text-xs">/ travel journal</span>
        </Link>
        <div className="max-w-sm w-full">
          <Outlet />
        </div>
      </div>

      {/* Right: route-line visual, hidden on small screens */}
      <div className="hidden lg:flex relative items-center justify-center bg-surface overflow-hidden">
        <svg viewBox="0 0 400 500" className="w-3/4" aria-hidden="true">
          <path
            d="M 60 460 C 120 380, 40 300, 110 220 S 260 140, 220 60"
            className="route-line animate-draw-route"
          />
          {[
            [60, 460],
            [110, 220],
            [220, 60],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={7} className="waypoint-dot" />
          ))}
        </svg>
        <p className="absolute bottom-12 left-12 right-12 font-display text-display-md text-parchment leading-tight">
          Plan the route.
          <br />
          Not just the dates.
        </p>
      </div>
    </div>
  );
}