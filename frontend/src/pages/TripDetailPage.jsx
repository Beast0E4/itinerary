import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Route } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useTripId } from '../hooks/useTripId';
import { selectCurrentTrip } from '../features/trips/tripsSlice';
import { fetchBudget, selectBudgetSummary } from '../features/budget/budgetSlice';
import { fetchItinerary, selectItineraryDays } from '../features/itinerary/itinerarySlice';
import TripHero from '../components/trip/TripHero';
import TripStatsBar from '../components/trip/TripStatsBar';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';

export default function TripDetailPage() {
  const dispatch = useAppDispatch();
  const tripId = useTripId();
  const trip = useAppSelector(selectCurrentTrip);
  const budgetSummary = useAppSelector(selectBudgetSummary);
  const days = useAppSelector(selectItineraryDays);

  useEffect(() => {
    if (tripId) {
      dispatch(fetchBudget(tripId));
      dispatch(fetchItinerary(tripId));
    }
  }, [tripId, dispatch]);

  if (!trip) return null;

  return (
    <div>
      <TripHero trip={trip} />

      <div className="space-y-8">
        <TripStatsBar trip={trip} budgetSummary={budgetSummary} dayCount={days.length} />

        {trip.description && (
          <div className="card p-6">
            <h2 className="text-sm font-medium text-text-muted mb-2">About this trip</h2>
            <p className="text-text leading-relaxed">{trip.description}</p>
          </div>
        )}

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-text-muted">Route so far</h2>
            <Link
              to={`/trips/${tripId}/itinerary`}
              className="text-sm text-accent hover:text-accent-hover hover:underline flex items-center gap-1"
            >
              Open itinerary builder
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
            </Link>
          </div>

          {days.length === 0 ? (
            <EmptyState
              icon={Route}
              title="No days planned yet"
              description="Add your first stop and Compass will lay out the route as you go."
              action={
                <Link to={`/trips/${tripId}/itinerary`}>
                  <Button>Start the itinerary</Button>
                </Link>
              }
            />
          ) : (
            <div className="card p-6 grid sm:grid-cols-3 gap-4">
              {days.slice(0, 6).map((day) => (
                <div key={day.id} className="border-l-2 border-accent pl-3">
                  <p className="data-mono text-xs">Day {day.dayNumber}</p>
                  <p className="font-medium text-sm text-text truncate">
                    {day.title || `${day.items.length} planned`}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}