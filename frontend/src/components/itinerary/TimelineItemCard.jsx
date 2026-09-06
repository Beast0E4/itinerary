import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import {
  Plane, TrainFront, Bus, Car, BedDouble, LogOut as CheckoutIcon,
  Sparkles, UtensilsCrossed, Landmark, Users, Coffee, MoreHorizontal,
  GripVertical, Pencil, Trash2,
} from 'lucide-react';
import { formatTime } from '../../utils/dateHelpers';
import { formatCurrency } from '../../utils/currencyHelpers';
import { ITEM_TYPES } from '../../utils/constants';

const TYPE_ICON = {
  FLIGHT: Plane,
  TRAIN: TrainFront,
  BUS: Bus,
  CAR_RENTAL: Car,
  HOTEL_CHECKIN: BedDouble,
  HOTEL_CHECKOUT: CheckoutIcon,
  ACTIVITY: Sparkles,
  MEAL: UtensilsCrossed,
  SIGHTSEEING: Landmark,
  MEETING: Users,
  FREE_TIME: Coffee,
  OTHER: MoreHorizontal,
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
  const Icon = TYPE_ICON[item.itemType] || MoreHorizontal;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx('relative pl-10 py-1 group', isDragging && 'opacity-50 z-10')}
    >
      <span className="absolute left-[13px] top-5 w-3 h-3 rounded-full bg-accent border-2 border-bg" />

      <div className="card p-4 flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-text-faint hover:text-text-muted mt-1 shrink-0"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" strokeWidth={1.75} />
        </button>

        <div className="w-8 h-8 rounded-md bg-accent-subtle flex items-center justify-center shrink-0 mt-0.5">
          <Icon className="w-4 h-4 text-accent" strokeWidth={1.75} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-medium truncate text-text">{item.title}</h4>
            <span className="data-mono text-[10px] uppercase tracking-wide">
              {typeLabel}
            </span>
          </div>
          {item.locationName && (
            <p className="text-sm text-text-muted truncate">{item.locationName}</p>
          )}
          <div className="flex items-center gap-3 mt-1.5">
            {(item.startTime || item.endTime) && (
              <span className="data-mono text-xs">
                {formatTime(item.startTime)}
                {item.endTime && ` – ${formatTime(item.endTime)}`}
              </span>
            )}
            {item.cost && (
              <span className="data-mono text-xs text-warn">
                {formatCurrency(item.cost, item.currency)}
              </span>
            )}
          </div>
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 shrink-0">
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 rounded-md text-text-faint hover:text-accent hover:bg-surface-hover"
            aria-label="Edit"
          >
            <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="p-1.5 rounded-md text-text-faint hover:text-danger hover:bg-surface-hover"
            aria-label="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
}