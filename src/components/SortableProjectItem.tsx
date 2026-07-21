import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit2, Trash2, ExternalLink, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CustomProject } from '@/contexts/ProjectsContext';

interface SortableProjectItemProps {
  project: CustomProject;
  thumbnail: string;
  onEdit: (project: CustomProject) => void;
  onDelete: (id: string, title: string) => void;
  onRestrict?: (id: string, title: string) => void;
  isCompact?: boolean;
}

export const SortableProjectItem = ({ 
  project, 
  thumbnail, 
  onEdit, 
  onDelete,
  onRestrict,
  isCompact = true,
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

  const hasFileLink = !!project.fileLink;

  if (isCompact) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`admin-project-row group bg-white/5 rounded-xl border border-white/10 hover:border-cyan-300/30 transition-all ${
          isDragging ? 'shadow-lg shadow-white/10' : ''
        }`}
      >
        <div className="flex items-center gap-2 p-2">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            aria-label={`Reorder ${project.title}`}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-white/10 rounded transition-colors touch-none"
          >
            <GripVertical className="w-4 h-4 text-white/40" />
          </div>

          {/* Thumbnail */}
          <div className="w-14 h-10 md:w-20 md:h-12 rounded-lg overflow-hidden bg-black/40 flex-shrink-0 border border-white/10">
            <img
              src={thumbnail}
              alt={project.title}
              className="w-full h-full object-contain p-0.5 transition-transform duration-500 group-hover:scale-[1.03]"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=100';
              }}
            />
          </div>

          {/* Project Info - Single line */}
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <h3 className="text-white font-medium truncate text-sm">{project.title}</h3>
            {hasFileLink && (
              <ExternalLink className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
            )}
            <span className="text-white/40 text-xs hidden sm:inline">({project.year || 'N/A'})</span>
            <div className="hidden md:flex gap-1">
              {project.tags.slice(0, 2).map((tag, i) => (
                <Badge key={i} variant="secondary" className="bg-white/10 text-white/70 text-[10px] px-1.5 py-0">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-1 flex-shrink-0 items-center">
            {onRestrict && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRestrict(project.id, project.title)}
                aria-label={`Move ${project.title} to restricted projects`}
                className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20 w-7 h-7"
                title="Move to Restricted"
              >
                <Lock className="w-3.5 h-3.5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(project)}
              aria-label={`Edit ${project.title}`}
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 w-7 h-7"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(project.id, project.title)}
              aria-label={`Delete ${project.title}`}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/20 w-7 h-7"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Detailed view
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`admin-project-row group bg-white/5 rounded-xl border border-white/10 hover:border-cyan-300/30 transition-all ${
        isDragging ? 'shadow-lg shadow-white/10' : ''
      }`}
    >
      <div className="flex gap-3 p-3">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          aria-label={`Reorder ${project.title}`}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-white/10 rounded transition-colors touch-none self-start mt-1"
        >
          <GripVertical className="w-4 h-4 text-white/40" />
        </div>

        {/* Thumbnail */}
        <div className="w-24 h-16 md:w-32 md:h-20 rounded-lg overflow-hidden bg-black/40 flex-shrink-0 border border-white/10">
          <img
            src={thumbnail}
            alt={project.title}
            className="w-full h-full object-contain p-1 transition-transform duration-500 group-hover:scale-[1.03]"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=100';
            }}
          />
        </div>

        {/* Project Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-medium truncate">{project.title}</h3>
            {hasFileLink && (
              <ExternalLink className="w-4 h-4 text-green-400 flex-shrink-0" />
            )}
            <span className="text-white/40 text-xs">({project.year || 'N/A'})</span>
          </div>
          
          {project.description && (
            <p className="text-white/60 text-sm line-clamp-1 mb-2">{project.description}</p>
          )}
          
          <div className="flex flex-wrap gap-1">
            {project.tags.map((tag, i) => (
              <Badge key={i} variant="secondary" className="bg-white/10 text-white/70 text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1 flex-shrink-0">
          {onRestrict && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRestrict(project.id, project.title)}
              aria-label={`Move ${project.title} to restricted projects`}
              className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20 w-8 h-8"
              title="Move to Restricted"
            >
              <Lock className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(project)}
            aria-label={`Edit ${project.title}`}
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 w-8 h-8"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(project.id, project.title)}
            aria-label={`Delete ${project.title}`}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/20 w-8 h-8"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
