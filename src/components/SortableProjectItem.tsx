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
      className={`bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all ${
        isDragging ? 'shadow-lg shadow-white/10' : ''
      }`}
    >
      <div className="flex items-center gap-2 md:gap-4 p-2 md:p-4">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-white/10 rounded-lg transition-colors touch-none"
        >
          <GripVertical className="w-5 h-5 text-white/40" />
        </div>

        {/* Thumbnail */}
        <div className="w-16 h-12 md:w-24 md:h-16 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
          <img
            src={thumbnail}
            alt={project.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=100';
            }}
          />
        </div>

        {/* Project Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap">
            <h3 className="text-white font-medium truncate text-sm md:text-base">{project.title}</h3>
            {project.year && (
              <Badge variant="outline" className="border-white/20 text-white/60 text-xs hidden md:inline-flex">
                {project.year}
              </Badge>
            )}
          </div>
          <p className="text-white/60 text-xs md:text-sm mt-1 line-clamp-1">{project.description}</p>
          <div className="flex flex-wrap gap-1 md:gap-2 mt-2">
            {project.tags.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="secondary" className="bg-white/10 text-white/80 text-xs">
                {tag}
              </Badge>
            ))}
            {project.tags.length > 3 && (
              <Badge variant="secondary" className="bg-white/10 text-white/80 text-xs">
                +{project.tags.length - 3}
              </Badge>
            )}
          </div>
          {project.client && (
            <p className="text-white/50 text-xs mt-2">Client: {project.client}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-1 md:gap-2 flex-shrink-0 items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(project)}
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 w-8 h-8"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(project.id, project.title)}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/20 w-8 h-8"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
