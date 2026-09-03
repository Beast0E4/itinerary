import React, { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Dropdown from '../common/Dropdown';
import Button from '../common/Button';
import { EXPENSE_CATEGORIES } from '../../utils/constants';

const EMPTY = {
  category: 'MISC',
  description: '',
  amount: '',
  currency: 'USD',
  expenseDate: new Date().toISOString().slice(0, 10),
};

export default function ExpenseFormModal({ open, onClose, onSubmit, initialValues, submitting }) {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (open) setForm(initialValues ? { ...EMPTY, ...initialValues } : EMPTY);
  }, [open, initialValues]);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, amount: Number(form.amount) });
  };

  return (
    <Modal open={open} onClose={onClose} title={initialValues ? 'Edit expense' : 'Log an expense'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Description" required value={form.description} onChange={update('description')} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Amount" type="number" step="0.01" min="0" required value={form.amount} onChange={update('amount')} />
          <Input label="Currency" value={form.currency} onChange={update('currency')} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Dropdown label="Category" options={EXPENSE_CATEGORIES} value={form.category} onChange={update('category')} />
          <Input label="Date" type="date" required value={form.expenseDate} onChange={update('expenseDate')} />
        </div>
        <Button type="submit" loading={submitting} className="w-full">
          {initialValues ? 'Save changes' : 'Add expense'}
        </Button>
      </form>
    </Modal>
  );
}