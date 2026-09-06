import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Footer from '../components/layout/Footer';
import { useAuth } from '../hooks/useAuth';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <header className="flex items-center justify-between px-6 sm:px-10 py-6">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-accent" strokeWidth={2} />
          <span className="font-display text-2xl text-text">Compass</span>
        </div>
        <nav className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-primary !py-2">
              Open trips
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-secondary !py-2">
                Sign in
              </Link>
              <Link to="/register" className="btn-primary !py-2">
                Start planning
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="flex-1 flex items-center px-6 sm:px-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center py-16">
          <div>
            <h1 className="font-display text-display-xl mb-6">
              Every trip
              <br />
              has a route.
            </h1>
            <p className="text-lg text-text-muted max-w-md mb-8 leading-relaxed">
              Compass lays your itinerary out as a path, not a spreadsheet —
              flights, stays, and plans connected day by day, with a shared
              budget and packing list along the way.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/register" className="btn-primary">
                Plan your first trip
              </Link>
              <Link to="/login" className="text-sm text-text-muted hover:text-text transition-colors">
                I already have an account
              </Link>
            </div>
          </div>

          <div className="relative">
            <svg viewBox="0 0 420 420" className="w-full" aria-hidden="true">
              <path
                d="M 30 380 C 100 320, 40 250, 130 220 S 250 280, 260 180 S 180 60, 300 30"
                className="route-line animate-draw-route"
                strokeDasharray="1000"
              />
              {[
                { x: 30, y: 380, label: 'Depart' },
                { x: 130, y: 220, label: 'Layover' },
                { x: 260, y: 180, label: 'Stay' },
                { x: 300, y: 30, label: 'Arrive' },
              ].map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r={7} className="waypoint-dot" />
                  <text
                    x={p.x + 14}
                    y={p.y + 4}
                    fill="#8FA39C"
                    style={{ font: '11px "IBM Plex Mono", monospace' }}
                  >
                    {p.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}