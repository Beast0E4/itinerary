import React from 'react';
import clsx from 'clsx';

// Maps trip/collaborator status values to one of the four semantic badge
// tones defined in index.css (accent / warn / danger / muted).
const TONE_CLASS = {
  PLANNING: 'badge-warn',
  UPCOMING: 'badge-accent',
  ONGOING: 'badge-accent',
  COMPLETED: 'badge-muted',
  CANCELLED: 'badge-danger',
};

export default function Badge({ children, tone, className }) {
  const toneClass = TONE_CLASS[tone] || 'badge-muted';
  return <span className={clsx(toneClass, className)}>{children}</span>;
}