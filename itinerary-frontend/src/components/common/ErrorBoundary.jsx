import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // In a real deployment, ship this to an error-tracking service.
    console.error('Atlas render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-ink px-6 text-center">
          <h1 className="font-display text-display-md mb-2">Something went off course</h1>
          <p className="text-sm text-muted mb-6 max-w-xs">
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