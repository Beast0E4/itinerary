import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useTripId } from '../hooks/useTripId';
import {
  fetchPackingList,
  addPackingItem,
  updatePackingItem,
  deletePackingItem,
  togglePackedLocally,
  selectPackingItems,
  selectPackingStatus,
} from '../features/packing/packingSlice';
import PackingListGroup from '../components/packing/PackingListGroup';
import Input from '../components/common/Input';
import Dropdown from '../components/common/Dropdown';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';

const DEFAULT_CATEGORIES = ['Clothing', 'Documents', 'Electronics', 'Toiletries', 'General'];

export default function PackingListPage() {
  const dispatch = useAppDispatch();
  const tripId = useTripId();
  const items = useAppSelector(selectPackingItems);
  const status = useAppSelector(selectPackingStatus);

  const [form, setForm] = useState({ itemName: '', category: 'General', quantity: 1 });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (tripId) dispatch(fetchPackingList(tripId));
  }, [tripId, dispatch]);

  const grouped = items.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {});

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.itemName.trim()) return;
    setSubmitting(true);
    const result = await dispatch(
      addPackingItem({ tripId, payload: { ...form, quantity: Number(form.quantity) } })
    );
    setSubmitting(false);
    if (result.meta.requestStatus === 'fulfilled') {
      setForm({ itemName: '', category: form.category, quantity: 1 });
    } else {
      toast.error(result.payload || 'Could not add item');
    }
  };

  const handleToggle = (item) => {
    dispatch(togglePackedLocally(item.id));
    dispatch(updatePackingItem({ tripId, itemId: item.id, payload: { isPacked: !item.isPacked } }));
  };

  const handleDelete = async (item) => {
    const result = await dispatch(deletePackingItem({ tripId, itemId: item.id }));
    if (result.meta.requestStatus === 'fulfilled') toast.success('Removed');
  };

  if (status === 'loading' && items.length === 0) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleAdd} className="ticket p-5 mb-6 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[160px]">
          <Input
            label="Add item"
            placeholder="e.g. Passport"
            value={form.itemName}
            onChange={(e) => setForm({ ...form, itemName: e.target.value })}
          />
        </div>
        <div className="w-36">
          <Dropdown
            label="Category"
            options={DEFAULT_CATEGORIES.map((c) => ({ value: c, label: c }))}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
        </div>
        <div className="w-20">
          <Input
            label="Qty"
            type="number"
            min="1"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />
        </div>
        <Button type="submit" loading={submitting}>
          Add
        </Button>
      </form>

      {items.length === 0 ? (
        <EmptyState
          title="Nothing on the list yet"
          description="Add items above — group them by category to keep packing simple."
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {Object.entries(grouped).map(([category, groupItems]) => (
            <PackingListGroup
              key={category}
              category={category}
              items={groupItems}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}