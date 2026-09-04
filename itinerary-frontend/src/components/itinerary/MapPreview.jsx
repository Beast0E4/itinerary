import React, { useMemo } from 'react';

/**
 * A lightweight, dependency-free preview of where a day's stops sit
 * relative to each other, plotted from lat/lng onto a simple SVG canvas.
 *
 * This is NOT a real map (no tiles, no streets) — it's a quick spatial
 * sanity-check so people can see "these three stops are clustered" vs
 * "this one is way out on its own" without wiring up a maps API key.
 *
 * If/when a maps provider is added, swap this component's internals for
 * an embedded map — the `items` prop shape (needs .latitude/.longitude)
 * stays the same either way.
 */
export default function MapPreview({ items = [] }) {
  const points = useMemo(
    () => items.filter((i) => i.latitude != null && i.longitude != null),
    [items]
  );

  if (points.length === 0) {
    return (
      <div className="ticket p-6 flex flex-col items-center justify-center text-center h-48">
        <svg viewBox="0 0 48 48" width="32" height="32" className="mb-2 text-route-soft" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M24 44s14-12 14-24a14 14 0 1 0-28 0c0 12 14 24 14 24Z" strokeLinejoin="round" />
          <circle cx="24" cy="20" r="5" />
        </svg>
        <p className="text-sm text-parchment-text/50">
          No stops with a location yet — add coordinates to see them plotted here.
        </p>
      </div>
    );
  }

  // Normalize lat/lng into a 0–1 range so the plot fits a fixed viewBox
  // regardless of the actual geographic scale.
  const lats = points.map((p) => p.latitude);
  const lngs = points.map((p) => p.longitude);
  const [minLat, maxLat] = [Math.min(...lats), Math.max(...lats)];
  const [minLng, maxLng] = [Math.min(...lngs), Math.max(...lngs)];
  const latSpan = maxLat - minLat || 1;
  const lngSpan = maxLng - minLng || 1;

  const PAD = 24;
  const W = 400;
  const H = 220;

  const toXY = (lat, lng) => {
    const x = PAD + ((lng - minLng) / lngSpan) * (W - PAD * 2);
    // Latitude increases northward but SVG y increases downward — flip it.
    const y = H - PAD - ((lat - minLat) / latSpan) * (H - PAD * 2);
    return [x, y];
  };

  const pathD = points
    .map((p, i) => {
      const [x, y] = toXY(p.latitude, p.longitude);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <div className="ticket p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        {points.length > 1 && (
          <path d={pathD} className="route-line" strokeDasharray="none" />
        )}
        {points.map((p, i) => {
          const [x, y] = toXY(p.latitude, p.longitude);
          return (
            <g key={p.id ?? i}>
              <circle cx={x} cy={y} r={6} className="waypoint-dot" />
              <text
                x={x + 10}
                y={y + 4}
                className="fill-parchment-text/70"
                style={{ font: '10px "IBM Plex Mono", monospace' }}
              >
                {p.title?.slice(0, 18)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}