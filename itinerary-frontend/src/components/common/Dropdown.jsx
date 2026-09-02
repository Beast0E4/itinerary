import React from 'react';

export default function Dropdown({ label, error, options, className, id, ...props }) {
  const selectId = id || props.name;
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-parchment/90">
          {label}
        </label>
      )}
      <select id={selectId} className="input-field appearance-none cursor-pointer" {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}