import React from 'react';
import { Compass } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Compass render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-6 text-center">
          <div className="w-14 h-14 rounded-full bg-accent-subtle flex items-center justify-center mb-5">
            <Compass className="w-7 h-7 text-accent" strokeWidth={1.75} />
          </div>
          <h1 className="font-display text-display-md mb-2">Something went off course</h1>
          <p className="text-sm text-text-muted mb-6 max-w-xs">
            The page hit an unexpected error. Reloading usually fixes it.
          </p>
          <button className="btn-primary" onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}