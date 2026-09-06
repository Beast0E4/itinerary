import React, { useMemo } from 'react';
import { MapPin } from 'lucide-react';

export default function MapPreview({ items = [] }) {
  const points = useMemo(
    () => items.filter((i) => i.latitude != null && i.longitude != null),
    [items]
  );

  if (points.length === 0) {
    return (
      <div className="card p-6 flex flex-col items-center justify-center text-center h-48">
        <MapPin className="w-6 h-6 text-text-faint mb-2" strokeWidth={1.5} />
        <p className="text-sm text-text-muted">
          No stops with a location yet — add coordinates to see them plotted here.
        </p>
      </div>
    );
  }

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
    <div className="card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        {points.length > 1 && <path d={pathD} className="route-line" />}
        {points.map((p, i) => {
          const [x, y] = toXY(p.latitude, p.longitude);
          return (
            <g key={p.id ?? i}>
              <circle cx={x} cy={y} r={6} className="waypoint-dot" />
              <text
                x={x + 10}
                y={y + 4}
                fill="#8FA39C"
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