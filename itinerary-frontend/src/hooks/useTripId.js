import { useParams } from 'react-router-dom';

export function useTripId() {
  const { tripId } = useParams();
  return tripId ? Number(tripId) : null;
}