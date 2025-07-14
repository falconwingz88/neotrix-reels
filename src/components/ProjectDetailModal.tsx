
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content - Much bigger now */}
      <div className="relative bg-gradient-to-br from-purple-900/95 via-pink-800/95 to-blue-900/95 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl w-full h-full max-w-[95vw] max-h-[95vh] overflow-hidden">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Project Overview</h2>
                <p className="text-white/80 text-lg leading-relaxed">
                  {project.description}
                </p>
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
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Details */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Project Details</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-white/70">
                    <Calendar className="w-5 h-5 text-purple-400" />
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
              </div>

              {/* Team Members */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  Team Members
                </h3>
                
                <div className="space-y-3">
                  {project.teamMembers.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {member.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-white/80">{member}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
