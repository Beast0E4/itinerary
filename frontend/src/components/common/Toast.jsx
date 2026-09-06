import React from 'react';
import toast from 'react-hot-toast';

export const atlasToast = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message || 'Something went wrong'),
  info: (message) => toast(message),
};

export function showUndoToast(message, durationMs = 4000) {
  return new Promise((resolve) => {
    let settled = false;

    const id = toast.custom(
      (t) => (
        <div
          className="card flex items-center gap-4 px-4 py-3"
          style={{ opacity: t.visible ? 1 : 0, transition: 'opacity 150ms' }}
        >
          <span className="text-sm text-text">{message}</span>
          <button
            onClick={() => {
              if (settled) return;
              settled = true;
              toast.dismiss(t.id);
              resolve(true);
            }}
            className="text-sm font-medium text-accent hover:text-accent-hover shrink-0"
          >
            Undo
          </button>
        </div>
      ),
      { duration: durationMs }
    );

    setTimeout(() => {
      if (settled) return;
      settled = true;
      toast.dismiss(id);
      resolve(false);
    }, durationMs);
  });
}

export default atlasToast;