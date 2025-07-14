
import { X, Calendar, Users, Clock, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Project } from './ProjectsBrowser';

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
}

export const ProjectDetailModal = ({ project, onClose }: ProjectDetailModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 animate-fade-in">
      {/* Backdrop with Strong Blur */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-2xl animate-fade-in"
        onClick={onClose}
        style={{ backdropFilter: 'blur(25px)' }}
      />
      
      {/* Modal Content - Enhanced Glassmorphism */}
      <div className="relative bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/20 shadow-2xl w-full h-full max-w-[95vw] max-h-[95vh] overflow-hidden animate-scale-in" style={{ backdropFilter: 'blur(30px)' }}>
        {/* Header */}
        <div className="relative">
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2"
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-4xl font-bold text-white mb-2">{project.title}</h1>
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <Badge
                  key={tag}
                  className="bg-white/20 text-white border-white/30"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto h-[calc(95vh-20rem)]">
          <div className="space-y-8">
            {/* Project Video */}
            <div>
                <div className="aspect-video bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden shadow-xl">
                  <iframe
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title="Project Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                
                {/* Date */}
                <div className="mt-4 flex items-center gap-3 text-white/70">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-sm text-white/50">Created</p>
                    <p className="text-white">
                      {new Date(project.dateCreated).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Project Overview</h2>
                <p className="text-white/80 text-lg leading-relaxed mb-4">
                  {project.description}
                </p>
                <p className="text-white/70 leading-relaxed">
                  This project represents a breakthrough in creative storytelling, combining cutting-edge visual effects with compelling narrative structure. Our team worked tirelessly to ensure every frame tells a part of the larger story, creating an immersive experience that resonates with audiences long after viewing.
                </p>
              </div>

              {/* Storyboard */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Storyboard & Process</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <img 
                      src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop" 
                      alt="Storyboard 1"
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                    <p className="text-white/70 text-sm">Initial concept sketches and mood board development</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <img 
                      src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop" 
                      alt="Storyboard 2"
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                    <p className="text-white/70 text-sm">Pre-production planning and technical setup</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <img 
                      src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop" 
                      alt="Storyboard 3"
                      className="w-full h-24 object-cover rounded-lg mb-2"
                    />
                    <p className="text-white/70 text-sm">Production phase</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <img 
                      src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop" 
                      alt="Storyboard 4"
                      className="w-full h-24 object-cover rounded-lg mb-2"
                    />
                    <p className="text-white/70 text-sm">Post-production</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <img 
                      src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop" 
                      alt="Storyboard 5"
                      className="w-full h-24 object-cover rounded-lg mb-2"
                    />
                    <p className="text-white/70 text-sm">Final delivery</p>
                  </div>
                </div>
              </div>

              {/* Backstory */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6" />
                  The Story Behind
                </h2>
                <p className="text-white/80 leading-relaxed">
                  {project.backstory}
                </p>
              </div>

              {/* Behind the Scenes */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-6 h-6" />
                  Behind the Scenes
                </h2>
                <ul className="space-y-3">
                  {project.behindTheScenes.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-white/80"
                    >
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            {/* Credits */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-6 h-6" />
                Credits
              </h2>
              <div className="space-y-2">
                <div className="text-white/80">Emma Wilson - Director</div>
                <div className="text-white/80">Marcus Chen - Cinematographer</div>
                <div className="text-white/80">Sarah Thompson - Editor</div>
                <div className="text-white/80">Jake Rodriguez - Sound Design</div>
                <div className="text-white/80">Lily Park - Color Grading</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
