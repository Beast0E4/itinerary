import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Sparkles, Route } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useTripId } from '../hooks/useTripId';
import {
  fetchItinerary,
  addItineraryItem,
  updateItineraryItem,
  deleteItineraryItem,
  reorderItineraryItems,
  reorderLocally,
  generateDays,
  selectItineraryDays,
  selectItineraryStatus,
} from '../features/itinerary/itinerarySlice';
import {
  applyAiPlan,
  clearAiPlan,
  streamStarted,
  progressReceived,
  streamSucceeded,
  streamFailed,
  selectAiPlan,
  selectAiPlanStatus,
  selectAiApplyStatus,
  selectAiProgressLog,
  selectAiError,
} from '../features/ai/aiSlice';
import DragDropItineraryBoard from '../components/itinerary/DragDropItineraryBoard';
import ItemFormModal from '../components/itinerary/ItemFormModal';
import AiPlanModal from '../components/itinerary/AiPlanModal';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';

export default function ItineraryBuilderPage() {
  const dispatch = useAppDispatch();
  const tripId = useTripId();
  const location = useLocation();
  const navigate = useNavigate();
  const days = useAppSelector(selectItineraryDays);
  const status = useAppSelector(selectItineraryStatus);
  const aiPlan = useAppSelector(selectAiPlan);
  const aiPlanStatus = useAppSelector(selectAiPlanStatus);
  const aiApplyStatus = useAppSelector(selectAiApplyStatus);
  const aiProgressLog = useAppSelector(selectAiProgressLog);
  const aiError = useAppSelector(selectAiError);

  const [modalOpen, setModalOpen] = useState(false);
  const [activeDay, setActiveDay] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(Boolean(location.state?.openAiPlan));

  // Arriving here right after trip creation opens the AI modal automatically.
  // Clear the navigation flag so refreshing or coming back later doesn't
  // reopen it unexpectedly.
  useEffect(() => {
    if (location.state?.openAiPlan) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (tripId) dispatch(fetchItinerary(tripId));
  }, [tripId, dispatch]);

  const openAddModal = (day) => {
    setActiveDay(day);
    setEditingItem(null);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    const day = days.find((d) => d.id === item.itineraryDayId);
    setActiveDay(day);
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleSubmit = async (form) => {
    setSubmitting(true);
    const payload = { ...form, itineraryDayId: activeDay.id };

    const result = editingItem
      ? await dispatch(updateItineraryItem({ tripId, itemId: editingItem.id, payload }))
      : await dispatch(addItineraryItem({ tripId, payload }));

    setSubmitting(false);

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(editingItem ? 'Stop updated' : 'Added to itinerary');
      setModalOpen(false);
    } else {
      toast.error(result.payload || 'Something went wrong');
    }
  };

  const handleDelete = async (item) => {
    const day = days.find((d) => d.id === item.itineraryDayId);
    const result = await dispatch(deleteItineraryItem({ tripId, itemId: item.id, dayId: day.id }));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Removed from itinerary');
    }
  };

  const handleReorder = (dayId, orderedItemIds) => {
    dispatch(reorderLocally({ dayId, orderedItemIds }));
    dispatch(reorderItineraryItems({ tripId, dayId, orderedItemIds }));
  };

  const handleGenerate = async () => {
    setGenerating(true);
    const result = await dispatch(generateDays(tripId));
    setGenerating(false);
    if (result.meta.requestStatus !== 'fulfilled') {
      toast.error(result.payload || 'Could not set up the itinerary');
    }
  };

  const handleApplyAiPlan = async () => {
    const result = await dispatch(applyAiPlan({ tripId, plan: aiPlan }));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('AI plan applied to your trip');
      setAiModalOpen(false);
      dispatch(fetchItinerary(tripId));
    } else {
      toast.error(result.payload || 'Could not apply the plan');
    }
  };

  if (status === 'loading' && days.length === 0) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      {days.length > 0 && (
        <div className="flex justify-end mb-6">
          <Button variant="secondary" onClick={() => setAiModalOpen(true)}>
            <Sparkles className="w-4 h-4" strokeWidth={1.75} />
            Plan with AI
          </Button>
        </div>
      )}

      {days.length === 0 ? (
        <EmptyState
          icon={Route}
          title="No days on the map yet"
          description="Generate a day for each date of your trip, then start adding stops — or let AI propose a full plan from your budget and starting point."
          action={
            <div className="flex flex-col sm:flex-row gap-3">
              <Button loading={generating} onClick={handleGenerate}>
                Generate empty days
              </Button>
              <Button variant="secondary" onClick={() => setAiModalOpen(true)}>
                <Sparkles className="w-4 h-4" strokeWidth={1.75} />
                Plan with AI
              </Button>
            </div>
          }
        />
      ) : (
        <DragDropItineraryBoard
          days={days}
          onAddItem={openAddModal}
          onEditItem={openEditModal}
          onDeleteItem={handleDelete}
          onReorder={handleReorder}
        />
      )}

      <ItemFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialValues={editingItem}
        submitting={submitting}
      />

      <AiPlanModal
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        tripId={tripId}
        plan={aiPlan}
        planStatus={aiPlanStatus}
        applyStatus={aiApplyStatus}
        progressLog={aiProgressLog}
        error={aiError}
        onStreamStart={() => dispatch(streamStarted())}
        onProgress={(message) => dispatch(progressReceived(message))}
        onStreamComplete={(plan) => dispatch(streamSucceeded(plan))}
        onStreamError={(message) => dispatch(streamFailed(message))}
        onApplyPlan={handleApplyAiPlan}
        onDiscard={() => dispatch(clearAiPlan())}
      />
    </div>
  );
}