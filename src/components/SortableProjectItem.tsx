import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CustomProject } from '@/contexts/ProjectsContext';

interface SortableProjectItemProps {
  project: CustomProject;
  thumbnail: string;
  onEdit: (project: CustomProject) => void;
  onDelete: (id: string, title: string) => void;
}

export const SortableProjectItem = ({ 
  project, 
  thumbnail, 
  onEdit, 
  onDelete 
}: SortableProjectItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white/5 rounded border border-white/10 hover:border-white/20 transition-all ${
        isDragging ? 'shadow-lg shadow-white/10' : ''
      }`}
    >
      <div className="flex items-center gap-1.5 px-1.5 py-1">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-0.5 hover:bg-white/10 rounded transition-colors touch-none"
        >
          <GripVertical className="w-3.5 h-3.5 text-white/40" />
        </div>

        {/* Thumbnail */}
        <div className="w-10 h-6 rounded overflow-hidden bg-white/10 flex-shrink-0">
          <img
            src={thumbnail}
            alt={project.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=100';
            }}
          />
        </div>

        {/* Project Info - Single line */}
        <div className="flex-1 min-w-0 flex items-center gap-1.5">
          <h3 className="text-white font-medium truncate text-xs">{project.title}</h3>
          <span className="text-white/40 text-[10px] hidden sm:inline">{project.year || ''}</span>
          <Badge variant="secondary" className="bg-white/10 text-white/60 text-[9px] px-1 py-0 hidden md:inline-flex">
            {project.tags[0] || 'N/A'}
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex gap-0.5 flex-shrink-0 items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(project)}
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 w-6 h-6"
          >
            <Edit2 className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(project.id, project.title)}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/20 w-6 h-6"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
