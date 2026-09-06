import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

/**
 * A labeled input that collects a list of short text values as removable
 * chips — e.g. "places you want to visit". Press Enter or click Add to
 * commit the current text as a new tag; click the x on a chip to remove it.
 */
export default function TagInput({ label, hint, values, onChange, placeholder }) {
  const [draft, setDraft] = useState('');

  const commit = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    if (values.some((v) => v.toLowerCase() === trimmed.toLowerCase())) {
      setDraft('');
      return; // no duplicates
    }
    onChange([...values, trimmed]);
    setDraft('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commit();
    }
  };

  const removeAt = (index) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-text">{label}</label>}

      <div className="flex gap-2">
        <input
          className="input-field"
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          onClick={commit}
          className="btn-secondary !px-3 shrink-0"
          aria-label="Add"
        >
          <Plus className="w-4 h-4" strokeWidth={1.75} />
        </button>
      </div>

      {values.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {values.map((value, i) => (
            <span
              key={`${value}-${i}`}
              className="inline-flex items-center gap-1.5 bg-accent-subtle text-accent text-xs font-medium px-2.5 py-1 rounded-full"
            >
              {value}
              <button
                type="button"
                onClick={() => removeAt(i)}
                aria-label={`Remove ${value}`}
                className="hover:text-text transition-colors"
              >
                <X className="w-3 h-3" strokeWidth={2} />
              </button>
            </span>
          ))}
        </div>
      )}

      {hint && <p className="text-xs text-text-faint">{hint}</p>}
    </div>
  );
}