import React from 'react';
import DayTimeline from './DayTimeline';

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