import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, PanInfo, useDragControls } from 'framer-motion';
import { CalendarEvent } from '@/pages/NeoTimeline';

interface CalendarViewProps {
  view: 'day' | 'week' | 'month';
  currentDate: Date;
  events: CalendarEvent[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onEventDrop: (eventId: string, newStart: Date, newEnd: Date) => void;
  onEventResize?: (eventId: string, newEnd: Date) => void;
  visibleProjectIds?: string[] | null;
  selectedEventIds?: Set<string>;
  onSelectedEventIdsChange?: (next: Set<string>) => void;
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
}: CalendarViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragOverSlot, setDragOverSlot] = useState<{ day: number; hour: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Resize preview state
  const [activeResize, setActiveResize] = useState<
    | null
    | {
        eventId: string;
        mode: 'hours' | 'days';
        startX: number;
        startY: number;
        originalEnd: Date;
        cellWidth: number;
        hourHeight: number;
        eventStart: Date;
      }
  >(null);
  const [resizePreviewEnd, setResizePreviewEnd] = useState<Record<string, Date>>({});

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const filteredEvents = useMemo(() => {
    if (!visibleProjectIds) return events;
    return events.filter((e) => visibleProjectIds.includes(e.project_id || 'default'));
  }, [events, visibleProjectIds]);

  const getWeekDates = () => {
    const start = new Date(currentDate);
    const day = start.getDay();
    start.setDate(start.getDate() - day);
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date;
    });
  };

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

  const weekDates = useMemo(() => getWeekDates(), [currentDate]);
  const monthDates = useMemo(() => getMonthDates(), [currentDate]);

  const isToday = (date: Date) => date.toDateString() === new Date().toDateString();

  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
  };

  const getEventsForDate = (date: Date) =>
    filteredEvents.filter((event) => new Date(event.start_time).toDateString() === date.toDateString());

  const getEventsForHour = (date: Date, hour: number) =>
    filteredEvents.filter((event) => {
      const eventDate = new Date(event.start_time);
      return eventDate.toDateString() === date.toDateString() && eventDate.getHours() === hour;
    });

  const springConfig = {
    type: 'spring' as const,
    stiffness: 420,
    damping: 28,
    mass: 0.75,
  };

  const setSelected = (event: CalendarEvent, mouseEvent: React.MouseEvent) => {
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

  const startResize = (e: React.PointerEvent, event: CalendarEvent, mode: 'hours' | 'days') => {
    e.preventDefault();
    e.stopPropagation();

    const rect = containerRef.current?.getBoundingClientRect();
    const cellWidth = rect ? rect.width / 7 : 120;

    setActiveResize({
      eventId: event.id,
      mode,
      startX: e.clientX,
      startY: e.clientY,
      originalEnd: new Date(event.end_time),
      cellWidth,
      hourHeight: 56,
      eventStart: new Date(event.start_time),
    });

    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onResizeMove = (e: React.PointerEvent) => {
    if (!activeResize) return;

    if (activeResize.mode === 'hours') {
      const deltaY = e.clientY - activeResize.startY;
      const deltaHours = Math.round(deltaY / activeResize.hourHeight);
      const minMs = 60 * 60 * 1000;
      const originalDuration = activeResize.originalEnd.getTime() - activeResize.eventStart.getTime();
      const nextDuration = Math.max(minMs, originalDuration + deltaHours * minMs);
      const nextEnd = new Date(activeResize.eventStart.getTime() + nextDuration);
      setResizePreviewEnd((prev) => ({ ...prev, [activeResize.eventId]: nextEnd }));
      return;
    }

    const deltaX = e.clientX - activeResize.startX;
    const deltaDays = Math.max(0, Math.round(deltaX / Math.max(1, activeResize.cellWidth)));
    const nextEnd = new Date(activeResize.originalEnd);
    nextEnd.setDate(activeResize.originalEnd.getDate() + deltaDays);
    setResizePreviewEnd((prev) => ({ ...prev, [activeResize.eventId]: nextEnd }));
  };

  const onResizeEnd = () => {
    if (!activeResize) return;
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

  const handleDragEnd = (event: CalendarEvent, info: PanInfo) => {
    setIsDragging(false);
    setDragOverSlot(null);

    const element = document.elementFromPoint(info.point.x, info.point.y);
    const slot = element?.closest('[data-slot]') as HTMLElement | null;
    if (!slot) return;

    const slotHour = parseInt(slot.getAttribute('data-hour') || '0');
    const slotDate = slot.getAttribute('data-date');
    if (!slotDate) return;

    const targetDate = new Date(slotDate);
    const duration = event.end_time.getTime() - event.start_time.getTime();

    const newStart = new Date(targetDate);
    if (view === 'month') {
      // month is day-level drop
      newStart.setHours(event.start_time.getHours(), event.start_time.getMinutes(), 0, 0);
    } else {
      newStart.setHours(slotHour, 0, 0, 0);
    }
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

  const EventCard = ({
    event,
    compact = false,
    showResize = false,
    showMonthResize = false,
  }: {
    event: CalendarEvent;
    compact?: boolean;
    showResize?: boolean;
    showMonthResize?: boolean;
  }) => {
    const dragControls = useDragControls();
    const isSelected = selectedEventIds?.has(event.id) ?? false;
    const endToShow = resizePreviewEnd[event.id] ?? event.end_time;

    return (
      <motion.div
        layout
        layoutId={event.id}
        initial={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.03, zIndex: 10 }}
        whileTap={{ scale: 1.06, zIndex: 20 }}
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
        onClick={(e) => {
          e.stopPropagation();
          if (activeResize || isDragging) return;
          setSelected(event, e);
        }}
        className={`relative rounded-lg px-2 py-1 text-xs text-white select-none group ${
          compact ? 'truncate' : ''
        } ${isSelected ? 'ring-2 ring-white/60' : ''}`}
        style={{ backgroundColor: event.color, touchAction: 'none' }}
      >
        <div
          onPointerDown={(e) => {
            if (activeResize) return;
            e.stopPropagation();
            dragControls.start(e);
          }}
          className="cursor-grab active:cursor-grabbing"
        >
          <div className="font-medium truncate">{event.title}</div>
          {!compact && (
            <div className="text-white/70 text-[10px]">
              {event.start_time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </div>
          )}
          {compact && (
            <div className="text-white/70 text-[10px]">
              {endToShow && endToShow.getTime() !== event.end_time.getTime() ? 'Resizing…' : ''}
            </div>
          )}
        </div>

        {showResize && (
          <div
            onPointerDown={(e) => startResize(e, event, 'hours')}
            onPointerMove={onResizeMove}
            onPointerUp={onResizeEnd}
            className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize opacity-0 group-hover:opacity-100 bg-white/30 rounded-b-lg transition-opacity flex items-center justify-center"
          >
            <div className="w-8 h-0.5 bg-white/60 rounded" />
          </div>
        )}

        {showMonthResize && (
          <div
            onPointerDown={(e) => startResize(e, event, 'days')}
            onPointerMove={onResizeMove}
            onPointerUp={onResizeEnd}
            className="absolute right-0 bottom-0 w-3 h-3 cursor-se-resize opacity-0 group-hover:opacity-100"
          >
            <div className="absolute right-1 bottom-1 w-1.5 h-1.5 rounded-sm bg-white/70" />
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

          return (
            <motion.div
              key={i}
              data-slot="true"
              data-day={i}
              data-hour={0}
              data-date={date.toISOString()}
              animate={{
                backgroundColor: isDragOver ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                scale: isDragOver ? 1.02 : 1,
              }}
              transition={springConfig}
              className={`min-h-24 p-1 hover:bg-white/10 transition-colors ${!isCurrentMonth ? 'opacity-40' : ''} ${
                isToday(date) ? 'ring-2 ring-blue-500 ring-inset' : ''
              }`}
              onMouseEnter={() => isDragging && setDragOverSlot({ day: i, hour: 0 })}
              onClick={() => onDateClick(date)}
            >
              <div className={`text-sm mb-1 ${isToday(date) ? 'text-blue-400 font-bold' : 'text-white/80'}`}>
                {date.getDate()}
              </div>
              <AnimatePresence mode="popLayout">
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <EventCard key={event.id} event={event} compact showMonthResize />
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

  if (view === 'day') {
    return (
      <div ref={containerRef} className="flex">
        <div className="w-16 flex-shrink-0 border-r border-white/10">
          <div className="h-12 border-b border-white/10" />
          {hours.map((hour) => (
            <div key={hour} className="h-14 border-b border-white/10 pr-2 text-right">
              <span className="text-xs text-white/40">{formatHour(hour)}</span>
            </div>
          ))}
        </div>

        <div className="flex-1">
          <div className={`h-12 border-b border-white/10 p-2 text-center ${isToday(currentDate) ? 'bg-blue-500/20' : ''}`}>
            <div className="text-white/60 text-xs">{currentDate.toLocaleDateString('en-US', { weekday: 'short' })}</div>
            <div className={`text-lg font-bold ${isToday(currentDate) ? 'text-blue-400' : 'text-white'}`}>{currentDate.getDate()}</div>
          </div>

          {hours.map((hour) => {
            const hourEvents = getEventsForHour(currentDate, hour);
            const isDragOver = dragOverSlot?.day === 0 && dragOverSlot?.hour === hour;

            return (
              <motion.div
                key={hour}
                data-slot="true"
                data-day={0}
                data-hour={hour}
                data-date={currentDate.toISOString()}
                animate={{
                  backgroundColor: isDragOver ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  scale: isDragOver ? 1.01 : 1,
                }}
                transition={springConfig}
                className="h-14 border-b border-white/10 relative hover:bg-white/5"
                onMouseEnter={() => isDragging && setDragOverSlot({ day: 0, hour })}
                onClick={() => {
                  const date = new Date(currentDate);
                  date.setHours(hour, 0, 0, 0);
                  onDateClick(date);
                }}
              >
                <AnimatePresence mode="popLayout">
                  {hourEvents.map((event) => (
                    <EventCard key={event.id} event={event} showResize />
                  ))}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex overflow-x-auto">
      <div className="w-16 flex-shrink-0 border-r border-white/10">
        <div className="h-12 border-b border-white/10" />
        {hours.map((hour) => (
          <div key={hour} className="h-14 border-b border-white/10 pr-2 text-right">
            <span className="text-xs text-white/40">{formatHour(hour)}</span>
          </div>
        ))}
      </div>

      {weekDates.map((date, dayIndex) => (
        <div key={dayIndex} className="flex-1 min-w-[100px] border-r border-white/10 last:border-r-0">
          <div className={`h-12 border-b border-white/10 p-1 text-center ${isToday(date) ? 'bg-blue-500/20' : ''}`}>
            <div className="text-white/60 text-xs">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
            <div className={`text-sm font-bold ${isToday(date) ? 'text-blue-400' : 'text-white'}`}>{date.getDate()}</div>
          </div>

          {hours.map((hour) => {
            const hourEvents = getEventsForHour(date, hour);
            const isDragOver = dragOverSlot?.day === dayIndex && dragOverSlot?.hour === hour;

            return (
              <motion.div
                key={hour}
                data-slot="true"
                data-day={dayIndex}
                data-hour={hour}
                data-date={date.toISOString()}
                animate={{
                  backgroundColor: isDragOver ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  scale: isDragOver ? 1.01 : 1,
                }}
                transition={springConfig}
                className="h-14 border-b border-white/10 relative hover:bg-white/5 p-0.5"
                onMouseEnter={() => isDragging && setDragOverSlot({ day: dayIndex, hour })}
                onClick={() => {
                  const clickDate = new Date(date);
                  clickDate.setHours(hour, 0, 0, 0);
                  onDateClick(clickDate);
                }}
              >
                <AnimatePresence mode="popLayout">
                  {hourEvents.map((event) => (
                    <EventCard key={event.id} event={event} showResize />
                  ))}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
