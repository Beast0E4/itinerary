import { useState } from 'react';

/**
 * Wraps navigator.geolocation so components can request "use my current
 * location" with a single call, and gracefully fall back to manual entry
 * if the person declines or the browser doesn't support it.
 */
export function useGeolocation() {
  const [coords, setCoords] = useState(null); // { latitude, longitude }
  const [status, setStatus] = useState('idle'); // idle | loading | granted | denied | unsupported
  const [error, setError] = useState(null);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setStatus('unsupported');
      setError('Your browser does not support location access.');
      return;
    }

    setStatus('loading');
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setStatus('granted');
      },
      (err) => {
        setStatus('denied');
        setError(
          err.code === err.PERMISSION_DENIED
            ? 'Location access was denied — you can type your starting point instead.'
            : 'Could not determine your location — you can type your starting point instead.'
        );
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    );
  };

  return { coords, status, error, requestLocation };
}