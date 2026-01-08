import { useMemo, useState, useRef } from 'react';
import { CalendarEvent } from '@/pages/NeoTimeline';

interface CalendarViewProps {
  view: 'day' | 'week' | 'month';
  currentDate: Date;
  events: CalendarEvent[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onEventDrop: (eventId: string, newStart: Date, newEnd: Date) => void;
}

export const CalendarView = ({
  view,
  currentDate,
  events,
  onDateClick,
  onEventClick,
  onEventDrop
}: CalendarViewProps) => {
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<{ day: number; hour: number } | null>(null);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  
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
    
    // Previous month days
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      dates.push(date);
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      dates.push(new Date(year, month, i));
    }
    
    // Next month days
    const remaining = 42 - dates.length;
    for (let i = 1; i <= remaining; i++) {
      dates.push(new Date(year, month + 1, i));
    }
    
    return dates;
  };

  const weekDates = useMemo(() => getWeekDates(), [currentDate]);
  const monthDates = useMemo(() => getMonthDates(), [currentDate]);

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start_time);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getEventsForHour = (date: Date, hour: number) => {
    return events.filter(event => {
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

  const handleDragStart = (e: React.DragEvent, event: CalendarEvent) => {
    setDraggedEvent(event);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', event.id);
  };

  const handleDragOver = (e: React.DragEvent, day: number, hour: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSlot({ day, hour });
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleDrop = (e: React.DragEvent, targetDate: Date, hour?: number) => {
    e.preventDefault();
    setDragOverSlot(null);
    
    if (!draggedEvent) return;
    
    const duration = draggedEvent.end_time.getTime() - draggedEvent.start_time.getTime();
    const newStart = new Date(targetDate);
    if (hour !== undefined) {
      newStart.setHours(hour, 0, 0, 0);
    } else {
      newStart.setHours(draggedEvent.start_time.getHours(), draggedEvent.start_time.getMinutes(), 0, 0);
    }
    const newEnd = new Date(newStart.getTime() + duration);
    
    onEventDrop(draggedEvent.id, newStart, newEnd);
    setDraggedEvent(null);
  };

  const EventCard = ({ event, compact = false }: { event: CalendarEvent; compact?: boolean }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, event)}
      onClick={(e) => {
        e.stopPropagation();
        onEventClick(event);
      }}
      className={`rounded-lg px-2 py-1 text-xs text-white cursor-pointer hover:opacity-80 transition-all ${
        compact ? 'truncate' : ''
      }`}
      style={{ backgroundColor: event.color }}
    >
      <div className="font-medium truncate">{event.title}</div>
      {!compact && (
        <div className="text-white/70 text-[10px]">
          {event.start_time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
        </div>
      )}
    </div>
  );

  if (view === 'month') {
    return (
      <div className="grid grid-cols-7 gap-px bg-white/10">
        {/* Header */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-white/60 text-sm font-medium bg-white/5">
            {day}
          </div>
        ))}
        
        {/* Days */}
        {monthDates.map((date, i) => {
          const dayEvents = getEventsForDate(date);
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          
          return (
            <div
              key={i}
              className={`min-h-24 p-1 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer ${
                !isCurrentMonth ? 'opacity-40' : ''
              } ${isToday(date) ? 'ring-2 ring-blue-500 ring-inset' : ''}`}
              onClick={() => onDateClick(date)}
              onDragOver={(e) => handleDragOver(e, i, 0)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, date)}
            >
              <div className={`text-sm mb-1 ${isToday(date) ? 'text-blue-400 font-bold' : 'text-white/80'}`}>
                {date.getDate()}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map(event => (
                  <EventCard key={event.id} event={event} compact />
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-[10px] text-white/60">+{dayEvents.length - 3} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (view === 'day') {
    return (
      <div className="flex">
        {/* Time column */}
        <div className="w-16 flex-shrink-0 border-r border-white/10">
          <div className="h-12 border-b border-white/10" />
          {hours.map(hour => (
            <div key={hour} className="h-14 border-b border-white/10 pr-2 text-right">
              <span className="text-xs text-white/40">{formatHour(hour)}</span>
            </div>
          ))}
        </div>
        
        {/* Day column */}
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
              <div
                key={hour}
                className={`h-14 border-b border-white/10 relative cursor-pointer hover:bg-white/5 ${
                  isDragOver ? 'bg-blue-500/20' : ''
                }`}
                onClick={() => {
                  const date = new Date(currentDate);
                  date.setHours(hour, 0, 0, 0);
                  onDateClick(date);
                }}
                onDragOver={(e) => handleDragOver(e, 0, hour)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, currentDate, hour)}
              >
                {hourEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Week view
  return (
    <div className="flex overflow-x-auto">
      {/* Time column */}
      <div className="w-16 flex-shrink-0 border-r border-white/10">
        <div className="h-12 border-b border-white/10" />
        {hours.map(hour => (
          <div key={hour} className="h-14 border-b border-white/10 pr-2 text-right">
            <span className="text-xs text-white/40">{formatHour(hour)}</span>
          </div>
        ))}
      </div>
      
      {/* Day columns */}
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
              <div
                key={hour}
                className={`h-14 border-b border-white/10 relative cursor-pointer hover:bg-white/5 p-0.5 ${
                  isDragOver ? 'bg-blue-500/20' : ''
                }`}
                onClick={() => {
                  const clickDate = new Date(date);
                  clickDate.setHours(hour, 0, 0, 0);
                  onDateClick(clickDate);
                }}
                onDragOver={(e) => handleDragOver(e, dayIndex, hour)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, date, hour)}
              >
                {hourEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
