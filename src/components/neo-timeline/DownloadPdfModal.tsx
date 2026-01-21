import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FileDown, Loader2 } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  color: string;
  visible: boolean;
  startDate?: Date;
  endDate?: Date;
}

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_time: Date;
  end_time: Date;
  color: string;
  all_day: boolean;
  project_id?: string;
  is_sub_event?: boolean;
}

interface DownloadPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  events: CalendarEvent[];
  selectedProjectId: string | null;
  currentDate: Date;
}

export const DownloadPdfModal = ({
  isOpen,
  onClose,
  projects,
  events,
  selectedProjectId,
  currentDate,
}: DownloadPdfModalProps) => {
  const [downloadOption, setDownloadOption] = useState<'selected' | 'all'>(
    selectedProjectId ? 'selected' : 'all'
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  const handleDownload = async () => {
    setIsGenerating(true);
    
    try {
      // Dynamic import to reduce initial bundle size
      const { jsPDF } = await import('jspdf');
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let yPos = margin;

      // Filter events based on selection
      const eventsToExport = downloadOption === 'selected' && selectedProjectId
        ? events.filter(e => e.project_id === selectedProjectId)
        : events;

      // Sort events by date
      const sortedEvents = [...eventsToExport].sort(
        (a, b) => a.start_time.getTime() - b.start_time.getTime()
      );

      // Title
      doc.setFontSize(22);
      doc.setTextColor(30, 30, 30);
      const title = downloadOption === 'selected' && selectedProject
        ? `${selectedProject.name} - Timeline`
        : 'Neo-Timeline - All Events';
      doc.text(title, margin, yPos);
      yPos += 12;

      // Subtitle with date
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`, margin, yPos);
      yPos += 15;

      // Divider line
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;

      if (sortedEvents.length === 0) {
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text('No events found.', margin, yPos);
      } else {
        // Group events by month
        const eventsByMonth: Record<string, typeof sortedEvents> = {};
        sortedEvents.forEach(event => {
          const monthKey = event.start_time.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long' 
          });
          if (!eventsByMonth[monthKey]) {
            eventsByMonth[monthKey] = [];
          }
          eventsByMonth[monthKey].push(event);
        });

        // Render events by month
        Object.entries(eventsByMonth).forEach(([month, monthEvents]) => {
          // Check if we need a new page
          if (yPos > pageHeight - 50) {
            doc.addPage();
            yPos = margin;
          }

          // Month header
          doc.setFontSize(14);
          doc.setTextColor(50, 50, 50);
          doc.setFont('helvetica', 'bold');
          doc.text(month, margin, yPos);
          yPos += 8;

          monthEvents.forEach(event => {
            // Check if we need a new page
            if (yPos > pageHeight - 40) {
              doc.addPage();
              yPos = margin;
            }

            const project = projects.find(p => p.id === event.project_id);
            
            // Event color indicator (small circle)
            const hexColor = event.color || project?.color || '#3b82f6';
            const r = parseInt(hexColor.slice(1, 3), 16);
            const g = parseInt(hexColor.slice(3, 5), 16);
            const b = parseInt(hexColor.slice(5, 7), 16);
            doc.setFillColor(r, g, b);
            doc.circle(margin + 3, yPos - 2, 3, 'F');

            // Event title
            doc.setFontSize(11);
            doc.setTextColor(30, 30, 30);
            doc.setFont('helvetica', 'bold');
            const eventTitle = event.is_sub_event ? `  ↳ ${event.title}` : event.title;
            doc.text(eventTitle, margin + 10, yPos);
            yPos += 5;

            // Event dates
            doc.setFontSize(9);
            doc.setTextColor(100, 100, 100);
            doc.setFont('helvetica', 'normal');
            const startStr = event.start_time.toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            });
            const endStr = event.end_time.toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            });
            const dateStr = startStr === endStr 
              ? startStr 
              : `${startStr} → ${endStr}`;
            doc.text(dateStr, margin + 10, yPos);
            yPos += 4;

            // Project name (if showing all events)
            if (downloadOption === 'all' && project) {
              doc.setFontSize(8);
              doc.setTextColor(130, 130, 130);
              doc.text(`Project: ${project.name}`, margin + 10, yPos);
              yPos += 4;
            }

            // Event description (if exists)
            if (event.description) {
              doc.setFontSize(9);
              doc.setTextColor(80, 80, 80);
              const lines = doc.splitTextToSize(event.description, pageWidth - margin * 2 - 10);
              doc.text(lines.slice(0, 2), margin + 10, yPos); // Max 2 lines
              yPos += lines.slice(0, 2).length * 4;
            }

            yPos += 6;
          });

          yPos += 5; // Extra space after month
        });
      }

      // Footer on last page
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Total Events: ${sortedEvents.length}`, 
        margin, 
        pageHeight - 10
      );
      doc.text(
        'Generated by Neo-Timeline', 
        pageWidth - margin - 40, 
        pageHeight - 10
      );

      // Download
      const fileName = downloadOption === 'selected' && selectedProject
        ? `${selectedProject.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-timeline.pdf`
        : 'neo-timeline-all-events.pdf';
      doc.save(fileName);

      onClose();
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <FileDown className="w-5 h-5" />
            Download Timeline as PDF
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Choose what to include in your PDF export.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup
            value={downloadOption}
            onValueChange={(value) => setDownloadOption(value as 'selected' | 'all')}
            className="space-y-3"
          >
            {selectedProjectId && selectedProject && (
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <RadioGroupItem value="selected" id="selected" className="border-white/40" />
                <Label htmlFor="selected" className="text-white cursor-pointer flex-1">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: selectedProject.color }} 
                    />
                    <span className="font-medium">{selectedProject.name} only</span>
                  </div>
                  <p className="text-white/50 text-sm mt-1">
                    {events.filter(e => e.project_id === selectedProjectId).length} events
                  </p>
                </Label>
              </div>
            )}

            <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/10">
              <RadioGroupItem value="all" id="all" className="border-white/40" />
              <Label htmlFor="all" className="text-white cursor-pointer flex-1">
                <span className="font-medium">All Events</span>
                <p className="text-white/50 text-sm mt-1">
                  {events.length} events from {projects.length} projects
                </p>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDownload}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4 mr-2" />
                Download PDF
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
