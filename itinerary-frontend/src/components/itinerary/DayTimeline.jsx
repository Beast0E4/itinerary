import React, { useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import TimelineItemCard from './TimelineItemCard';
import { formatDateShort } from '../../utils/dateHelpers';

export default function DayTimeline({ day, onReorder, onAddItem, onEditItem, onDeleteItem }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const items = day.items;

  const lineHeight = useMemo(() => Math.max(items.length * 96, 24), [items.length]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    onReorder(day.id, reordered.map((i) => i.id));
  };

  return (
    <div className="mb-10">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h3 className="font-display text-lg">
            Day {day.dayNumber}
            {day.title && <span className="text-parchment-text/50 font-normal"> — {day.title}</span>}
          </h3>
          <p className="data-mono text-xs text-muted">{formatDateShort(day.date)}</p>
        </div>
        <button
          onClick={() => onAddItem(day)}
          className="text-sm text-route-bright hover:underline shrink-0"
        >
          + Add to this day
        </button>
      </div>

      <div className="relative">
        {items.length > 0 && (
          <svg
            className="absolute left-4 top-4 -z-0"
            width="2"
            height={lineHeight}
            style={{ overflow: 'visible' }}
          >
            <line
              x1="1" y1="0" x2="1" y2={lineHeight}
              className="route-line"
              strokeDasharray={lineHeight}
              style={{ strokeDashoffset: 0 }}
            />
          </svg>
        )}

        {items.length === 0 ? (
          <p className="pl-10 text-sm text-parchment-text/40 italic py-4">Nothing planned yet for this day.</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3 relative z-10">
                {items.map((item) => (
                  <TimelineItemCard
                    key={item.id}
                    item={item}
                    onEdit={onEditItem}
                    onDelete={onDeleteItem}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}