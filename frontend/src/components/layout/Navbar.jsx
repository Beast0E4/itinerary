import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-6 sm:px-10 border-b border-surface-border">
      <span className="data-mono text-xs">
        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
      </span>

      <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden w-8 h-8 rounded-full bg-accent-subtle text-accent flex items-center justify-center text-xs font-semibold"
        >
          {user?.fullName?.[0]?.toUpperCase() || '?'}
        </button>

        <button
          onClick={() => {
            signOut();
            navigate('/');
          }}
          className="hidden md:inline-flex btn-secondary !px-3 !py-1.5 text-xs gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" strokeWidth={1.75} />
          Sign out
        </button>

        {menuOpen && (
          <div className="md:hidden absolute right-0 mt-2 w-40 card p-2 z-20">
            <button
              onClick={() => {
                setMenuOpen(false);
                signOut();
                navigate('/');
              }}
              className="w-full text-left px-3 py-2 text-sm rounded-sm hover:bg-surface-hover transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.75} />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}