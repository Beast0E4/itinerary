import React from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { Compass, MapPinned, Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Trips', icon: MapPinned },
  { to: '/trips/new', label: 'New trip', icon: Plus },
];

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="w-60 shrink-0 hidden md:flex flex-col bg-surface border-r border-surface-border">
      <div className="px-5 pt-6 pb-6 flex items-center gap-2">
        <Compass className="w-5 h-5 text-accent" strokeWidth={2} />
        <span className="font-display text-xl text-text">Compass</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent-subtle text-accent'
                  : 'text-text-muted hover:text-text hover:bg-surface-hover'
              )
            }
          >
            <Icon className="w-4 h-4" strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-surface-border mt-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent-subtle text-accent flex items-center justify-center text-xs font-semibold">
            {user?.fullName?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-text truncate">{user?.fullName}</p>
            <p className="data-mono text-xs truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}