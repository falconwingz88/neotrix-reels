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
  selectedProjectId?: string | null;
  blendMode?: boolean; // When true, events color the day background instead of showing pills
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
  selectedProjectId,
  blendMode = false,
}: CalendarViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragOverSlot, setDragOverSlot] = useState<{ day: number; hour: number } | null>(null);
  const dragOverDayRef = useRef<number | null>(null);
  const dragRafRef = useRef<number | null>(null);
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

  // Marquee selection state (store coords relative to the calendar grid)
  const [marquee, setMarquee] = useState<null | {
    start: { x: number; y: number };
    current: { x: number; y: number };
  }>(null);
  const marqueeContainerRectRef = useRef<DOMRect | null>(null);

  // Get event color (explicit event color overrides project color)
  const getEventColor = (event: CalendarEvent) => {
    if (event.color) return event.color;
    const project = projects.find((p) => p.id === event.project_id);
    return project?.color || '#3b82f6';
  };

  // Filter events based on visibility and sub-event rules
  const filteredEvents = useMemo(() => {
    let filtered = events;
    
    // Filter by visible projects
    if (visibleProjectIds) {
      filtered = filtered.filter((e) => visibleProjectIds.includes(e.project_id || 'default'));
    }
    
    // Sub-events: only show when their parent project is selected
    // If no project is selected (all events view), hide sub-events
    if (!selectedProjectId) {
      filtered = filtered.filter((e) => !e.is_sub_event);
    }
    
    return filtered;
  }, [events, visibleProjectIds, selectedProjectId]);

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
      window.setTimeout(() => setResizeBounceEventId(null), 520);

      setActiveResize(null);
      setResizePreview((prev) => {
        const next = { ...prev };
        delete next[activeResize.eventId];
        return next;
      });
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
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

  // Find slot at pointer position during drag
  const findSlotAtPoint = useCallback((x: number, y: number) => {
    const elements = document.elementsFromPoint(x, y) as Element[];
    const slot = elements
      .map((el) => (el as HTMLElement).closest?.('[data-slot]') as HTMLElement | null)
      .find((el): el is HTMLElement => !!el);
    return slot;
  }, []);

  const handleDrag = useCallback(
    (info: PanInfo) => {
      // Avoid re-rendering the whole grid on every pointer move.
      // Only update when the hovered day actually changes and throttle to rAF.
      const slot = findSlotAtPoint(info.point.x, info.point.y);
      const nextDay = slot ? Number(slot.getAttribute('data-day')) : null;

      if (Number.isNaN(nextDay as number)) return;
      if (nextDay === dragOverDayRef.current) return;

      dragOverDayRef.current = nextDay;

      if (dragRafRef.current) cancelAnimationFrame(dragRafRef.current);
      dragRafRef.current = requestAnimationFrame(() => {
        setDragOverSlot(nextDay === null ? null : { day: nextDay, hour: 0 });
      });
    },
    [findSlotAtPoint]
  );

  const handleDragEnd = (event: CalendarEvent, info: PanInfo) => {
    setIsDragging(false);
    dragOverDayRef.current = null;
    if (dragRafRef.current) {
      cancelAnimationFrame(dragRafRef.current);
      dragRafRef.current = null;
    }
    setDragOverSlot(null);

    const slot = findSlotAtPoint(info.point.x, info.point.y);
    if (!slot) return;

    const slotDate = slot.getAttribute('data-date');
    if (!slotDate) return;

    const targetDate = new Date(slotDate);
    const duration = event.end_time.getTime() - event.start_time.getTime();

    const newStart = new Date(targetDate);
    newStart.setHours(event.start_time.getHours(), event.start_time.getMinutes(), 0, 0);
    const newEnd = new Date(newStart.getTime() + duration);

    const idsToMove =
      selectedEventIds && selectedEventIds.has(event.id) ? Array.from(selectedEventIds) : [event.id];

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
    if (!marquee || !marqueeContainerRectRef.current) return null;

    const x1 = Math.min(marquee.start.x, marquee.current.x);
    const y1 = Math.min(marquee.start.y, marquee.current.y);
    const x2 = Math.max(marquee.start.x, marquee.current.x);
    const y2 = Math.max(marquee.start.y, marquee.current.y);

    const r = marqueeContainerRectRef.current;
    // return in viewport coords (for intersects()), while marquee stores container-relative coords
    return {
      left: r.left + x1,
      top: r.top + y1,
      right: r.left + x2,
      bottom: r.top + y2,
      width: x2 - x1,
      height: y2 - y1,
    };
  }, [marquee]);

  const intersects = (a: { left: number; top: number; right: number; bottom: number }, b: DOMRect) => {
    return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
  };

  const startMarquee = (e: React.PointerEvent) => {
    if (activeResize || isDragging) return;
    if (e.button !== 0) return;

    const target = e.target as HTMLElement;
    if (target.closest('[data-event-id]')) return;
    if (target.closest('[data-resize-handle]')) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    e.preventDefault();

    marqueeContainerRectRef.current = rect;
    const start = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    let latest = start;
    let hasStarted = false;

    const prevUserSelect = document.body.style.userSelect;

    const onMove = (ev: PointerEvent) => {
      latest = { x: ev.clientX - rect.left, y: ev.clientY - rect.top };

      const dx = latest.x - start.x;
      const dy = latest.y - start.y;
      const dist = Math.hypot(dx, dy);

      if (!hasStarted && dist < 6) return;

      if (!hasStarted) {
        hasStarted = true;
        document.body.style.userSelect = 'none';
        setMarquee({ start, current: latest });
        return;
      }

      setMarquee((prev) => (prev ? { ...prev, current: latest } : prev));
    };

    const finish = () => {
      window.removeEventListener('pointermove', onMove);
      document.body.style.userSelect = prevUserSelect;

      if (!hasStarted) return;

      const x1 = Math.min(start.x, latest.x);
      const y1 = Math.min(start.y, latest.y);
      const x2 = Math.max(start.x, latest.x);
      const y2 = Math.max(start.y, latest.y);
      const mr = {
        left: rect.left + x1,
        top: rect.top + y1,
        right: rect.left + x2,
        bottom: rect.top + y2,
      };

      setMarquee(null);

      if (!onSelectedEventIdsChange) return;

      const scope = containerRef.current ?? document;
      const nodes = Array.from(scope.querySelectorAll<HTMLElement>('[data-event-id]'));
      const hitIds = nodes
        .filter((n) => intersects(mr, n.getBoundingClientRect()))
        .map((n) => n.getAttribute('data-event-id'))
        .filter((id): id is string => !!id);

      onSelectedEventIdsChange(new Set(hitIds));
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', finish, { once: true });
    window.addEventListener('pointercancel', finish, { once: true });
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
    const isBouncing = resizeBounceEventId === event.id;

    return (
      <motion.div
        data-event-id={event.id}
        layout
        layoutId={`${event.id}-${dateToKey(date)}`}
        initial={{ opacity: 1, scale: 1 }}
        animate={{
          scale: isBouncing ? [1, 1.18, 0.9, 1.1, 1] : isResizingThis ? 1.035 : 1,
          y: isBouncing ? [0, -8, 4, -3, 0] : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: isBouncing ? 720 : 420,
          damping: isBouncing ? 14 : 28,
          mass: 0.55,
        }}
        whileHover={{ scale: 1.03, zIndex: 10 }}
        whileTap={{ scale: 1.05, zIndex: 20 }}
        whileDrag={{
          scale: 1.1,
          zIndex: 50,
          boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
        }}
        drag={!activeResize}
        dragControls={dragControls}
        dragListener={false}
        dragMomentum={false}
        dragElastic={0}
        dragSnapToOrigin={false}
        onDragStart={() => {
          dragOverDayRef.current = null;
          setIsDragging(true);
        }}
        onDrag={(e, info) => handleDrag(info)}
        onDragEnd={(e, info) => handleDragEnd(event, info)}
        onClick={(e) => setSelected(event, e)}
        onPointerDown={(e) => {
          // Start drag only from the card body (not resize handles)
          if (e.button !== 0) return;
          const target = e.target as HTMLElement;
          if (target.closest('[data-resize-handle]')) return;
          if (activeResize) return;
          e.stopPropagation();
          dragControls.start(e);
        }}
        className={`relative text-xs text-white select-none group cursor-grab active:cursor-grabbing ${
          isSelected ? 'ring-2 ring-white/60 ring-inset' : ''
        } ${isSingleDay ? 'rounded-lg mx-1 px-2 py-1' : ''} ${
          isMultiDay && isFirstDay ? 'rounded-l-lg rounded-r-none ml-1 pl-2 pr-0 py-1' : ''
        } ${isMultiDay && isLastDay ? 'rounded-r-lg rounded-l-none mr-1 pr-2 pl-0 py-1' : ''} ${
          isMultiDay && !isFirstDay && !isLastDay ? 'rounded-none px-0 py-1' : ''
        }`}
        style={{
          backgroundColor: eventColor,
          touchAction: 'none',
        }}
      >
        {/* Left resize handle - only on first day */}
        {isFirstDay && (
          <div
            data-resize-handle="true"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              startResize(e, event, 'left');
            }}
            className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize opacity-0 group-hover:opacity-100 bg-white/30 rounded-l-lg transition-opacity flex items-center justify-center z-10"
          >
            <div className="w-0.5 h-3 bg-white/60 rounded" />
          </div>
        )}

        <div className="truncate pointer-events-none">
          {isFirstDay && <span className="font-medium">{event.title}</span>}
          {!isFirstDay && isMultiDay && <span className="opacity-0">.</span>}
        </div>

        {/* Right resize handle - only on last day */}
        {isLastDay && (
          <div
            data-resize-handle="true"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              startResize(e, event, 'right');
            }}
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
      <div
        ref={containerRef}
        className="relative grid grid-cols-7 bg-white/10 select-none"
        onPointerDown={startMarquee}
      >
        {/* Marquee selection box */}
        {marquee && (
          <div
            className="absolute pointer-events-none z-50 border-2 border-primary/60 bg-primary/15 rounded"
            style={{
              left: Math.min(marquee.start.x, marquee.current.x),
              top: Math.min(marquee.start.y, marquee.current.y),
              width: Math.abs(marquee.current.x - marquee.start.x),
              height: Math.abs(marquee.current.y - marquee.start.y),
            }}
          />
        )}

        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="p-2 text-center text-white/60 text-sm font-medium bg-white/5 border-b border-white/10">
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

          // Calculate blend color from main events (non-sub-events) for this day
          const mainEvents = dayEvents.filter(e => !e.is_sub_event);
          const subEvents = dayEvents.filter(e => e.is_sub_event);
          
          const blendColors = blendMode && mainEvents.length > 0 
            ? mainEvents.map(e => getEventColor(e))
            : [];
          const blendStyle = blendColors.length > 0 
            ? blendColors.length === 1 
              ? { backgroundColor: `${blendColors[0]}40` }
              : { background: `linear-gradient(135deg, ${blendColors.map((c, idx) => `${c}40 ${(idx / blendColors.length) * 100}%`).join(', ')})` }
            : {};

          // Build background style with proper priority
          const bgColor = isDragOver
            ? 'rgba(59, 130, 246, 0.2)'
            : isDateSelected
              ? 'rgba(59, 130, 246, 0.15)'
              : blendColors.length === 0
                ? 'rgba(255, 255, 255, 0.05)'
                : undefined;

          const dayStyle = blendColors.length > 0 && !isDragOver && !isDateSelected
            ? blendStyle
            : { backgroundColor: bgColor };

          return (
            <motion.div
              key={i}
              data-slot="true"
              data-day={i}
              data-hour={0}
              data-date={date.toISOString()}
              transition={springConfig}
              style={dayStyle}
              className={`min-h-24 p-1 hover:bg-white/10 transition-colors border-b border-r border-white/5 flex flex-col ${
                !isCurrentMonth ? 'opacity-40' : ''
              } ${isToday(date) ? 'ring-2 ring-blue-500 ring-inset' : ''} ${
                isDateSelected ? 'ring-2 ring-blue-400 ring-inset' : ''
              } ${isDragOver ? 'ring-2 ring-blue-400 ring-inset z-10' : ''}`}
              onClick={(e) => handleDateClick(date, e)}
            >
              <div className="flex items-center justify-between mb-1 flex-shrink-0">
                <span className={`text-sm ${isToday(date) ? 'text-blue-400 font-bold' : 'text-white/80'}`}>
                  {date.getDate()}
                </span>
                {holiday && (
                  <span className="text-[9px] text-red-400 font-medium truncate max-w-[70%]" title={holiday.nameId}>
                    {holiday.name}
                  </span>
                )}
              </div>
              
              {/* Show event pills when NOT in blend mode */}
              {!blendMode && (
                <div className="mt-1 flex flex-col gap-0.5">
                  {dayEvents.map((event) => (
                    <EventCard key={event.id} event={event} date={date} />
                  ))}
                </div>
              )}
              
              {/* In blend mode: show sub-events as pills (they are the nested events) */}
              {blendMode && (
                <div className="mt-1 flex flex-col gap-0.5">
                  {subEvents.map((event) => (
                    <EventCard key={event.id} event={event} date={date} />
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    );
  }

  return null;
};
