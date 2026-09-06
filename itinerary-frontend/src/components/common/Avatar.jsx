import React from 'react';
import clsx from 'clsx';

export default function Avatar({ name, size = 'md', className }) {
  const initial = name?.[0]?.toUpperCase() || '?';
  const sizes = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
  };
  return (
    <div
      className={clsx(
        'rounded-full bg-accent-subtle text-accent flex items-center justify-center font-semibold shrink-0',
        sizes[size],
        className
      )}
    >
      {initial}
    </div>
  );
}