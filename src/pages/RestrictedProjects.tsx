import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Users, Lock, Link as LinkIcon, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/contexts/ProjectsContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// Helper function to extract YouTube video ID and generate thumbnail
const getYouTubeVideoId = (url: string): string => {
  if (!url) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : "";
};

const getYouTubeThumbnail = (url: string): string => {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : "";
};

const RestrictedProjects = () => {
  const navigate = useNavigate();
  const { customProjects, loading } = useProjects();
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter only restricted projects
  const restrictedProjects = useMemo(() => {
    return customProjects
      .filter((cp) => (cp as any).isRestricted === true)
      .map((cp) => ({
        id: cp.id,
        title: cp.title,
        description: cp.description,
        thumbnail: cp.thumbnail || (cp.links[0] ? getYouTubeThumbnail(cp.links[0]) : ""),
        tags: cp.tags,
        year: cp.year || new Date(cp.createdAt).getFullYear(),
        client: cp.client || cp.credits || "Neotrix",
        primaryVideoUrl: cp.links[0] || "",
      }));
  }, [customProjects]);

  // Filter by search
  const filteredProjects = useMemo(() => {
    if (!searchTerm) return restrictedProjects;
    const term = searchTerm.toLowerCase();
    return restrictedProjects.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.client.toLowerCase().includes(term)
    );
  }, [restrictedProjects, searchTerm]);

  const handleCopyLink = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/projects/${projectId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(projectId);
      toast.success("Link copied!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-r from-purple-500/15 to-pink-400/15 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-r from-indigo-400/15 to-purple-400/15 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center gap-2 text-white/60">
            <Lock className="w-5 h-5" />
            <span className="text-sm uppercase tracking-wider">Private Portfolio</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Exclusive Projects</h1>
          <p className="text-white/60 max-w-xl mx-auto">
            These projects are shared privately. Please do not distribute the links publicly.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="group cursor-pointer bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:border-white/30 relative"
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <div className="aspect-video bg-gray-800 overflow-hidden relative">
                  <img
                    src={project.thumbnail || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400"}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400";
                    }}
                  />
                  {/* Copy Link Button */}
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white border-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleCopyLink(project.id, e)}
                  >
                    {copiedId === project.id ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <LinkIcon className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full whitespace-nowrap">
                      {project.year}
                    </span>
                  </div>

                  <p className="text-sm text-white/70 line-clamp-2">{project.description}</p>

                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <Users className="w-3 h-3" />
                    <span className="line-clamp-1">{project.client}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 3).map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs bg-purple-500/20 text-purple-200 hover:bg-purple-500/30"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Lock className="w-12 h-12 text-white/30 mx-auto mb-4" />
            <p className="text-white/60">No restricted projects available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestrictedProjects;
