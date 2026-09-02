import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-6 sm:px-10 border-b border-surface-hair">
      <span className="data-mono text-xs text-muted">
        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
      </span>

      <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden w-8 h-8 rounded-full bg-waypoint/20 text-waypoint flex items-center justify-center font-mono text-xs font-semibold"
        >
          {user?.fullName?.[0]?.toUpperCase() || '?'}
        </button>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="hidden md:inline-flex btn-secondary !px-3 !py-1.5 text-xs"
        >
          Sign out
        </button>

        {menuOpen && (
          <div className="md:hidden absolute right-0 mt-2 w-40 ticket p-2 shadow-lg z-20">
            <button
              onClick={() => {
                setMenuOpen(false);
                signOut();
                navigate('/');
              }}
              className="w-full text-left px-3 py-2 text-sm rounded-stub hover:bg-parchment-dim transition-colors"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}