import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CalendarView } from '@/components/neo-timeline/CalendarView';
import { EventModal } from '@/components/neo-timeline/EventModal';
import { BackgroundSettings } from '@/components/neo-timeline/BackgroundSettings';
import { ProjectSidebar, Project } from '@/components/neo-timeline/ProjectSidebar';
import { ChevronLeft, ChevronRight, Plus, Settings, Save, Share2 } from 'lucide-react';
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

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_time: Date;
  end_time: Date;
  color: string;
  all_day: boolean;
  user_id?: string;
  project_id?: string;
}

type ViewType = 'month';

const NeoTimeline = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedEventIds, setSelectedEventIds] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEventStart, setNewEventStart] = useState<Date | null>(null);
  
  // Load theme from localStorage
  const [backgroundGradient, setBackgroundGradient] = useState(() => {
    const saved = localStorage.getItem('neo-timeline-theme');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { from: '#000000', via: '#0f172a', to: '#1e1b4b' };
      }
    }
    return { from: '#000000', via: '#0f172a', to: '#1e1b4b' };
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Project management state
  const [projects, setProjects] = useState<Project[]>([
    { id: 'default', name: 'General', color: '#3b82f6', visible: true }
  ]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [sidebarSelectedEvent, setSidebarSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [showHolidays, setShowHolidays] = useState(() => {
    const saved = localStorage.getItem('neo-timeline-show-holidays');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Save showHolidays preference
  useEffect(() => {
    localStorage.setItem('neo-timeline-show-holidays', JSON.stringify(showHolidays));
  }, [showHolidays]);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('neo-timeline-theme', JSON.stringify(backgroundGradient));
  }, [backgroundGradient]);


  // Get visible project IDs
  const visibleProjectIds = projects.filter(p => p.visible).map(p => p.id);

  const eventsStorageKey = `neo-timeline-events:${user?.id ?? 'anon'}`;
  const projectsStorageKey = `neo-timeline-projects:${user?.id ?? 'anon'}`;

  // Restore cached projects/events immediately (prevents "missing" data on reload while developing)
  useEffect(() => {
    try {
      const cachedProjects = localStorage.getItem(projectsStorageKey);
      if (cachedProjects) setProjects(JSON.parse(cachedProjects));

      const cachedEvents = localStorage.getItem(eventsStorageKey);
      if (cachedEvents) {
        const parsed = JSON.parse(cachedEvents) as any[];
        setEvents(
          parsed.map((e) => ({
            ...e,
            start_time: new Date(e.start_time),
            end_time: new Date(e.end_time),
          }))
        );
      }
    } catch {
      // ignore cache errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectsStorageKey, eventsStorageKey]);

  // Persist projects/events locally (per account)
  useEffect(() => {
    localStorage.setItem(projectsStorageKey, JSON.stringify(projects));
  }, [projects, projectsStorageKey]);

  useEffect(() => {
    localStorage.setItem(
      eventsStorageKey,
      JSON.stringify(
        events.map((e) => ({
          ...e,
          start_time: e.start_time.toISOString(),
          end_time: e.end_time.toISOString(),
        }))
      )
    );
  }, [events, eventsStorageKey]);

  // Load events from database if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadEvents();
    }
  }, [isAuthenticated, user]);

  // Import shared snapshot from URL hash
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.startsWith('#share=')) return;

    try {
      const encoded = hash.replace('#share=', '');
      const json = decodeURIComponent(escape(window.atob(encoded)));
      const payload = JSON.parse(json) as { projects?: any[]; events?: any[] };

      if (payload.projects && Array.isArray(payload.projects)) {
        setProjects(payload.projects);
      }

      if (payload.events && Array.isArray(payload.events)) {
        setEvents(
          payload.events.map((e) => ({
            ...e,
            start_time: new Date(e.start_time),
            end_time: new Date(e.end_time),
          }))
        );
      }

      toast({ title: 'Loaded shared timeline' });
    } catch {
      toast({ title: 'Invalid share link', variant: 'destructive' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadEvents = async () => {
    if (!user) return;

    const { data, error } = await supabase.from('calendar_events').select('*').eq('user_id', user.id);

    if (error) {
      console.error('Error loading events:', error);
      return;
    }

    setEvents(
      data.map((e) => ({
        ...e,
        start_time: new Date(e.start_time),
        end_time: new Date(e.end_time),
      }))
    );
  };


  const saveEvent = async (event: Omit<CalendarEvent, 'id' | 'user_id'>) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Login Required",
        description: "Please login to save your events.",
        variant: "destructive"
      });
      return null;
    }

    const { data, error } = await supabase
      .from('calendar_events')
      .insert({
        ...event,
        user_id: user.id,
        start_time: event.start_time.toISOString(),
        end_time: event.end_time.toISOString()
      })
      .select()
      .single();
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to save event.",
        variant: "destructive"
      });
      return null;
    }
    
    const newEvent = {
      ...data,
      start_time: new Date(data.start_time),
      end_time: new Date(data.end_time)
    };
    
    setEvents(prev => [...prev, newEvent]);
    toast({
      title: "Success",
      description: "Event saved successfully."
    });
    return newEvent;
  };

  const updateEvent = async (event: CalendarEvent) => {
    if (!isAuthenticated || !user) {
      setEvents(prev => prev.map(e => e.id === event.id ? event : e));
      return event;
    }

    const { error } = await supabase
      .from('calendar_events')
      .update({
        title: event.title,
        description: event.description,
        start_time: event.start_time.toISOString(),
        end_time: event.end_time.toISOString(),
        color: event.color,
        all_day: event.all_day
      })
      .eq('id', event.id)
      .eq('user_id', user.id);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update event.",
        variant: "destructive"
      });
      return null;
    }
    
    setEvents(prev => prev.map(e => e.id === event.id ? event : e));
    return event;
  };

  const deleteEvent = async (eventId: string) => {
    if (!isAuthenticated || !user) {
      setEvents(prev => prev.filter(e => e.id !== eventId));
      return;
    }

    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', eventId)
      .eq('user_id', user.id);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete event.",
        variant: "destructive"
      });
      return;
    }
    
    setEvents(prev => prev.filter(e => e.id !== eventId));
    toast({
      title: "Success",
      description: "Event deleted."
    });
  };

  const handleEventDrop = useCallback(async (eventId: string, newStart: Date, newEnd: Date) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    const updatedEvent = {
      ...event,
      start_time: newStart,
      end_time: newEnd
    };
    
    await updateEvent(updatedEvent);
  }, [events, updateEvent]);


  const dateToKey = (date: Date) => date.toISOString().split('T')[0];

  const handleDateClick = (date: Date, multi?: boolean) => {
    const key = dateToKey(date);
    
    if (multi) {
      // Multi-select mode
      setSelectedDates(prev => {
        const next = new Set(prev);
        if (next.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
        }
        return next;
      });
    } else {
      // Single select - toggle or set
      setSelectedDates(prev => {
        if (prev.has(key) && prev.size === 1) {
          return new Set(); // Deselect if already selected
        }
        return new Set([key]);
      });
    }
    
    setNewEventStart(date);
    setSelectedEvent(null);
  };


  const handleEventClick = (event: CalendarEvent) => {
    setSidebarSelectedEvent(event);
    setSelectedEventIds((prev) => (prev.has(event.id) ? prev : new Set([event.id])));
  };

  const handleEventEdit = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setNewEventStart(null);
    setIsModalOpen(true);
  };

  const handleEventResize = useCallback(async (eventId: string, newStart: Date, newEnd: Date) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    const updatedEvent = { ...event, start_time: newStart, end_time: newEnd };
    await updateEvent(updatedEvent);
    // Update sidebar selected event if it's the one being resized
    if (sidebarSelectedEvent?.id === eventId) {
      setSidebarSelectedEvent(updatedEvent);
    }
  }, [events, updateEvent, sidebarSelectedEvent]);

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const snapshotPayload = () => ({
    projects,
    events: events.map((e) => ({
      ...e,
      start_time: e.start_time.toISOString(),
      end_time: e.end_time.toISOString(),
    })),
  });

  const handleSaveSnapshot = () => {
    const blob = new Blob([JSON.stringify(snapshotPayload(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neo-timeline-${currentDate.getFullYear()}-${currentDate.getMonth() + 1}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Saved snapshot' });
  };

  const handleShareSnapshot = async () => {
    try {
      const encoded = window.btoa(unescape(encodeURIComponent(JSON.stringify(snapshotPayload()))));
      const link = `${window.location.origin}/neo-timeline#share=${encoded}`;
      await navigator.clipboard.writeText(link);
      toast({ title: 'Share link copied' });
    } catch {
      toast({ title: 'Failed to copy share link', variant: 'destructive' });
    }
  };

  const formatDateRange = () => {
    const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
    return currentDate.toLocaleDateString('en-US', options);
  };

  const createLocalEvent = (event: Omit<CalendarEvent, 'id' | 'user_id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `local-${Date.now()}`,
      project_id: selectedProjectId || 'default'
    };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(to bottom right, ${backgroundGradient.from}, ${backgroundGradient.via}, ${backgroundGradient.to})`
      }}
    >
      {/* Floating circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -top-48 -left-48 animate-bounce" style={{ animationDuration: '8s' }} />
        <div className="absolute w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl top-1/4 right-0 animate-bounce" style={{ animationDuration: '10s', animationDelay: '1s' }} />
        <div className="absolute w-72 h-72 bg-blue-400/20 rounded-full blur-3xl bottom-0 left-1/4 animate-bounce" style={{ animationDuration: '9s', animationDelay: '2s' }} />
      </div>

      <Header />
      
      <main className="relative z-10 pt-24 pb-16 px-4 min-h-screen">
        <div className="max-w-full mx-auto flex gap-4">
          {/* Project Sidebar */}
          <ProjectSidebar
            projects={projects}
            onProjectsChange={setProjects}
            selectedProjectId={selectedProjectId}
            onSelectProject={setSelectedProjectId}
            selectedEvent={sidebarSelectedEvent}
            onEventClick={handleEventEdit}
            onClearSelectedEvent={() => setSidebarSelectedEvent(null)}
            showHolidays={showHolidays}
            onShowHolidaysChange={setShowHolidays}
          />

          {/* Main Calendar Area */}
          <div className="flex-1 min-w-0">
            {/* Calendar Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigateDate('prev')}
                    className="text-white hover:bg-white/20"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigateDate('next')}
                    className="text-white hover:bg-white/20"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
                <span className="text-white text-lg font-medium">{formatDateRange()}</span>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                {/* Action Buttons */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleSaveSnapshot}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-black/90 text-white border-white/20">
                      <p>Download snapshot</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleShareSnapshot}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-black/90 text-white border-white/20">
                      <p>Copy share link</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Popover open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 bg-black/90 border-white/20 backdrop-blur-xl">
                    <BackgroundSettings 
                      gradient={backgroundGradient} 
                      onChange={setBackgroundGradient} 
                    />
                  </PopoverContent>
                </Popover>

                <Button
                  onClick={() => {
                    setSelectedEvent(null);
                    setIsModalOpen(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
              <CalendarView
                view={view}
                currentDate={currentDate}
                events={events}
                projects={projects}
                onDateClick={handleDateClick}
                onEventClick={handleEventClick}
                onEventDrop={handleEventDrop}
                onEventResize={handleEventResize}
                visibleProjectIds={selectedProjectId ? [selectedProjectId] : visibleProjectIds}
                selectedEventIds={selectedEventIds}
                onSelectedEventIdsChange={setSelectedEventIds}
                selectedDates={selectedDates}
                onSelectedDatesChange={setSelectedDates}
                showHolidays={showHolidays}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
          setNewEventStart(null);
        }}
        event={selectedEvent}
        defaultStart={newEventStart}
        onSave={async (eventData) => {
          if (selectedEvent) {
            await updateEvent({ ...selectedEvent, ...eventData });
          } else if (isAuthenticated) {
            await saveEvent({ ...eventData, project_id: selectedProjectId || 'default' });
          } else {
            createLocalEvent(eventData);
          }
          setIsModalOpen(false);
          setSelectedEvent(null);
          setNewEventStart(null);
        }}
        onDelete={selectedEvent ? () => {
          deleteEvent(selectedEvent.id);
          setIsModalOpen(false);
          setSelectedEvent(null);
        } : undefined}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
};

export default NeoTimeline;
