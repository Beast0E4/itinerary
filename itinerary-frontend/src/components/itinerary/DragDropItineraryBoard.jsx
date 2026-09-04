import React from 'react';
import DayTimeline from './DayTimeline';

/**
 * Renders the full multi-day itinerary board. Each day gets its own
 * DayTimeline (which owns its own DndContext, so drag-and-drop reordering
 * stays scoped within a day rather than letting items jump across days).
 *
 * This is a thin composition layer over DayTimeline — pulled out as its
 * own component so ItineraryBuilderPage stays focused on data-fetching
 * and modal state rather than the render loop.
 */
export default function DragDropItineraryBoard({ days, onAddItem, onEditItem, onDeleteItem, onReorder }) {
  return (
    <div>
      {days.map((day) => (
        <DayTimeline
          key={day.id}
          day={day}
          onAddItem={onAddItem}
          onEditItem={onEditItem}
          onDeleteItem={onDeleteItem}
          onReorder={onReorder}
        />
      ))}
    </div>
  );
}