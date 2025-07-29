
import { X, Calendar, Users, Clock, Lightbulb, Play, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Project } from './ProjectsBrowser';

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
}

export const ProjectDetailModal = ({ project, onClose }: ProjectDetailModalProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-xl animate-fade-in" onClick={onClose}>
      {/* Modal Content - Enhanced Glassmorphism */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div 
          className="w-full max-w-6xl max-h-[80vh] bg-gradient-to-br from-purple-900 via-pink-800 to-blue-900 rounded-3xl border border-white/20 shadow-2xl overflow-hidden animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 border-b border-white/10">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2"
            >
              <X className="w-5 h-5" />
            </Button>

            <div className="pr-12">
              <h1 className="text-4xl font-bold text-white mb-4">{project.title}</h1>
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
        <div className="p-6 pb-4 overflow-y-auto scrollbar-glassmorphism" style={{ maxHeight: 'calc(80vh - 120px)' }}>
          <div className="space-y-6">
            {/* Project Videos */}
            <div>
              {/* Main Video */}
              {project.mainVideoUrl && (
                <div className="aspect-video bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden shadow-xl mb-6">
                  <iframe
                    src={project.mainVideoUrl.replace('youtu.be/', 'youtube.com/embed/').replace('watch?v=', 'embed/')}
                    title={`${project.title} - Main Video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              )}
              
              {/* Additional Videos */}
              {project.additionalVideos && project.additionalVideos.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Additional Videos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.additionalVideos.map((videoUrl, index) => (
                      <div key={index} className="aspect-video bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
                        <iframe
                          src={videoUrl.replace('youtu.be/', 'youtube.com/embed/').replace('watch?v=', 'embed/')}
                          title={`${project.title} - Video ${index + 2}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
                
              {/* Year and Client Info */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3 text-white/70">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-sm text-white/50">Year</p>
                    <p className="text-white font-semibold">{project.year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <Users className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-white/50">Client</p>
                    <p className="text-white font-semibold">{project.client}</p>
                  </div>
                </div>
              </div>
            </div>

              {/* Brand & Description */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                  <span className="text-gradient bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {project.brand}
                  </span>
                  <span className="text-white/50">·</span>
                  <span className="text-lg text-white/70">{project.title}</span>
                </h2>
                <p className="text-white/80 text-lg leading-relaxed mb-4">
                  {project.description}
                </p>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-white/70 leading-relaxed">
                    This project showcases our expertise in 3D animation and cutting-edge technology, delivering exceptional visual storytelling that captures audiences and elevates brand presence in the competitive market.
                  </p>
                </div>
              </div>

              {/* Production Process */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Production Process</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lightbulb className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">Concept Development</h3>
                    <p className="text-white/70 text-sm">Creative ideation and storyboard development tailored to brand vision</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">3D Production</h3>
                    <p className="text-white/70 text-sm">Advanced 3D modeling, animation, and rendering using cutting-edge technology</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ExternalLink className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">Final Delivery</h3>
                    <p className="text-white/70 text-sm">Post-production polish and optimized delivery for all platforms</p>
                  </div>
                </div>
              </div>

              {/* Technical Highlights */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-6 h-6" />
                  Technical Highlights
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-white font-semibold mb-2">Animation Techniques</h4>
                    <ul className="space-y-2 text-white/70 text-sm">
                      <li>• Advanced 3D character rigging and animation</li>
                      <li>• Photorealistic lighting and rendering</li>
                      <li>• Dynamic particle systems and effects</li>
                    </ul>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-white font-semibold mb-2">Technology Stack</h4>
                    <ul className="space-y-2 text-white/70 text-sm">
                      <li>• Cinema 4D & Blender for 3D modeling</li>
                      <li>• After Effects for compositing</li>
                      <li>• AI-enhanced workflow optimization</li>
                    </ul>
                  </div>
                </div>
              </div>

            {/* Credits */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-6 h-6" />
                Credits & Collaboration
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-white font-semibold mb-3">Neotrix Team</h4>
                  <div className="space-y-2 text-white/80">
                    <div>Creative Director - Neotrix Studio</div>
                    <div>3D Animation Lead - Neotrix Studio</div>
                    <div>Motion Graphics Artist - Neotrix Studio</div>
                    <div>Technical Director - Neotrix Studio</div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-white font-semibold mb-3">Client Partnership</h4>
                  <div className="space-y-2 text-white/80">
                    <div><strong>Client:</strong> {project.client}</div>
                    <div><strong>Brand:</strong> {project.brand}</div>
                    <div><strong>Year:</strong> {project.year}</div>
                    <div><strong>Project Type:</strong> Commercial Production</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
