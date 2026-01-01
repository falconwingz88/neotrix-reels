import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Users, Clock, FolderOpen, Share2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useProjects } from "@/contexts/ProjectsContext";
import { useAuth } from "@/contexts/AuthContext";
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

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { customProjects, loading } = useProjects();
  const { isAuthenticated, isAdmin } = useAuth();

  const project = customProjects.find((p) => p.id === id);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-blue-900 flex flex-col">
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-blue-900 bg-[length:200%_200%] animate-gradient">
      <Header />

      <div className="max-w-6xl mx-auto px-4 pt-24 md:pt-20 pb-8">
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

          {/* Year */}
          <div className="flex items-center gap-3 text-white/70">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-sm text-white/50">Year</p>
              <p className="text-white">{projectData.year}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">Project Overview</h2>
            <p className="text-white/80 text-lg leading-relaxed">{projectData.description}</p>
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
                  <span className="text-white/60">Client:</span> {projectData.client}
                </div>
                <div className="text-white/80">
                  <span className="text-white/60">Year:</span> {projectData.year}
                </div>
              </div>
            </div>
          </div>

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
