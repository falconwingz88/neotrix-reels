
import { X, Calendar, Users, Clock, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Project } from './ProjectsBrowser';

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
}

export const ProjectDetailModal = ({ project, onClose }: ProjectDetailModalProps) => {
  // Helper function to extract YouTube video ID
  const getYouTubeVideoId = (url: string): string => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  // Get embed URL from video URL
  const getEmbedUrl = (url: string): string => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

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
              {/* Primary Video */}
              {project.primaryVideoUrl && (
                <div className="aspect-video bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden shadow-xl mb-4">
                  <iframe
                    src={getEmbedUrl(project.primaryVideoUrl)}
                    title="Project Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              )}
              
              {/* Additional Videos */}
              {project.allVideos.length > 1 && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Additional Videos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.allVideos.slice(1).map((videoUrl, index) => (
                      <div key={index} className="aspect-video bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
                        <iframe
                          src={getEmbedUrl(videoUrl)}
                          title={`Additional Video ${index + 1}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
                
              {/* Year */}
              <div className="mt-4 flex items-center gap-3 text-white/70">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-sm text-white/50">Year</p>
                  <p className="text-white">{project.year}</p>
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
                This project showcases our expertise in creating compelling visual narratives that resonate with audiences. 
                Through careful attention to detail and innovative techniques, we delivered a high-quality production that 
                meets the client's objectives while maintaining our creative standards.
              </p>
            </div>

            {/* Client Information */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-6 h-6" />
                Client & Production
              </h2>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="space-y-2">
                  <div className="text-white/80">
                    <span className="text-white/60">Client:</span> {project.client}
                  </div>
                  <div className="text-white/80">
                    <span className="text-white/60">Brand:</span> {project.tags[0]}
                  </div>
                  <div className="text-white/80">
                    <span className="text-white/60">Year:</span> {project.year}
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Files */}
            {project.deliveryFiles.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Delivery Files</h2>
                <div className="space-y-2">
                  {project.deliveryFiles.map((file, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <a 
                        href={file} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-300 hover:text-blue-200 text-sm break-all"
                      >
                        {file.includes('youtube.com') || file.includes('youtu.be') ? 
                          `Video ${index + 1}` : 
                          `Delivery File ${index + 1}`
                        }
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Credits */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6" />
                Production Credits
              </h2>
              <div className="space-y-2">
                <div className="text-white/80">Neotrix - Creative Direction & Animation</div>
                <div className="text-white/80">{project.client} - Client & Production</div>
                <div className="text-white/80">Brand: {project.tags[0]}</div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
