import { useMemo, useRef, useState, useEffect } from 'react';
import { AnimatePresence, motion, PanInfo, useDragControls } from 'framer-motion';
import { CalendarEvent } from '@/pages/NeoTimeline';
import { getHolidayForDate } from '@/lib/indonesian-holidays';

interface CalendarViewProps {
  view: 'month';
  currentDate: Date;
  events: CalendarEvent[];
  onDateClick: (date: Date, multi?: boolean) => void;
  onEventClick: (event: CalendarEvent) => void;
  onEventDrop: (eventId: string, newStart: Date, newEnd: Date) => void;
  onEventResize?: (eventId: string, newEnd: Date) => void;
  visibleProjectIds?: string[] | null;
  selectedEventIds?: Set<string>;
  onSelectedEventIdsChange?: (next: Set<string>) => void;
  selectedDates?: Set<string>;
  onSelectedDatesChange?: (next: Set<string>) => void;
  showHolidays?: boolean;
}

export const CalendarView = ({
  view,
  currentDate,
  events,
  onDateClick,
  onEventClick,
  onEventDrop,
  onEventResize,
  visibleProjectIds,
  selectedEventIds,
  onSelectedEventIdsChange,
  selectedDates,
  onSelectedDatesChange,
  showHolidays = true,
}: CalendarViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragOverSlot, setDragOverSlot] = useState<{ day: number; hour: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Resize state
  const [activeResize, setActiveResize] = useState<null | {
    eventId: string;
    startX: number;
    originalEnd: Date;
    cellWidth: number;
    eventStart: Date;
  }>(null);
  const [resizePreviewEnd, setResizePreviewEnd] = useState<Record<string, Date>>({});

  const filteredEvents = useMemo(() => {
    if (!visibleProjectIds) return events;
    return events.filter((e) => visibleProjectIds.includes(e.project_id || 'default'));
  }, [events, visibleProjectIds]);

  const getMonthDates = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const dates: Date[] = [];

    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      dates.push(date);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      dates.push(new Date(year, month, i));
    }

    const remaining = 42 - dates.length;
    for (let i = 1; i <= remaining; i++) {
      dates.push(new Date(year, month + 1, i));
    }

    return dates;
  };

  const monthDates = useMemo(() => getMonthDates(), [currentDate]);

  const isToday = (date: Date) => date.toDateString() === new Date().toDateString();

  const getEventsForDate = (date: Date) =>
    filteredEvents.filter((event) => {
      const eventStart = new Date(event.start_time);
      const eventEnd = new Date(event.end_time);
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      return eventStart <= dayEnd && eventEnd >= dayStart;
    });

  const springConfig = {
    type: 'spring' as const,
    stiffness: 420,
    damping: 28,
    mass: 0.75,
  };

  const dateToKey = (date: Date) => date.toISOString().split('T')[0];

  const handleDateClick = (date: Date, mouseEvent: React.MouseEvent) => {
    const multi = mouseEvent.metaKey || mouseEvent.ctrlKey || mouseEvent.shiftKey;
    onDateClick(date, multi);
  };

  const setSelected = (event: CalendarEvent, mouseEvent: React.MouseEvent) => {
    mouseEvent.stopPropagation();
    if (!onSelectedEventIdsChange) {
      onEventClick(event);
      return;
    }

    const multi = mouseEvent.metaKey || mouseEvent.ctrlKey || mouseEvent.shiftKey;
    const current = selectedEventIds ?? new Set<string>();

    if (!multi) {
      onSelectedEventIdsChange(new Set([event.id]));
      onEventClick(event);
      return;
    }

    const next = new Set(current);
    if (next.has(event.id)) next.delete(event.id);
    else next.add(event.id);

    onSelectedEventIdsChange(next);
    onEventClick(event);
  };

  // Resize handlers with global pointer events
  useEffect(() => {
    if (!activeResize) return;

    const handlePointerMove = (e: PointerEvent) => {
      const deltaX = e.clientX - activeResize.startX;
      const deltaDays = Math.round(deltaX / Math.max(1, activeResize.cellWidth));
      const nextEnd = new Date(activeResize.originalEnd);
      nextEnd.setDate(activeResize.originalEnd.getDate() + deltaDays);
      // Ensure end is at least same day as start
      if (nextEnd < activeResize.eventStart) {
        nextEnd.setTime(activeResize.eventStart.getTime());
        nextEnd.setHours(23, 59, 59, 999);
      }
      setResizePreviewEnd((prev) => ({ ...prev, [activeResize.eventId]: nextEnd }));
    };

    const handlePointerUp = () => {
      const preview = resizePreviewEnd[activeResize.eventId];
      if (preview && onEventResize && preview.getTime() !== activeResize.originalEnd.getTime()) {
        onEventResize(activeResize.eventId, preview);
      }
      setActiveResize(null);
      setResizePreviewEnd((prev) => {
        const next = { ...prev };
        delete next[activeResize.eventId];
        return next;
      });
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [activeResize, resizePreviewEnd, onEventResize]);

  const startResize = (e: React.PointerEvent, event: CalendarEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = containerRef.current?.getBoundingClientRect();
    const cellWidth = rect ? rect.width / 7 : 120;

    setActiveResize({
      eventId: event.id,
      startX: e.clientX,
      originalEnd: new Date(event.end_time),
      cellWidth,
      eventStart: new Date(event.start_time),
    });
  };

  const handleDragEnd = (event: CalendarEvent, info: PanInfo) => {
    setIsDragging(false);
    setDragOverSlot(null);

    const element = document.elementFromPoint(info.point.x, info.point.y);
    const slot = element?.closest('[data-slot]') as HTMLElement | null;
    if (!slot) return;

    const slotDate = slot.getAttribute('data-date');
    if (!slotDate) return;

    const targetDate = new Date(slotDate);
    const duration = event.end_time.getTime() - event.start_time.getTime();

    const newStart = new Date(targetDate);
    newStart.setHours(event.start_time.getHours(), event.start_time.getMinutes(), 0, 0);
    const newEnd = new Date(newStart.getTime() + duration);

    const idsToMove = selectedEventIds && selectedEventIds.has(event.id) ? Array.from(selectedEventIds) : [event.id];

    if (idsToMove.length <= 1) {
      onEventDrop(event.id, newStart, newEnd);
      return;
    }

    const baseDelta = newStart.getTime() - event.start_time.getTime();
    idsToMove.forEach((id) => {
      const ev = filteredEvents.find((e) => e.id === id);
      if (!ev) return;
      const nextStart = new Date(ev.start_time.getTime() + baseDelta);
      const nextEnd = new Date(ev.end_time.getTime() + baseDelta);
      onEventDrop(id, nextStart, nextEnd);
    });
  };

  const EventCard = ({ event, date }: { event: CalendarEvent; date: Date }) => {
    const dragControls = useDragControls();
    const isSelected = selectedEventIds?.has(event.id) ?? false;
    const endToShow = resizePreviewEnd[event.id] ?? event.end_time;

    const eventStart = new Date(event.start_time);
    const eventEnd = endToShow;
    const isFirstDay = eventStart.toDateString() === date.toDateString();
    const isLastDay = eventEnd.toDateString() === date.toDateString();
    const isMultiDay = eventStart.toDateString() !== new Date(event.end_time).toDateString();

    return (
      <motion.div
        layout
        layoutId={`${event.id}-${dateToKey(date)}`}
        initial={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.03, zIndex: 10 }}
        whileTap={{ scale: 1.06, zIndex: 20 }}
        whileDrag={{
          scale: 1.08,
          zIndex: 50,
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          cursor: 'grabbing',
        }}
        drag={!activeResize && isFirstDay}
        dragControls={dragControls}
        dragListener={false}
        dragMomentum={false}
        dragElastic={0.12}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(e, info) => handleDragEnd(event, info)}
        transition={springConfig}
        onClick={(e) => setSelected(event, e)}
        className={`relative rounded-lg px-2 py-1 text-xs text-white select-none group truncate ${
          isSelected ? 'ring-2 ring-white/60' : ''
        } ${!isFirstDay ? 'rounded-l-none' : ''} ${!isLastDay ? 'rounded-r-none' : ''}`}
        style={{
          backgroundColor: event.color,
          touchAction: 'none',
          marginLeft: !isFirstDay ? '-4px' : 0,
          marginRight: !isLastDay ? '-4px' : 0,
        }}
      >
        <div
          onPointerDown={(e) => {
            if (activeResize || !isFirstDay) return;
            e.stopPropagation();
            dragControls.start(e);
          }}
          className="cursor-grab active:cursor-grabbing"
        >
          {isFirstDay && <div className="font-medium truncate">{event.title}</div>}
          {!isFirstDay && isMultiDay && <div className="font-medium truncate opacity-60">↳ {event.title}</div>}
        </div>

        {/* Resize handle - only on last day */}
        {isLastDay && (
          <div
            onPointerDown={(e) => startResize(e, event)}
            className="absolute right-0 top-0 bottom-0 w-3 cursor-ew-resize opacity-0 group-hover:opacity-100 bg-white/30 rounded-r-lg transition-opacity flex items-center justify-center"
          >
            <div className="w-0.5 h-4 bg-white/60 rounded" />
          </div>
        )}
      </motion.div>
    );
  };

  if (view === 'month') {
    return (
      <div ref={containerRef} className="grid grid-cols-7 gap-px bg-white/10">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="p-2 text-center text-white/60 text-sm font-medium bg-white/5">
            {day}
          </div>
        ))}

        {monthDates.map((date, i) => {
          const dayEvents = getEventsForDate(date);
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isDragOver = dragOverSlot?.day === i;
          const dateKey = dateToKey(date);
          const isDateSelected = selectedDates?.has(dateKey) ?? false;
          const holiday = showHolidays ? getHolidayForDate(date) : undefined;

          return (
            <motion.div
              key={i}
              data-slot="true"
              data-day={i}
              data-hour={0}
              data-date={date.toISOString()}
              animate={{
                backgroundColor: isDragOver
                  ? 'rgba(59, 130, 246, 0.2)'
                  : isDateSelected
                  ? 'rgba(59, 130, 246, 0.15)'
                  : 'rgba(255, 255, 255, 0.05)',
                scale: isDragOver ? 1.02 : 1,
              }}
              transition={springConfig}
              className={`min-h-24 p-1 hover:bg-white/10 transition-colors ${!isCurrentMonth ? 'opacity-40' : ''} ${
                isToday(date) ? 'ring-2 ring-blue-500 ring-inset' : ''
              } ${isDateSelected ? 'ring-2 ring-blue-400 ring-inset' : ''}`}
              onMouseEnter={() => isDragging && setDragOverSlot({ day: i, hour: 0 })}
              onClick={(e) => handleDateClick(date, e)}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm ${isToday(date) ? 'text-blue-400 font-bold' : 'text-white/80'}`}>
                  {date.getDate()}
                </span>
                {holiday && (
                  <span className="text-[9px] text-red-400 font-medium truncate max-w-[70%]" title={holiday.nameId}>
                    {holiday.name}
                  </span>
                )}
              </div>
              <AnimatePresence mode="popLayout">
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <EventCard key={event.id} event={event} date={date} />
                  ))}
                  {dayEvents.length > 3 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-white/60">
                      +{dayEvents.length - 3} more
                    </motion.div>
                  )}
                </div>
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    );
  }

  return null;
};
