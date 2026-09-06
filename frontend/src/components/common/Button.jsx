import React from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

export default function Button({
  variant = 'primary',
  className,
  loading = false,
  children,
  disabled,
  ...props
}) {
  const base =
    variant === 'primary' ? 'btn-primary' : variant === 'secondary' ? 'btn-secondary' : 'btn-ghost';
  return (
    <button className={clsx(base, className)} disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}