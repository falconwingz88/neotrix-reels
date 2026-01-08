import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye,
  EyeOff,
  Trash2,
  Edit2,
  Check,
  X,
  FolderOpen,
  Calendar,
  Clock
} from 'lucide-react';

export interface Project {
  id: string;
  name: string;
  color: string;
  visible: boolean;
}

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

interface ProjectSidebarProps {
  projects: Project[];
  onProjectsChange: (projects: Project[]) => void;
  selectedProjectId: string | null;
  onSelectProject: (projectId: string | null) => void;
  selectedEvent?: CalendarEvent | null;
  onEventClick?: (event: CalendarEvent) => void;
  onClearSelectedEvent?: () => void;
}

export const ProjectSidebar = ({
  projects,
  onProjectsChange,
  selectedProjectId,
  onSelectProject,
  selectedEvent,
  onEventClick,
  onClearSelectedEvent
}: ProjectSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectColor, setNewProjectColor] = useState('#3b82f6');

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: newProjectName.trim(),
      color: newProjectColor,
      visible: true
    };
    
    onProjectsChange([...projects, newProject]);
    setNewProjectName('');
    setIsCreating(false);
    setNewProjectColor('#3b82f6');
  };

  const handleDeleteProject = (id: string) => {
    onProjectsChange(projects.filter(p => p.id !== id));
    if (selectedProjectId === id) {
      onSelectProject(null);
    }
  };

  const handleToggleVisibility = (id: string) => {
    onProjectsChange(
      projects.map(p => p.id === id ? { ...p, visible: !p.visible } : p)
    );
  };

  const handleStartEdit = (project: Project) => {
    setEditingId(project.id);
    setEditingName(project.name);
  };

  const handleSaveEdit = (id: string) => {
    if (!editingName.trim()) return;
    onProjectsChange(
      projects.map(p => p.id === id ? { ...p, name: editingName.trim() } : p)
    );
    setEditingId(null);
    setEditingName('');
  };

  const handleColorChange = (id: string, color: string) => {
    onProjectsChange(
      projects.map(p => p.id === id ? { ...p, color } : p)
    );
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 48 : 280 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="h-full bg-white/10 backdrop-blur-xl border-r border-white/20 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <FolderOpen className="w-5 h-5 text-white/60" />
              <span className="text-white font-medium">Projects</span>
            </motion.div>
          )}
        </AnimatePresence>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white/60 hover:text-white hover:bg-white/10 h-8 w-8"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto p-3 space-y-2"
          >
            {/* Selected Event Details */}
            {selectedEvent && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 rounded-xl bg-white/10 border border-white/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60 text-xs font-medium uppercase tracking-wide">Event Details</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onClearSelectedEvent?.()}
                    className="h-6 w-6 text-white/40 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                <div
                  className="w-full h-2 rounded-full mb-3"
                  style={{ backgroundColor: selectedEvent.color }}
                />
                <h3 className="text-white font-semibold text-lg mb-2">{selectedEvent.title}</h3>
                {selectedEvent.description && (
                  <p className="text-white/60 text-sm mb-3">{selectedEvent.description}</p>
                )}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-white/70">
                    <Calendar className="w-4 h-4" />
                    <span>{selectedEvent.start_time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <Clock className="w-4 h-4" />
                    <span>
                      {selectedEvent.start_time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - {selectedEvent.end_time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => onEventClick?.(selectedEvent)}
                  className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Edit2 className="w-3 h-3 mr-2" />
                  Edit Event
                </Button>
              </motion.div>
            )}

            {/* All Events option */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectProject(null)}
              className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                selectedProjectId === null ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
              <span className="text-white text-sm flex-1">All Events</span>
            </motion.div>

            {/* Project List */}
            {projects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedProjectId === project.id ? 'bg-white/20' : 'hover:bg-white/10'
                } ${!project.visible ? 'opacity-50' : ''}`}
                onClick={() => onSelectProject(project.id)}
              >
                {editingId === project.id ? (
                  <div className="flex items-center gap-2 w-full" onClick={(e) => e.stopPropagation()}>
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="h-7 bg-white/10 border-white/20 text-white text-sm"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(project.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleSaveEdit(project.id)}
                      className="h-6 w-6 text-green-400 hover:text-green-300"
                    >
                      <Check className="w-3 h-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingId(null)}
                      className="h-6 w-6 text-red-400 hover:text-red-300"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div
                      className="w-3 h-3 rounded-full cursor-pointer"
                      style={{ backgroundColor: project.color }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="text-white text-sm flex-1 truncate">{project.name}</span>
                    <div className="hidden group-hover:flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleVisibility(project.id);
                        }}
                        className="h-6 w-6 text-white/40 hover:text-white"
                      >
                        {project.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(project);
                        }}
                        className="h-6 w-6 text-white/40 hover:text-white"
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project.id);
                        }}
                        className="h-6 w-6 text-white/40 hover:text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}

            {/* Create New Project */}
            {isCreating ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2 bg-white/10 rounded-lg space-y-2"
              >
                <Input
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Project name..."
                  className="h-8 bg-white/10 border-white/20 text-white text-sm placeholder:text-white/40"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateProject();
                    if (e.key === 'Escape') setIsCreating(false);
                  }}
                />
                <div className="flex items-center justify-between">
                  <div
                    className="w-6 h-6 rounded-full cursor-pointer border-2 border-white/20"
                    style={{ backgroundColor: newProjectColor }}
                  />
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsCreating(false)}
                      className="h-7 text-white/60 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleCreateProject}
                      className="h-7 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <Button
                variant="ghost"
                onClick={() => setIsCreating(true)}
                className="w-full justify-start text-white/60 hover:text-white hover:bg-white/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed icons */}
      {isCollapsed && (
        <div className="flex flex-col items-center gap-2 p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(false)}
            className="text-white/60 hover:text-white hover:bg-white/10 h-8 w-8"
          >
            <FolderOpen className="w-4 h-4" />
          </Button>
          {projects.slice(0, 5).map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                onSelectProject(project.id);
                setIsCollapsed(false);
              }}
              className={`w-6 h-6 rounded-full cursor-pointer border-2 ${
                selectedProjectId === project.id ? 'border-white' : 'border-transparent'
              }`}
              style={{ backgroundColor: project.color }}
            />
          ))}
          {projects.length > 5 && (
            <span className="text-white/40 text-xs">+{projects.length - 5}</span>
          )}
        </div>
      )}
    </motion.div>
  );
};
