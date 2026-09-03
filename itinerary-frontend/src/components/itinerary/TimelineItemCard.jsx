import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { formatTime } from '../../utils/dateHelpers';
import { formatCurrency } from '../../utils/currencyHelpers';
import { ITEM_TYPES } from '../../utils/constants';

const TYPE_ICONS = {
  FLIGHT: '✈',
  TRAIN: '🚆',
  BUS: '🚌',
  CAR_RENTAL: '🚗',
  HOTEL_CHECKIN: '🛎',
  HOTEL_CHECKOUT: '🧳',
  ACTIVITY: '◆',
  MEAL: '◍',
  SIGHTSEEING: '☉',
  MEETING: '◻',
  FREE_TIME: '○',
  OTHER: '•',
};

export default function TimelineItemCard({ item, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const typeLabel = ITEM_TYPES.find((t) => t.value === item.itemType)?.label || item.itemType;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        'relative pl-10 py-1 group',
        isDragging && 'opacity-50 z-10'
      )}
    >
      {/* waypoint dot sitting on the route line */}
      <span className="absolute left-[13px] top-4 w-3 h-3 rounded-full bg-route border-2 border-ink" />

      <div className="ticket p-4 flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-parchment-text/30 hover:text-parchment-text/60 mt-1 shrink-0"
          aria-label="Drag to reorder"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <circle cx="4" cy="3" r="1.3" /><circle cx="10" cy="3" r="1.3" />
            <circle cx="4" cy="7" r="1.3" /><circle cx="10" cy="7" r="1.3" />
            <circle cx="4" cy="11" r="1.3" /><circle cx="10" cy="11" r="1.3" />
          </svg>
        </button>

        <span className="text-lg shrink-0 mt-0.5" aria-hidden="true">
          {TYPE_ICONS[item.itemType] || '•'}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-medium truncate">{item.title}</h4>
            <span className="data-mono text-[10px] uppercase tracking-wide text-parchment-text/40">
              {typeLabel}
            </span>
          </div>
          {item.locationName && (
            <p className="text-sm text-parchment-text/60 truncate">{item.locationName}</p>
          )}
          <div className="flex items-center gap-3 mt-1.5">
            {(item.startTime || item.endTime) && (
              <span className="data-mono text-xs text-parchment-text/50">
                {formatTime(item.startTime)}
                {item.endTime && ` – ${formatTime(item.endTime)}`}
              </span>
            )}
            {item.cost && (
              <span className="data-mono text-xs text-waypoint-soft">
                {formatCurrency(item.cost, item.currency)}
              </span>
            )}
          </div>
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 shrink-0">
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 rounded-stub text-parchment-text/50 hover:text-route-soft hover:bg-parchment-dim"
            aria-label="Edit"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(item)}
            className="p-1.5 rounded-stub text-parchment-text/50 hover:text-danger hover:bg-parchment-dim"
            aria-label="Delete"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}