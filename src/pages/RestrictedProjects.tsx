import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Search, ArrowUpRight, Eye, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RestrictedProject {
  id: string;
  title: string;
  description: string | null;
  tags: string[];
  thumbnail: string | null;
  year: string | null;
  client: string | null;
}

export default function RestrictedProjects() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<RestrictedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [migratingId, setMigratingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      navigate("/");
      return;
    }
    fetchRestrictedProjects();
  }, [isAuthenticated, isAdmin, authLoading, navigate]);

  const fetchRestrictedProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("id, title, description, tags, thumbnail, year, client")
        .eq("is_restricted", true)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching restricted projects:", error);
      toast.error("Failed to load restricted projects");
    } finally {
      setLoading(false);
    }
  };

  const handleMigrateToPublic = async (projectId: string, projectTitle: string) => {
    setMigratingId(projectId);
    try {
      const { error } = await supabase
        .from("projects")
        .update({ is_restricted: false })
        .eq("id", projectId);

      if (error) throw error;
      
      setProjects(prev => prev.filter(p => p.id !== projectId));
      toast.success(`"${projectTitle}" moved to public projects`);
    } catch (error) {
      console.error("Error migrating project:", error);
      toast.error("Failed to migrate project");
    } finally {
      setMigratingId(null);
    }
  };

  const filteredProjects = projects.filter(project => {
    const searchLower = searchQuery.toLowerCase();
    return (
      project.title.toLowerCase().includes(searchLower) ||
      project.client?.toLowerCase().includes(searchLower) ||
      project.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/admin")}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-yellow-500" />
                <h1 className="text-3xl font-bold">Restricted Projects</h1>
              </div>
              <p className="text-white/60 mt-1">
                {projects.length} project{projects.length !== 1 ? "s" : ""} in restricted section
              </p>
            </div>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <Lock className="h-16 w-16 text-white/20 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white/60 mb-2">
              {searchQuery ? "No projects found" : "No restricted projects"}
            </h2>
            <p className="text-white/40">
              {searchQuery
                ? "Try adjusting your search query"
                : "Projects marked as restricted will appear here"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="bg-white/5 border-white/10 hover:border-yellow-500/50 transition-all duration-300 overflow-hidden group">
                    <div className="aspect-video relative overflow-hidden">
                      {project.thumbnail ? (
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                          <Lock className="h-12 w-12 text-white/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                          Restricted
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">
                        {project.title}
                      </h3>
                      {project.client && (
                        <p className="text-sm text-white/60 mb-2">{project.client}</p>
                      )}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.tags?.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs border-white/20 text-white/70"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {project.year && (
                          <Badge
                            variant="outline"
                            className="text-xs border-white/20 text-white/70"
                          >
                            {project.year}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-white/20 text-white hover:bg-white/10"
                          onClick={() => navigate(`/projects/${project.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleMigrateToPublic(project.id, project.title)}
                          disabled={migratingId === project.id}
                        >
                          {migratingId === project.id ? (
                            <span className="animate-spin">⏳</span>
                          ) : (
                            <>
                              <ArrowUpRight className="h-4 w-4 mr-1" />
                              Publish
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
