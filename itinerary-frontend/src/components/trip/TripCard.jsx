import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import { formatDateRange, tripDurationDays } from '../../utils/dateHelpers';

export default function TripCard({ trip }) {
  const nights = tripDurationDays(trip.startDate, trip.endDate);

  return (
    <Link
      to={`/trips/${trip.id}`}
      className="ticket ticket-perf block p-0 overflow-hidden group"
      style={{ '--perf-left': '72%' }}
    >
      <div className="grid grid-cols-[1fr_auto]">
        <div className="p-5 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <Badge tone={trip.status}>{trip.status.toLowerCase()}</Badge>
            <span className="data-mono text-xs text-parchment-text/50">
              {trip.destinationCount} {trip.destinationCount === 1 ? 'stop' : 'stops'}
            </span>
          </div>
          <h3 className="font-display text-xl mb-1 truncate group-hover:text-route-soft transition-colors">
            {trip.title}
          </h3>
          <p className="data-mono text-xs text-parchment-text/60">
            {formatDateRange(trip.startDate, trip.endDate)}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center px-5 border-l border-dashed border-parchment-text/15 bg-parchment-dim/50">
          <span className="font-display text-3xl leading-none">{nights}</span>
          <span className="data-mono text-[10px] uppercase tracking-wide text-parchment-text/50 mt-1">
            {nights === 1 ? 'day' : 'days'}
          </span>
        </div>
      </div>
    </Link>
  );
}