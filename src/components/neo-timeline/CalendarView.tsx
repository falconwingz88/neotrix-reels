import { useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
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
}

export const CalendarView = ({
  view,
  currentDate,
  events,
  onDateClick,
  onEventClick,
  onEventDrop,
  onEventResize,
  visibleProjectIds
}: CalendarViewProps) => {
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<{ day: number; hour: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizingEvent, setResizingEvent] = useState<CalendarEvent | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Filter events based on visible projects
  const filteredEvents = useMemo(() => {
    if (!visibleProjectIds) return events;
    return events.filter(e => visibleProjectIds.includes(e.project_id || 'default'));
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

  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.start_time);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getEventsForHour = (date: Date, hour: number) => {
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.start_time);
      return eventDate.toDateString() === date.toDateString() && 
             eventDate.getHours() === hour;
    });
  };

  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
  };

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  const handleDragStart = (event: CalendarEvent) => {
    setDraggedEvent(event);
    setIsDragging(true);
  };

  const handleDragEnd = (
    event: CalendarEvent,
    info: PanInfo,
    targetDate?: Date,
    targetHour?: number
  ) => {
    setIsDragging(false);
    setDraggedEvent(null);
    setDragOverSlot(null);

    if (!targetDate) return;

    const duration = event.end_time.getTime() - event.start_time.getTime();
    const newStart = new Date(targetDate);
    if (targetHour !== undefined) {
      newStart.setHours(targetHour, 0, 0, 0);
    } else {
      newStart.setHours(event.start_time.getHours(), event.start_time.getMinutes(), 0, 0);
    }
    const newEnd = new Date(newStart.getTime() + duration);

    onEventDrop(event.id, newStart, newEnd);
  };

  const handleSlotDragOver = (day: number, hour: number) => {
    setDragOverSlot({ day, hour });
  };

  const springConfig = {
    type: "spring" as const,
    stiffness: 400,
    damping: 25,
    mass: 0.8
  };

  const handleResizeStart = (e: React.MouseEvent, event: CalendarEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setResizingEvent(event);
    
    const startY = e.clientY;
    const startDuration = event.end_time.getTime() - event.start_time.getTime();
    const hourHeight = 56; // h-14 = 3.5rem = 56px

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!resizingEvent && !event) return;
      
      const deltaY = moveEvent.clientY - startY;
      const deltaHours = Math.round(deltaY / hourHeight);
      const newDuration = Math.max(3600000, startDuration + (deltaHours * 3600000)); // Min 1 hour
      
      const newEnd = new Date(event.start_time.getTime() + newDuration);
      
      // Visual update would happen via state, but we defer to final mouseup
      setResizingEvent({ ...event, end_time: newEnd });
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      if (resizingEvent || event) {
        const deltaY = upEvent.clientY - startY;
        const deltaHours = Math.round(deltaY / hourHeight);
        const newDuration = Math.max(3600000, startDuration + (deltaHours * 3600000));
        const newEnd = new Date(event.start_time.getTime() + newDuration);
        
        if (onEventResize && newEnd.getTime() !== event.end_time.getTime()) {
          onEventResize(event.id, newEnd);
        }
      }
      
      setIsResizing(false);
      setResizingEvent(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const EventCard = ({ event, compact = false, showResize = false }: { 
    event: CalendarEvent; 
    compact?: boolean;
    showResize?: boolean;
  }) => (
    <motion.div
      layout
      layoutId={event.id}
      initial={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.03, zIndex: 10 }}
      whileTap={{ scale: 1.08, zIndex: 20 }}
      whileDrag={{ 
        scale: 1.1, 
        zIndex: 50,
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        cursor: "grabbing"
      }}
      drag={!isResizing}
      dragMomentum={false}
      dragElastic={0.1}
      onDragStart={() => !isResizing && handleDragStart(event)}
      onDragEnd={(e, info) => {
        if (isResizing) return;
        const element = document.elementFromPoint(info.point.x, info.point.y);
        const slot = element?.closest('[data-slot]');
        if (slot) {
          const slotHour = parseInt(slot.getAttribute('data-hour') || '0');
          const slotDate = slot.getAttribute('data-date');
          if (slotDate) {
            handleDragEnd(event, info, new Date(slotDate), slotHour);
          }
        } else {
          setIsDragging(false);
          setDraggedEvent(null);
        }
      }}
      transition={springConfig}
      onClick={(e) => {
        e.stopPropagation();
        if (!isDragging && !isResizing) onEventClick(event);
      }}
      className={`relative rounded-lg px-2 py-1 text-xs text-white cursor-grab active:cursor-grabbing select-none group ${
        compact ? 'truncate' : ''
      }`}
      style={{ 
        backgroundColor: event.color,
        touchAction: 'none'
      }}
    >
      <div className="font-medium truncate">{event.title}</div>
      {!compact && (
        <div className="text-white/70 text-[10px]">
          {event.start_time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
        </div>
      )}
      {showResize && (
        <div
          onMouseDown={(e) => handleResizeStart(e, event)}
          className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize opacity-0 group-hover:opacity-100 bg-white/30 rounded-b-lg transition-opacity flex items-center justify-center"
        >
          <div className="w-8 h-0.5 bg-white/60 rounded" />
        </div>
      )}
    </motion.div>
  );

  if (view === 'month') {
    return (
      <div ref={containerRef} className="grid grid-cols-7 gap-px bg-white/10">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
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
                scale: isDragOver ? 1.02 : 1
              }}
              transition={springConfig}
              className={`min-h-24 p-1 hover:bg-white/10 transition-colors cursor-pointer ${
                !isCurrentMonth ? 'opacity-40' : ''
              } ${isToday(date) ? 'ring-2 ring-blue-500 ring-inset' : ''}`}
              onClick={() => onDateClick(date)}
              onMouseEnter={() => isDragging && handleSlotDragOver(i, 0)}
            >
              <div className={`text-sm mb-1 ${isToday(date) ? 'text-blue-400 font-bold' : 'text-white/80'}`}>
                {date.getDate()}
              </div>
              <AnimatePresence mode="popLayout">
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map(event => (
                    <EventCard key={event.id} event={event} compact />
                  ))}
                  {dayEvents.length > 3 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[10px] text-white/60"
                    >
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
          {hours.map(hour => (
            <div key={hour} className="h-14 border-b border-white/10 pr-2 text-right">
              <span className="text-xs text-white/40">{formatHour(hour)}</span>
            </div>
          ))}
        </div>
        
        <div className="flex-1">
          <div className={`h-12 border-b border-white/10 p-2 text-center ${
            isToday(currentDate) ? 'bg-blue-500/20' : ''
          }`}>
            <div className="text-white/60 text-xs">
              {currentDate.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div className={`text-lg font-bold ${isToday(currentDate) ? 'text-blue-400' : 'text-white'}`}>
              {currentDate.getDate()}
            </div>
          </div>
          {hours.map(hour => {
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
                  scale: isDragOver ? 1.01 : 1
                }}
                transition={springConfig}
                className="h-14 border-b border-white/10 relative cursor-pointer hover:bg-white/5"
                onClick={() => {
                  const date = new Date(currentDate);
                  date.setHours(hour, 0, 0, 0);
                  onDateClick(date);
                }}
                onMouseEnter={() => isDragging && handleSlotDragOver(0, hour)}
              >
                <AnimatePresence mode="popLayout">
                  {hourEvents.map(event => (
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
        {hours.map(hour => (
          <div key={hour} className="h-14 border-b border-white/10 pr-2 text-right">
            <span className="text-xs text-white/40">{formatHour(hour)}</span>
          </div>
        ))}
      </div>
      
      {weekDates.map((date, dayIndex) => (
        <div key={dayIndex} className="flex-1 min-w-[100px] border-r border-white/10 last:border-r-0">
          <div className={`h-12 border-b border-white/10 p-1 text-center ${
            isToday(date) ? 'bg-blue-500/20' : ''
          }`}>
            <div className="text-white/60 text-xs">
              {date.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div className={`text-sm font-bold ${isToday(date) ? 'text-blue-400' : 'text-white'}`}>
              {date.getDate()}
            </div>
          </div>
          {hours.map(hour => {
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
                  scale: isDragOver ? 1.01 : 1
                }}
                transition={springConfig}
                className="h-14 border-b border-white/10 relative cursor-pointer hover:bg-white/5 p-0.5"
                onClick={() => {
                  const clickDate = new Date(date);
                  clickDate.setHours(hour, 0, 0, 0);
                  onDateClick(clickDate);
                }}
                onMouseEnter={() => isDragging && handleSlotDragOver(dayIndex, hour)}
              >
                <AnimatePresence mode="popLayout">
                  {hourEvents.map(event => (
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
