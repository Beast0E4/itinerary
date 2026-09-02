import React from 'react';
import clsx from 'clsx';

const STATUS_COLORS = {
  PLANNING: 'text-waypoint',
  UPCOMING: 'text-route-bright',
  ONGOING: 'text-route-bright',
  COMPLETED: 'text-muted',
  CANCELLED: 'text-danger',
};

export default function Badge({ children, tone, className }) {
  const color = STATUS_COLORS[tone] || 'text-muted';
  return <span className={clsx('badge-stamp', color, className)}>{children}</span>;
}