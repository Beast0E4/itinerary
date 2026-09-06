import React, { useEffect, useState } from 'react';
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
  requestAiPlan,
  applyAiPlan,
  clearAiPlan,
  selectAiPlan,
  selectAiPlanStatus,
  selectAiApplyStatus,
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
  const days = useAppSelector(selectItineraryDays);
  const status = useAppSelector(selectItineraryStatus);
  const aiPlan = useAppSelector(selectAiPlan);
  const aiPlanStatus = useAppSelector(selectAiPlanStatus);
  const aiApplyStatus = useAppSelector(selectAiApplyStatus);

  const [modalOpen, setModalOpen] = useState(false);
  const [activeDay, setActiveDay] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

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

  const handleRequestAiPlan = (payload) => {
    dispatch(requestAiPlan({ tripId, payload }));
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
        plan={aiPlan}
        planStatus={aiPlanStatus}
        applyStatus={aiApplyStatus}
        onRequestPlan={handleRequestAiPlan}
        onApplyPlan={handleApplyAiPlan}
        onDiscard={() => dispatch(clearAiPlan())}
      />
    </div>
  );
}