import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useTripId } from '../hooks/useTripId';
import { useAuth } from '../hooks/useAuth';
import {
  fetchCollaborators,
  inviteCollaborator,
  removeCollaborator,
  selectCollaborators,
  selectCollaboratorsStatus,
} from '../features/collaborators/collaboratorsSlice';
import { selectCurrentTrip } from '../features/trips/tripsSlice';
import CollaboratorList from '../components/collaborators/CollaboratorList';
import InviteModal from '../components/collaborators/InviteModal';
import Spinner from '../components/common/Spinner';

export default function CollaboratorsPage() {
  const dispatch = useAppDispatch();
  const tripId = useTripId();
  const { user } = useAuth();
  const trip = useAppSelector(selectCurrentTrip);
  const collaborators = useAppSelector(selectCollaborators);
  const status = useAppSelector(selectCollaboratorsStatus);

  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isOwner = trip?.ownerId === user?.id;

  useEffect(() => {
    if (tripId) dispatch(fetchCollaborators(tripId));
  }, [tripId, dispatch]);

  const handleInvite = async (form) => {
    setSubmitting(true);
    const result = await dispatch(inviteCollaborator({ tripId, payload: form }));
    setSubmitting(false);
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Invite sent');
      setModalOpen(false);
    } else {
      toast.error(result.payload || 'Could not send invite');
    }
  };

  const handleRemove = async (collaboratorUserId) => {
    const result = await dispatch(removeCollaborator({ tripId, collaboratorUserId }));
    if (result.meta.requestStatus === 'fulfilled') toast.success('Collaborator removed');
  };

  if (status === 'loading' && collaborators.length === 0) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <div className="ticket p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display text-lg">Who's planning this trip</h2>
          {isOwner && (
            <button onClick={() => setModalOpen(true)} className="text-sm text-route-bright hover:underline">
              + Invite
            </button>
          )}
        </div>
        <p className="text-sm text-parchment-text/50 mb-3">
          {isOwner ? 'You own this trip.' : 'You have collaborator access to this trip.'}
        </p>
        <CollaboratorList
          collaborators={collaborators}
          currentUserId={user?.id}
          isOwner={isOwner}
          onRemove={handleRemove}
        />
      </div>

      <InviteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleInvite}
        submitting={submitting}
      />
    </div>
  );
}