import React, { useState } from 'react';
import Input from '../common/Input';
import Dropdown from '../common/Dropdown';
import Button from '../common/Button';

const CURRENCIES = [
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'GBP', label: 'GBP — British Pound' },
  { value: 'INR', label: 'INR — Indian Rupee' },
  { value: 'JPY', label: 'JPY — Japanese Yen' },
];

export default function TripForm({ initialValues, onSubmit, submitting }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    primaryCurrency: 'USD',
    coverImageUrl: '',
    ...initialValues,
  });
  const [error, setError] = useState('');

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.endDate < form.startDate) {
      setError('End date must be on or after the start date.');
      return;
    }
    setError('');
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Trip title"
        placeholder="e.g. Two weeks through the Balkans"
        required
        value={form.title}
        onChange={update('title')}
      />

      <div>
        <label className="block text-sm font-medium text-parchment/90 mb-1.5">Description</label>
        <textarea
          className="input-field min-h-[88px] resize-y"
          placeholder="What's this trip about?"
          value={form.description}
          onChange={update('description')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Start date" type="date" required value={form.startDate} onChange={update('startDate')} />
        <Input label="End date" type="date" required value={form.endDate} onChange={update('endDate')} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Dropdown
          label="Primary currency"
          options={CURRENCIES}
          value={form.primaryCurrency}
          onChange={update('primaryCurrency')}
        />
        <Input
          label="Cover image URL"
          placeholder="Optional"
          value={form.coverImageUrl}
          onChange={update('coverImageUrl')}
        />
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <Button type="submit" loading={submitting} className="w-full">
        {initialValues ? 'Save changes' : 'Create trip'}
      </Button>
    </form>
  );
}