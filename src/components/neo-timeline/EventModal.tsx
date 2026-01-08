import { useState, useEffect } from 'react';
import { CalendarEvent } from '@/pages/NeoTimeline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Trash2, Layers } from 'lucide-react';
import { ColorPicker } from './ColorPicker';

const EVENT_COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f59e0b',
  '#8b5cf6', '#ec4899', '#06b6d4', '#f97316',
  '#14b8a6', '#6366f1', '#84cc16', '#a855f7',
];

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
  defaultStart: Date | null;
  onSave: (event: Omit<CalendarEvent, 'id' | 'user_id'>) => void;
  onDelete?: () => void;
  isAuthenticated: boolean;
  isSubEvent?: boolean;
  projectColor?: string;
}

export const EventModal = ({
  isOpen,
  onClose,
  event,
  defaultStart,
  onSave,
  onDelete,
  isAuthenticated,
  isSubEvent: defaultIsSubEvent = false,
  projectColor = '#3b82f6'
}: EventModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [isSubEvent, setIsSubEvent] = useState(defaultIsSubEvent);
  const [eventColor, setEventColor] = useState(projectColor);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
      setStartDate(formatDateInput(event.start_time));
      setStartTime(formatTimeInput(event.start_time));
      setEndDate(formatDateInput(event.end_time));
      setEndTime(formatTimeInput(event.end_time));
      setAllDay(event.all_day);
      setIsSubEvent(event.is_sub_event || false);
      setEventColor(event.color || projectColor);
    } else if (defaultStart) {
      setTitle('');
      setDescription('');
      setStartDate(formatDateInput(defaultStart));
      setStartTime(formatTimeInput(defaultStart));
      const endDefault = new Date(defaultStart);
      endDefault.setHours(endDefault.getHours() + 1);
      setEndDate(formatDateInput(endDefault));
      setEndTime(formatTimeInput(endDefault));
      setAllDay(false);
      setIsSubEvent(defaultIsSubEvent);
      setEventColor(projectColor);
    }
  }, [event, defaultStart, isOpen, defaultIsSubEvent, projectColor]);

  const formatDateInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatTimeInput = (date: Date) => {
    return date.toTimeString().slice(0, 5);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    const start = new Date(`${startDate}T${allDay ? '00:00' : startTime}`);
    const end = new Date(`${endDate}T${allDay ? '23:59' : endTime}`);
    
    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      start_time: start,
      end_time: end,
      color: eventColor,
      all_day: allDay,
      is_sub_event: isSubEvent,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            {event ? 'Edit Event' : 'New Event'}
            {isSubEvent && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                Sub-event
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white/80">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white/80">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-20"
            />
          </div>

          {/* Color and Sub-event row */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-white/80">Color</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-lg cursor-pointer border-2 border-white/20 hover:border-white/40 transition-colors"
                    style={{ backgroundColor: eventColor }}
                  />
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3 bg-black/90 border-white/20 backdrop-blur-xl">
                  <ColorPicker
                    colors={EVENT_COLORS}
                    selectedColor={eventColor}
                    onChange={setEventColor}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-white/60" />
              <Label htmlFor="isSubEvent" className="text-white/80 text-sm">Sub-event</Label>
              <Switch
                id="isSubEvent"
                checked={isSubEvent}
                onCheckedChange={setIsSubEvent}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch
              id="allDay"
              checked={allDay}
              onCheckedChange={setAllDay}
            />
            <Label htmlFor="allDay" className="text-white/80">All day</Label>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white/80">Start</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                required
              />
              {!allDay && (
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                  required
                />
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-white/80">End</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                required
              />
              {!allDay && (
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                  required
                />
              )}
            </div>
          </div>
          
          <DialogFooter className="flex gap-2">
            {event && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={onDelete}
                className="mr-auto"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Cancel
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={!isAuthenticated && !!event}
                    >
                      {event ? 'Update' : 'Create'}
                    </Button>
                  </span>
                </TooltipTrigger>
                {!isAuthenticated && event && (
                  <TooltipContent className="bg-black/90 text-white border-white/20">
                    <p>Login first to save changes</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
