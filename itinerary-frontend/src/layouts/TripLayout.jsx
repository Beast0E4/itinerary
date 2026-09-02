import React, { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useTripId } from '../hooks/useTripId';
import { fetchTrip, selectCurrentTrip, selectTripDetailStatus, clearCurrentTrip } from '../features/trips/tripsSlice';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import Spinner from '../components/common/Spinner';
import { formatDateRange } from '../utils/dateHelpers';
import clsx from 'clsx';

const TABS = [
  { to: '', label: 'Overview', end: true },
  { to: 'itinerary', label: 'Itinerary' },
  { to: 'budget', label: 'Budget' },
  { to: 'packing', label: 'Packing' },
  { to: 'collaborators', label: 'Collaborators' },
];

export default function TripLayout() {
  const dispatch = useAppDispatch();
  const tripId = useTripId();
  const trip = useAppSelector(selectCurrentTrip);
  const status = useAppSelector(selectTripDetailStatus);
  const navigate = useNavigate();

  useEffect(() => {
    if (tripId) dispatch(fetchTrip(tripId));
    return () => dispatch(clearCurrentTrip());
  }, [tripId, dispatch]);

  return (
    <div className="min-h-screen flex bg-ink">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 px-6 sm:px-10 py-8 max-w-6xl w-full mx-auto">
          {status === 'loading' && !trip ? (
            <div className="flex justify-center py-24">
              <Spinner />
            </div>
          ) : status === 'failed' ? (
            <div className="ticket p-8 text-center">
              <p className="font-display text-xl mb-2">This trip isn't reachable</p>
              <p className="text-sm text-parchment-text/70 mb-4">
                It may have been removed, or you may not have access.
              </p>
              <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
                Back to dashboard
              </button>
            </div>
          ) : trip ? (
            <>
              <header className="mb-8">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="data-mono text-xs text-muted hover:text-route-bright transition-colors mb-3"
                >
                  ← all trips
                </button>
                <h1 className="font-display text-display-md">{trip.title}</h1>
                <p className="data-mono text-sm text-muted mt-1">
                  {formatDateRange(trip.startDate, trip.endDate)}
                </p>
              </header>

              <nav className="flex gap-1 border-b border-surface-hair mb-8 overflow-x-auto">
                {TABS.map((tab) => (
                  <NavLink
                    key={tab.label}
                    to={tab.to}
                    end={tab.end}
                    className={({ isActive }) =>
                      clsx(
                        'px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
                        isActive
                          ? 'border-route text-route-bright'
                          : 'border-transparent text-muted hover:text-parchment'
                      )
                    }
                  >
                    {tab.label}
                  </NavLink>
                ))}
              </nav>

              <Outlet />
            </>
          ) : null}
        </main>
      </div>
    </div>
  );
}