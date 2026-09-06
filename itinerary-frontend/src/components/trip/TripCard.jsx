import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import Badge from '../common/Badge';
import { formatDateRange, tripDurationDays } from '../../utils/dateHelpers';

export default function TripCard({ trip }) {
  const nights = tripDurationDays(trip.startDate, trip.endDate);

  return (
    <Link
      to={`/trips/${trip.id}`}
      className="card card-hover block p-5 group relative overflow-hidden"
    >
      <div className="flex items-start justify-between mb-4">
        <Badge tone={trip.status}>{trip.status.toLowerCase()}</Badge>
        <ArrowRight className="w-4 h-4 text-text-faint group-hover:text-accent group-hover:translate-x-0.5 transition-all" strokeWidth={1.75} />
      </div>

      <h3 className="font-display text-xl mb-2 truncate">
        {trip.title}
      </h3>

      <div className="flex items-center gap-4 text-sm text-text-muted">
        <span className="data-mono">{formatDateRange(trip.startDate, trip.endDate)}</span>
      </div>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-surface-border">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-text-faint" strokeWidth={1.75} />
          <span className="data-mono text-xs">
            {trip.destinationCount} {trip.destinationCount === 1 ? 'stop' : 'stops'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-display text-lg leading-none text-text">{nights}</span>
          <span className="data-mono text-xs">{nights === 1 ? 'day' : 'days'}</span>
        </div>
      </div>
    </Link>
  );
}