import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Spinner({ size = 24, className = '' }) {
  return (
    <Loader2
      className={`animate-spin text-accent ${className}`}
      width={size}
      height={size}
      aria-label="Loading"
    />
  );
}