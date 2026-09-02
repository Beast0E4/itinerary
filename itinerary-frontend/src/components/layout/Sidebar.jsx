import React from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '../../hooks/useAuth';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Trips', icon: TripsIcon },
  { to: '/trips/new', label: 'New trip', icon: PlusIcon },
];

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="w-60 shrink-0 hidden md:flex flex-col bg-surface stub-edge pl-4">
      <div className="px-4 pt-7 pb-6">
        <span className="font-display text-xl text-parchment">Atlas</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-stub text-sm font-medium transition-colors',
                isActive
                  ? 'bg-route/15 text-route-bright'
                  : 'text-muted hover:text-parchment hover:bg-surface-raised'
              )
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-surface-hair mt-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-waypoint/20 text-waypoint flex items-center justify-center font-mono text-xs font-semibold">
            {user?.fullName?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-parchment truncate">{user?.fullName}</p>
            <p className="data-mono text-xs text-muted truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function TripsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M3 18c3-6 6-3 9-9s6-3 9-9" strokeLinecap="round" />
      <circle cx="3" cy="18" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="21" cy="0" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PlusIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}