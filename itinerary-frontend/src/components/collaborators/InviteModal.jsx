import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Dropdown from '../common/Dropdown';
import Button from '../common/Button';
import { COLLABORATOR_ROLES } from '../../utils/constants';

export default function InviteModal({ open, onClose, onSubmit, submitting }) {
  const [form, setForm] = useState({ email: '', role: 'EDITOR' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ email: '', role: 'EDITOR' });
  };

  return (
    <Modal open={open} onClose={onClose} title="Invite a collaborator">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          required
          placeholder="friend@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Dropdown
          label="Role"
          options={COLLABORATOR_ROLES}
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        />
        <p className="text-xs text-parchment-text/50">
          They'll need an existing Atlas account with this email to accept.
        </p>
        <Button type="submit" loading={submitting} className="w-full">
          Send invite
        </Button>
      </form>
    </Modal>
  );
}