import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useTripId } from '../hooks/useTripId';
import { selectCurrentTrip } from '../features/trips/tripsSlice';
import { fetchBudget, selectBudgetSummary } from '../features/budget/budgetSlice';
import { fetchItinerary, selectItineraryDays } from '../features/itinerary/itinerarySlice';
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
    <div className="space-y-8">
      <TripStatsBar trip={trip} budgetSummary={budgetSummary} dayCount={days.length} />

      {trip.description && (
        <div className="ticket p-6">
          <h2 className="text-sm font-medium text-parchment-text/60 mb-2">About this trip</h2>
          <p className="text-parchment-text leading-relaxed">{trip.description}</p>
        </div>
      )}

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-muted">Route so far</h2>
          <Link to={`/trips/${tripId}/itinerary`} className="text-sm text-route-bright hover:underline">
            Open itinerary builder →
          </Link>
        </div>

        {days.length === 0 ? (
          <EmptyState
            title="No days planned yet"
            description="Add your first stop and Atlas will lay out the route as you go."
            action={
              <Link to={`/trips/${tripId}/itinerary`}>
                <Button>Start the itinerary</Button>
              </Link>
            }
          />
        ) : (
          <div className="ticket p-6 grid sm:grid-cols-3 gap-4">
            {days.slice(0, 6).map((day) => (
              <div key={day.id} className="border-l-2 border-route pl-3">
                <p className="data-mono text-xs text-parchment-text/50">Day {day.dayNumber}</p>
                <p className="font-medium text-sm truncate">{day.title || `${day.items.length} planned`}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}