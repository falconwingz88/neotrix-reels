import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Users, Clock, FolderOpen, Share2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useProjects } from "@/contexts/ProjectsContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Helper function to extract YouTube video ID
const getYouTubeVideoId = (url: string): string => {
  if (!url) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : "";
};

// Get embed URL from video URL
const getEmbedUrl = (url: string): string => {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
};

interface ClientLogo {
  name: string;
  url: string;
  scale: string;
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { customProjects, loading } = useProjects();
  const { isAuthenticated, isAdmin } = useAuth();
  const [clientLogo, setClientLogo] = useState<ClientLogo | null>(null);

  const project = customProjects.find((p) => p.id === id);

  // Fetch client logo when project loads
  useEffect(() => {
    const fetchClientLogo = async () => {
      if (project?.client) {
        const { data } = await supabase
          .from('client_logos')
          .select('name, url, scale')
          .eq('name', project.client)
          .eq('is_active', true)
          .single();
        
        if (data) {
          setClientLogo(data);
        }
      }
    };
    fetchClientLogo();
  }, [project?.client]);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const getScaleClass = (scale: string) => {
    switch (scale) {
      case '3x': return 'scale-150';
      case '2x': return 'scale-125';
      case 'small': return 'scale-75';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Project Not Found</h1>
            <p className="text-white/70 mb-8">The project you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/projects")} className="bg-white/20 hover:bg-white/30 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const projectData = {
    id: project.id,
    title: project.title,
    description: project.description,
    thumbnail: project.thumbnail,
    tags: project.tags,
    year: project.year || new Date(project.createdAt).getFullYear(),
    client: project.client || "Neotrix",
    credits: project.credits || "",
    primaryVideoUrl: project.links[0] || "",
    allVideos: project.links,
    fileLink: project.fileLink,
    projectStartDate: project.projectStartDate,
    deliveryDate: project.deliveryDate,
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-r from-blue-500/25 to-cyan-400/25 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/25 to-indigo-400/25 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-gradient-to-r from-cyan-400/15 to-blue-400/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>
      
      <Header />

      <div className="max-w-6xl mx-auto px-4 pt-24 md:pt-20 pb-8 relative z-10">
        {/* Back Button & Share */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <Button
            onClick={() => navigate("/projects")}
            variant="ghost"
            className="text-white hover:bg-white/10 bg-white/5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button
                onClick={() => navigate(`/admin?edit=${project.id}`)}
                variant="ghost"
                className="text-white hover:bg-white/10 bg-white/5"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
            <Button
              onClick={handleShare}
              variant="ghost"
              className="text-white hover:bg-white/10 bg-white/5"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Project Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{projectData.title}</h1>
          <div className="flex flex-wrap gap-2">
            {projectData.tags.map((tag) => (
              <Badge key={tag} className="bg-white/20 text-white border-white/30">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Admin File Link - Only visible to admins */}
          {isAuthenticated && projectData.fileLink && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-300 mb-2 flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                High-Resolution Files (Admin Only)
              </h3>
              <a
                href={projectData.fileLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-200 hover:text-green-100 underline break-all"
              >
                {projectData.fileLink}
              </a>
            </div>
          )}

          {/* Primary Video */}
          {projectData.primaryVideoUrl && (
            <div className="aspect-video bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden shadow-xl">
              <iframe
                src={getEmbedUrl(projectData.primaryVideoUrl)}
                title="Project Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          )}

          {/* Additional Videos */}
          {projectData.allVideos.length > 1 && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Additional Videos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectData.allVideos.slice(1).map((videoUrl, index) => (
                  <div
                    key={index}
                    className="aspect-video bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden"
                  >
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

          {/* Project Timeline */}
          <div className="flex flex-wrap gap-6">
            {projectData.projectStartDate && (
              <div className="flex items-center gap-3 text-white/70">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-sm text-white/50">Start Date</p>
                  <p className="text-white">{new Date(projectData.projectStartDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            )}
            {projectData.deliveryDate && (
              <div className="flex items-center gap-3 text-white/70">
                <Clock className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm text-white/50">Delivery Date</p>
                  <p className="text-white">{new Date(projectData.deliveryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            )}
            {!projectData.projectStartDate && !projectData.deliveryDate && (
              <div className="flex items-center gap-3 text-white/70">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-sm text-white/50">Year</p>
                  <p className="text-white">{projectData.year}</p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">Project Overview</h2>
            <p className="text-white/80 text-lg leading-relaxed">{projectData.description}</p>
          </div>

          {/* Client Information */}
          {projectData.client && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-6 h-6" />
                Client
              </h2>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                {clientLogo ? (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-lg">
                      <img
                        src={clientLogo.url}
                        alt={clientLogo.name}
                        className={`max-w-full max-h-full object-contain filter brightness-0 invert ${getScaleClass(clientLogo.scale)}`}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                    <span className="text-white font-medium">{clientLogo.name}</span>
                  </div>
                ) : (
                  <div className="text-white/80">{projectData.client}</div>
                )}
              </div>
            </div>
          )}

          {/* Credits */}
          {projectData.credits && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6" />
                Production Credits
              </h2>
              <div className="text-white/80 whitespace-pre-line">{projectData.credits}</div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
