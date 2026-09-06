import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppDispatch } from '../app/hooks';
import { createTrip } from '../features/trips/tripsSlice';
import TripForm from '../components/trip/TripForm';

export default function TripCreatePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (form) => {
    setSubmitting(true);
    const result = await dispatch(createTrip(form));
    setSubmitting(false);

    if (createTrip.fulfilled.match(result)) {
      toast.success('Trip created');
      navigate(`/trips/${result.payload.id}`);
    } else {
      toast.error(result.payload || 'Could not create trip');
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-display-md mb-1">Plan a new trip</h1>
      <p className="text-sm text-text-muted mb-8">Start loose — dates and a title are all you need.</p>
      <div className="card p-6">
        <TripForm onSubmit={handleSubmit} submitting={submitting} />
      </div>
    </div>
  );
}