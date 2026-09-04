import React from 'react';
import Badge from '../common/Badge';
import { formatDateRange } from '../../utils/dateHelpers';

/**
 * Full-width banner for the top of TripDetailPage. Shows the trip's cover
 * image if one was set; otherwise falls back to the same route-line motif
 * used on the landing/auth screens so the app never shows a blank hero.
 */
export default function TripHero({ trip }) {
  const hasCover = Boolean(trip.coverImageUrl);

  return (
    <div className="relative rounded-ticket overflow-hidden h-56 sm:h-64 mb-8">
      {hasCover ? (
        <img
          src={trip.coverImageUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-surface">
          <svg viewBox="0 0 600 220" className="w-full h-full opacity-40" preserveAspectRatio="xMidYMid slice">
            <path
              d="M 20 190 C 100 140, 60 90, 160 100 S 320 160, 360 80 S 480 20, 580 40"
              className="route-line"
              strokeDasharray="none"
            />
            {[
              [20, 190],
              [160, 100],
              [360, 80],
              [580, 40],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={5} className="waypoint-dot" />
            ))}
          </svg>
        </div>
      )}

      {/* Scrim so text stays legible over any image */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-2">
          <Badge tone={trip.status}>{trip.status.toLowerCase()}</Badge>
          <span className="data-mono text-xs text-parchment/70">
            {formatDateRange(trip.startDate, trip.endDate)}
          </span>
        </div>
        <h1 className="font-display text-display-md text-parchment drop-shadow-sm">
          {trip.title}
        </h1>
      </div>
    </div>
  );
}