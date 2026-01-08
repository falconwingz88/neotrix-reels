import { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion, PanInfo, useDragControls } from 'framer-motion';
import { CalendarEvent } from '@/pages/NeoTimeline';
import { getHolidayForDate } from '@/lib/indonesian-holidays';

interface Project {
  id: string;
  name: string;
  color: string;
  visible: boolean;
}

interface CalendarViewProps {
  view: 'month';
  currentDate: Date;
  events: CalendarEvent[];
  projects: Project[];
  onDateClick: (date: Date, multi?: boolean) => void;
  onEventClick: (event: CalendarEvent) => void;
  onEventDrop: (eventId: string, newStart: Date, newEnd: Date) => void;
  onEventResize?: (eventId: string, newStart: Date, newEnd: Date) => void;
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
  projects,
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

  // Resize state - supports both left and right edge
  const [activeResize, setActiveResize] = useState<null | {
    eventId: string;
    startX: number;
    originalStart: Date;
    originalEnd: Date;
    cellWidth: number;
    edge: 'left' | 'right';
  }>(null);
  const [resizePreview, setResizePreview] = useState<Record<string, { start: Date; end: Date }>>({});
  const [resizeBounceEventId, setResizeBounceEventId] = useState<string | null>(null);

  // Marquee selection state
  const [marquee, setMarquee] = useState<null | {
    start: { x: number; y: number };
    current: { x: number; y: number };
  }>(null);

  // Get project color for an event
  const getEventColor = (event: CalendarEvent) => {
    const project = projects.find(p => p.id === event.project_id);
    return project?.color || event.color || '#3b82f6';
  };

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

  // Resize handlers with global pointer events - supports left and right edges
  useEffect(() => {
    if (!activeResize) return;

    const handlePointerMove = (e: PointerEvent) => {
      const deltaX = e.clientX - activeResize.startX;
      const deltaDays = Math.round(deltaX / Math.max(1, activeResize.cellWidth));

      if (activeResize.edge === 'right') {
        const nextEnd = new Date(activeResize.originalEnd);
        nextEnd.setDate(activeResize.originalEnd.getDate() + deltaDays);
        // Ensure end is at least same day as start
        if (nextEnd < activeResize.originalStart) {
          nextEnd.setTime(activeResize.originalStart.getTime());
          nextEnd.setHours(23, 59, 59, 999);
        }
        setResizePreview((prev) => ({
          ...prev,
          [activeResize.eventId]: { start: activeResize.originalStart, end: nextEnd },
        }));
      } else {
        // Left edge - adjust start date
        const nextStart = new Date(activeResize.originalStart);
        nextStart.setDate(activeResize.originalStart.getDate() + deltaDays);
        // Ensure start is not after end
        if (nextStart > activeResize.originalEnd) {
          nextStart.setTime(activeResize.originalEnd.getTime());
          nextStart.setHours(0, 0, 0, 0);
        }
        setResizePreview((prev) => ({
          ...prev,
          [activeResize.eventId]: { start: nextStart, end: activeResize.originalEnd },
        }));
      }
    };

    const handlePointerUp = () => {
      const preview = resizePreview[activeResize.eventId];
      if (preview && onEventResize) {
        const hasChanged =
          preview.start.getTime() !== activeResize.originalStart.getTime() ||
          preview.end.getTime() !== activeResize.originalEnd.getTime();
        if (hasChanged) {
          onEventResize(activeResize.eventId, preview.start, preview.end);
        }
      }

      // little bounce on release
      setResizeBounceEventId(activeResize.eventId);
      window.setTimeout(() => setResizeBounceEventId(null), 260);

      setActiveResize(null);
      setResizePreview((prev) => {
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
  }, [activeResize, resizePreview, onEventResize]);

  const startResize = (e: React.PointerEvent, event: CalendarEvent, edge: 'left' | 'right') => {
    e.preventDefault();
    e.stopPropagation();

    const rect = containerRef.current?.getBoundingClientRect();
    const cellWidth = rect ? rect.width / 7 : 120;

    setActiveResize({
      eventId: event.id,
      startX: e.clientX,
      originalStart: new Date(event.start_time),
      originalEnd: new Date(event.end_time),
      cellWidth,
      edge,
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

  const getMarqueeRect = useCallback(() => {
    if (!marquee) return null;
    const x1 = Math.min(marquee.start.x, marquee.current.x);
    const y1 = Math.min(marquee.start.y, marquee.current.y);
    const x2 = Math.max(marquee.start.x, marquee.current.x);
    const y2 = Math.max(marquee.start.y, marquee.current.y);
    return { left: x1, top: y1, right: x2, bottom: y2, width: x2 - x1, height: y2 - y1 };
  }, [marquee]);

  const intersects = (a: { left: number; top: number; right: number; bottom: number }, b: DOMRect) => {
    return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
  };

  const startMarquee = (e: React.PointerEvent) => {
    if (activeResize || isDragging) return;

    const target = e.target as HTMLElement;
    if (target.closest('[data-event-id]')) return;
    if (target.closest('[data-resize-handle]')) return;

    const start = { x: e.clientX, y: e.clientY };
    let hasStarted = false;

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - start.x;
      const dy = ev.clientY - start.y;
      const dist = Math.hypot(dx, dy);

      if (!hasStarted && dist < 6) return;

      if (!hasStarted) {
        hasStarted = true;
        setMarquee({ start, current: { x: ev.clientX, y: ev.clientY } });
        return;
      }

      setMarquee((prev) => (prev ? { ...prev, current: { x: ev.clientX, y: ev.clientY } } : prev));
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);

      if (!hasStarted) return;

      const mr = getMarqueeRect();
      setMarquee(null);

      if (!mr || !onSelectedEventIdsChange) return;

      const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-event-id]'));
      const hitIds = nodes
        .filter((n) => intersects(mr, n.getBoundingClientRect()))
        .map((n) => n.getAttribute('data-event-id'))
        .filter((id): id is string => !!id);

      onSelectedEventIdsChange(new Set(hitIds));
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp, { once: true });
  };

  const EventCard = ({ event, date }: { event: CalendarEvent; date: Date }) => {
    const dragControls = useDragControls();
    const isSelected = selectedEventIds?.has(event.id) ?? false;
    const preview = resizePreview[event.id];
    const startToShow = preview?.start ?? event.start_time;
    const endToShow = preview?.end ?? event.end_time;
    const eventColor = getEventColor(event);

    const eventStart = new Date(startToShow);
    const eventEnd = new Date(endToShow);
    const isFirstDay = eventStart.toDateString() === date.toDateString();
    const isLastDay = eventEnd.toDateString() === date.toDateString();
    const isMultiDay = eventStart.toDateString() !== eventEnd.toDateString();
    const isSingleDay = !isMultiDay;

    const isResizingThis = activeResize?.eventId === event.id;
    const baseScale = isResizingThis ? 1.03 : 1;
    const scaleToAnimate = resizeBounceEventId === event.id ? [baseScale, 1.07, baseScale] : baseScale;

    return (
      <motion.div
        data-event-id={event.id}
        layout
        layoutId={`${event.id}-${dateToKey(date)}`}
        initial={{ opacity: 1 }}
        animate={{ scale: scaleToAnimate }}
        whileHover={{ scale: 1.02, zIndex: 10 }}
        whileTap={{ scale: 1.04, zIndex: 20 }}
        whileDrag={{
          scale: 1.08,
          zIndex: 50,
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          cursor: 'grabbing',
        }}
        drag={!activeResize}
        dragControls={dragControls}
        dragListener={false}
        dragMomentum={false}
        dragElastic={0.12}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(e, info) => handleDragEnd(event, info)}
        transition={springConfig}
        onClick={(e) => setSelected(event, e)}
        className={`relative px-2 py-1 text-xs text-white select-none group truncate ${
          isSelected ? 'ring-2 ring-white/60 ring-inset' : ''
        } ${isSingleDay ? 'rounded-lg' : ''} ${isMultiDay && isFirstDay ? 'rounded-l-lg rounded-r-none' : ''} ${isMultiDay && isLastDay ? 'rounded-r-lg rounded-l-none' : ''} ${isMultiDay && !isFirstDay && !isLastDay ? 'rounded-none' : ''}`}
        style={{
          backgroundColor: eventColor,
          touchAction: 'none',
          // Seamless multi-day: extend to cell edges
          marginLeft: isMultiDay && !isFirstDay ? '-8px' : 0,
          marginRight: isMultiDay && !isLastDay ? '-8px' : 0,
          paddingLeft: isMultiDay && !isFirstDay ? '10px' : undefined,
          paddingRight: isMultiDay && !isLastDay ? '10px' : undefined,
        }}
      >
        {/* Left resize handle - only on first day */}
        {isFirstDay && (
          <div
            data-resize-handle="true"
            onPointerDown={(e) => startResize(e, event, 'left')}
            className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize opacity-0 group-hover:opacity-100 bg-white/30 rounded-l-lg transition-opacity flex items-center justify-center z-10"
          >
            <div className="w-0.5 h-3 bg-white/60 rounded" />
          </div>
        )}

        <div
          onPointerDown={(e) => {
            if (activeResize) return;
            e.stopPropagation();
            dragControls.start(e);
          }}
          className="cursor-grab active:cursor-grabbing pl-1"
        >
          {isFirstDay && <div className="font-medium truncate">{event.title}</div>}
          {!isFirstDay && isMultiDay && <div className="font-medium truncate opacity-70">{event.title}</div>}
        </div>

        {/* Right resize handle - only on last day */}
        {isLastDay && (
          <div
            data-resize-handle="true"
            onPointerDown={(e) => startResize(e, event, 'right')}
            className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize opacity-0 group-hover:opacity-100 bg-white/30 rounded-r-lg transition-opacity flex items-center justify-center z-10"
          >
            <div className="w-0.5 h-3 bg-white/60 rounded" />
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
