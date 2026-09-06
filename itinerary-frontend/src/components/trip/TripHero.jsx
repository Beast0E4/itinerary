import React from 'react';
import Badge from '../common/Badge';
import { formatDateRange } from '../../utils/dateHelpers';

export default function TripHero({ trip }) {
  const hasCover = Boolean(trip.coverImageUrl);

  return (
    <div className="relative rounded-lg overflow-hidden h-56 sm:h-64 mb-8 border border-surface-border">
      {hasCover ? (
        <img
          src={trip.coverImageUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-surface">
          <svg viewBox="0 0 600 220" className="w-full h-full opacity-30" preserveAspectRatio="xMidYMid slice">
            <path
              d="M 20 190 C 100 140, 60 90, 160 100 S 320 160, 360 80 S 480 20, 580 40"
              className="route-line"
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

      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-2">
          <Badge tone={trip.status}>{trip.status.toLowerCase()}</Badge>
          <span className="data-mono text-xs">
            {formatDateRange(trip.startDate, trip.endDate)}
          </span>
        </div>
        <h1 className="font-display text-display-md text-text">
          {trip.title}
        </h1>
      </div>
    </div>
  );
}