import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchTrips, selectAllTrips, selectTripsListStatus } from '../features/trips/tripsSlice';
import { useAuth } from '../hooks/useAuth';
import TripCard from '../components/trip/TripCard';
import EmptyState from '../components/common/EmptyState';
import Spinner from '../components/common/Spinner';
import Button from '../components/common/Button';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const trips = useAppSelector(selectAllTrips);
  const status = useAppSelector(selectTripsListStatus);
  const { user } = useAuth();

  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);

  const upcoming = trips.filter((t) => t.status !== 'COMPLETED' && t.status !== 'CANCELLED');
  const past = trips.filter((t) => t.status === 'COMPLETED' || t.status === 'CANCELLED');

  return (
    <div>
      <header className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-display-md">
            {greeting()}, {user?.fullName?.split(' ')[0]}
          </h1>
          <p className="text-sm text-muted mt-1">
            {trips.length === 0 ? 'No trips yet' : `${upcoming.length} trip${upcoming.length === 1 ? '' : 's'} in motion`}
          </p>
        </div>
        <Link to="/trips/new" className="btn-primary">
          Plan a trip
        </Link>
      </header>

      {status === 'loading' && trips.length === 0 ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : trips.length === 0 ? (
        <EmptyState
          title="Your atlas is empty"
          description="Start with the dates and a destination — you can fill in the route as plans firm up."
          action={
            <Link to="/trips/new">
              <Button>Plan your first trip</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-10">
          {upcoming.length > 0 && (
            <section>
              <h2 className="text-sm font-medium text-muted mb-3">Upcoming & in planning</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {upcoming.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </section>
          )}

          {past.length > 0 && (
            <section>
              <h2 className="text-sm font-medium text-muted mb-3">Past trips</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {past.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}