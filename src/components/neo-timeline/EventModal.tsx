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
import { Trash2 } from 'lucide-react';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
  defaultStart: Date | null;
  onSave: (event: Omit<CalendarEvent, 'id' | 'user_id'>) => void;
  onDelete?: () => void;
  isAuthenticated: boolean;
}

export const EventModal = ({
  isOpen,
  onClose,
  event,
  defaultStart,
  onSave,
  onDelete,
  isAuthenticated
}: EventModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [allDay, setAllDay] = useState(false);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
      setStartDate(formatDateInput(event.start_time));
      setStartTime(formatTimeInput(event.start_time));
      setEndDate(formatDateInput(event.end_time));
      setEndTime(formatTimeInput(event.end_time));
      setAllDay(event.all_day);
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
    }
  }, [event, defaultStart, isOpen]);

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
      color: event?.color || '#3b82f6', // Keep existing or default, color managed by project
      all_day: allDay
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">
            {event ? 'Edit Event' : 'New Event'}
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
