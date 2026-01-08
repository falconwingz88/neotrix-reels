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
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Settings,
  Save,
  Share2
} from 'lucide-react';
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

type ViewType = 'day' | 'week' | 'month';

const NeoTimeline = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEventStart, setNewEventStart] = useState<Date | null>(null);
  const [backgroundGradient, setBackgroundGradient] = useState({
    from: '#000000',
    via: '#0f172a',
    to: '#1e1b4b'
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Project management state
  const [projects, setProjects] = useState<Project[]>([
    { id: 'default', name: 'General', color: '#3b82f6', visible: true }
  ]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Get visible project IDs
  const visibleProjectIds = projects.filter(p => p.visible).map(p => p.id);

  // Load events from database if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadEvents();
    }
  }, [isAuthenticated, user]);

  const loadEvents = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error loading events:', error);
      return;
    }
    
    setEvents(data.map(e => ({
      ...e,
      start_time: new Date(e.start_time),
      end_time: new Date(e.end_time)
    })));
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

  const handleDateClick = (date: Date) => {
    setNewEventStart(date);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setNewEventStart(null);
    setIsModalOpen(true);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    switch (view) {
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatDateRange = () => {
    const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
    if (view === 'day') {
      return currentDate.toLocaleDateString('en-US', { ...options, day: 'numeric', weekday: 'long' });
    }
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
          />

          {/* Main Calendar Area */}
          <div className="flex-1 min-w-0">
            {/* Calendar Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white">Neo-Timeline</h1>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToToday}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Today
                </Button>
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
                {/* View Toggle */}
                <div className="flex bg-white/10 rounded-lg p-1">
                  {(['day', 'week', 'month'] as ViewType[]).map((v) => (
                    <Button
                      key={v}
                      variant={view === v ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setView(v)}
                      className={view === v 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                      }
                    >
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </Button>
                  ))}
                </div>

                {/* Action Buttons */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={!isAuthenticated}
                          className={`bg-white/10 border-white/20 ${isAuthenticated ? 'text-white hover:bg-white/20' : 'text-white/40 cursor-not-allowed'}`}
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                      </span>
                    </TooltipTrigger>
                    {!isAuthenticated && (
                      <TooltipContent className="bg-black/90 text-white border-white/20">
                        <p>Login first</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={!isAuthenticated}
                          className={`bg-white/10 border-white/20 ${isAuthenticated ? 'text-white hover:bg-white/20' : 'text-white/40 cursor-not-allowed'}`}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </span>
                    </TooltipTrigger>
                    {!isAuthenticated && (
                      <TooltipContent className="bg-black/90 text-white border-white/20">
                        <p>Login first</p>
                      </TooltipContent>
                    )}
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
                    setNewEventStart(new Date());
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
                onDateClick={handleDateClick}
                onEventClick={handleEventClick}
                onEventDrop={handleEventDrop}
                visibleProjectIds={selectedProjectId ? [selectedProjectId] : visibleProjectIds}
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
