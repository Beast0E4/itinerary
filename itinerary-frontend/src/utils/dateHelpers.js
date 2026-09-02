import { format, differenceInCalendarDays, parseISO } from 'date-fns';

export function formatDateShort(dateStr) {
  if (!dateStr) return '';
  const d = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return format(d, 'd MMM yyyy');
}

export function formatDateRange(startStr, endStr) {
  if (!startStr || !endStr) return '';
  const start = parseISO(startStr);
  const end = parseISO(endStr);
  const sameMonth = format(start, 'MMM yyyy') === format(end, 'MMM yyyy');
  return sameMonth
    ? `${format(start, 'd')}–${format(end, 'd MMM yyyy')}`
    : `${format(start, 'd MMM')} – ${format(end, 'd MMM yyyy')}`;
}

export function formatTime(timeStr) {
  if (!timeStr) return '';
  // backend sends "HH:mm:ss"
  return timeStr.slice(0, 5);
}

export function tripDurationDays(startStr, endStr) {
  if (!startStr || !endStr) return 0;
  return differenceInCalendarDays(parseISO(endStr), parseISO(startStr)) + 1;
}

export function daysUntil(dateStr) {
  if (!dateStr) return null;
  return differenceInCalendarDays(parseISO(dateStr), new Date());
}