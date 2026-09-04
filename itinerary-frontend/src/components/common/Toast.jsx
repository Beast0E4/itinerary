import React from 'react';
import toast from 'react-hot-toast';

/**
 * Thin wrapper around react-hot-toast so call sites use consistent,
 * pre-written copy instead of ad-hoc strings scattered across pages.
 * The visual styling (colors, border, font) is set once in main.jsx's
 * <Toaster toastOptions>; this module only standardizes *when* and
 * *what* toasts say.
 */
export const atlasToast = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message || 'Something went wrong'),
  info: (message) => toast(message),
};

/**
 * A toast with an inline "Undo" action, for destructive operations
 * (deleting an itinerary item, an expense, a packing item) where an
 * immediate irreversible delete feels risky. Call the returned promise's
 * resolution to know whether the person clicked undo before it expired.
 *
 * Usage:
 *   const undone = await showUndoToast("Stop removed");
 *   if (undone) { // re-add it, or skip the delete API call }
 */
export function showUndoToast(message, durationMs = 4000) {
  return new Promise((resolve) => {
    let settled = false;

    const id = toast.custom(
      (t) => (
        <div
          className="ticket flex items-center gap-4 px-4 py-3 shadow-lg"
          style={{ opacity: t.visible ? 1 : 0, transition: 'opacity 150ms' }}
        >
          <span className="text-sm">{message}</span>
          <button
            onClick={() => {
              if (settled) return;
              settled = true;
              toast.dismiss(t.id);
              resolve(true);
            }}
            className="text-sm font-medium text-route-soft hover:underline shrink-0"
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