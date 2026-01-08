import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CalendarView } from '@/components/neo-timeline/CalendarView';
import { ProjectSidebar, Project } from '@/components/neo-timeline/ProjectSidebar';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

const NeoTimelineView = () => {
  const [searchParams] = useSearchParams();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [sidebarSelectedEvent, setSidebarSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [selectedEventIds, setSelectedEventIds] = useState<Set<string>>(new Set());
  const [showHolidays, setShowHolidays] = useState(true);
  const [backgroundGradient, setBackgroundGradient] = useState({
    from: '#000000',
    via: '#0f172a',
    to: '#1e1b4b',
  });
  const [error, setError] = useState<string | null>(null);

  // Parse data from URL
  useEffect(() => {
    const data = searchParams.get('data');
    if (!data) {
      setError('No timeline data provided');
      return;
    }

    try {
      const json = decodeURIComponent(escape(window.atob(data)));
      const payload = JSON.parse(json) as {
        projects?: any[];
        events?: any[];
        gradient?: { from: string; via: string; to: string };
        showHolidays?: boolean;
      };

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

      if (payload.gradient) {
        setBackgroundGradient(payload.gradient);
      }

      if (payload.showHolidays !== undefined) {
        setShowHolidays(payload.showHolidays);
      }
    } catch {
      setError('Invalid share link');
    }
  }, [searchParams]);

  const visibleProjectIds = useMemo(
    () => projects.filter((p) => p.visible).map((p) => p.id),
    [projects]
  );

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const formatDateRange = () => {
    const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
    return currentDate.toLocaleDateString('en-US', options);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSidebarSelectedEvent(event);
    setSelectedEventIds(new Set([event.id]));
  };

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: `linear-gradient(to bottom right, ${backgroundGradient.from}, ${backgroundGradient.via}, ${backgroundGradient.to})`,
        }}
      >
        <div className="text-center text-white">
          <Eye className="w-16 h-16 mx-auto mb-4 opacity-40" />
          <h1 className="text-2xl font-bold mb-2">View-Only Timeline</h1>
          <p className="text-white/60">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(to bottom right, ${backgroundGradient.from}, ${backgroundGradient.via}, ${backgroundGradient.to})`,
      }}
    >
      {/* Floating circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -top-48 -left-48 animate-bounce"
          style={{ animationDuration: '8s' }}
        />
        <div
          className="absolute w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl top-1/4 right-0 animate-bounce"
          style={{ animationDuration: '10s', animationDelay: '1s' }}
        />
        <div
          className="absolute w-72 h-72 bg-blue-400/20 rounded-full blur-3xl bottom-0 left-1/4 animate-bounce"
          style={{ animationDuration: '9s', animationDelay: '2s' }}
        />
      </div>

      <Header />

      <main className="relative z-10 pt-24 pb-16 px-4 min-h-screen">
        <div className="max-w-full mx-auto flex gap-4">
          {/* Project Sidebar (read-only) */}
          <ProjectSidebar
            projects={projects}
            onProjectsChange={() => {}} // no-op in view mode
            selectedProjectId={selectedProjectId}
            onSelectProject={setSelectedProjectId}
            selectedEvent={sidebarSelectedEvent}
            onEventClick={() => {}} // no-op in view mode
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

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20">
                  <Eye className="w-4 h-4 text-white/60" />
                  <span className="text-white/60 text-sm">View Only</span>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
              <CalendarView
                view="month"
                currentDate={currentDate}
                events={events}
                projects={projects}
                onDateClick={() => {}}
                onEventClick={handleEventClick}
                onEventDrop={() => {}}
                onEventResize={() => {}}
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
    </div>
  );
};

export default NeoTimelineView;
