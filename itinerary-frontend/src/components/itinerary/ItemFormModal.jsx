import React, { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Dropdown from '../common/Dropdown';
import Button from '../common/Button';
import { ITEM_TYPES } from '../../utils/constants';

const EMPTY = {
  itemType: 'ACTIVITY',
  title: '',
  description: '',
  locationName: '',
  startTime: '',
  endTime: '',
  cost: '',
  currency: 'USD',
  bookingRef: '',
  externalUrl: '',
};

export default function ItemFormModal({ open, onClose, onSubmit, initialValues, submitting }) {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (open) setForm(initialValues ? { ...EMPTY, ...initialValues } : EMPTY);
  }, [open, initialValues]);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      cost: form.cost === '' ? null : Number(form.cost),
      startTime: form.startTime || null,
      endTime: form.endTime || null,
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={initialValues ? 'Edit stop' : 'Add to itinerary'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Dropdown label="Type" options={ITEM_TYPES} value={form.itemType} onChange={update('itemType')} />
        <Input label="Title" required value={form.title} onChange={update('title')} />
        <Input label="Location" value={form.locationName} onChange={update('locationName')} />

        <div className="grid grid-cols-2 gap-4">
          <Input label="Start time" type="time" value={form.startTime || ''} onChange={update('startTime')} />
          <Input label="End time" type="time" value={form.endTime || ''} onChange={update('endTime')} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Cost" type="number" step="0.01" min="0" value={form.cost} onChange={update('cost')} />
          <Input label="Currency" value={form.currency} onChange={update('currency')} />
        </div>

        <Input label="Booking reference" value={form.bookingRef} onChange={update('bookingRef')} />

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Notes</label>
          <textarea
            className="input-field min-h-[70px] resize-y"
            value={form.description}
            onChange={update('description')}
          />
        </div>

        <Button type="submit" loading={submitting} className="w-full">
          {initialValues ? 'Save changes' : 'Add to day'}
        </Button>
      </form>
    </Modal>
  );
}