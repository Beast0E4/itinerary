import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function Dropdown({ label, error, options, className, id, ...props }) {
  const selectId = id || props.name;
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-text">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className="input-field appearance-none cursor-pointer pr-9"
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-text-faint absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}