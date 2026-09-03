import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useTripId } from '../hooks/useTripId';
import {
  fetchItinerary,
  addItineraryItem,
  updateItineraryItem,
  deleteItineraryItem,
  reorderItineraryItems,
  reorderLocally,
  selectItineraryDays,
  selectItineraryStatus,
} from '../features/itinerary/itinerarySlice';
import DayTimeline from '../components/itinerary/DayTimeline';
import ItemFormModal from '../components/itinerary/ItemFormModal';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';

export default function ItineraryBuilderPage() {
  const dispatch = useAppDispatch();
  const tripId = useTripId();
  const days = useAppSelector(selectItineraryDays);
  const status = useAppSelector(selectItineraryStatus);

  const [modalOpen, setModalOpen] = useState(false);
  const [activeDay, setActiveDay] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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

  if (status === 'loading' && days.length === 0) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  if (days.length === 0) {
    return (
      <EmptyState
        title="No days on the map yet"
        description="Days are created from your trip's date range. If you're not seeing any, double check the trip's start and end dates."
      />
    );
  }

  return (
    <div>
      {days.map((day) => (
        <DayTimeline
          key={day.id}
          day={day}
          onAddItem={openAddModal}
          onEditItem={openEditModal}
          onDeleteItem={handleDelete}
          onReorder={handleReorder}
        />
      ))}

      <ItemFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialValues={editingItem}
        submitting={submitting}
      />
    </div>
  );
}