import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, X, Users, Calendar, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useProjects } from "@/contexts/ProjectsContext";

export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  tags: string[];
  year: number;
  client: string;
  primaryVideoUrl: string;
  allVideos: string[];
  deliveryFiles: string[];
  fileLink?: string;
  deliveryDate?: string;
  createdAt?: string;
}

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

export const TAG_OPTIONS = ["Beauty", "Liquid", "VFX", "Character Animation", "Non-Character Animation", "FX", "AI"];
const YEAR_OPTIONS = [2030, 2029, 2028, 2027, 2026, 2025, 2024, 2023, 2022, 2021, 2020];

export const ProjectsBrowser = () => {
  const navigate = useNavigate();
  const { customProjects, loading } = useProjects();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Convert custom projects to Project format (already sorted by sort_order from context)
  const allProjects: Project[] = customProjects
    .map((cp) => ({
      id: cp.id,
      title: cp.title,
      description: cp.description,
      thumbnail: cp.thumbnail || (cp.links[0] ? getYouTubeThumbnail(cp.links[0]) : ""),
      tags: cp.tags,
      year: cp.year || new Date(cp.createdAt).getFullYear(),
      client: cp.client || cp.credits || "Neotrix",
      primaryVideoUrl: cp.links[0] || "",
      allVideos: cp.links,
      deliveryFiles: [],
      fileLink: cp.fileLink,
      deliveryDate: cp.deliveryDate,
      createdAt: cp.createdAt,
    }));

  const filteredProjects = allProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => project.tags.includes(tag));

    const matchesYear = selectedYear === null || project.year === selectedYear;

    return matchesSearch && matchesTags && matchesYear;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSelectedYear(null);
    setSearchTerm("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Other Projects</h1>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          Explore our portfolio of creative campaigns, visual effects, and brand storytelling across different
          industries.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
          </div>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="bg-white/5 border-white/40 text-white hover:bg-white/10"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 space-y-4">
            {/* Tag Filters */}
            <div>
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {TAG_OPTIONS.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      selectedTags.includes(tag)
                        ? "bg-white text-black hover:bg-white/90"
                        : "border-white/20 text-white hover:bg-white/10"
                    }`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Year Filter */}
            <div>
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Year
              </h3>
              <div className="flex flex-wrap gap-2">
                {YEAR_OPTIONS.map((year) => (
                  <Badge
                    key={year}
                    variant={selectedYear === year ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      selectedYear === year
                        ? "bg-white text-black hover:bg-white/90"
                        : "border-white/20 text-white hover:bg-white/10"
                    }`}
                    onClick={() => setSelectedYear(selectedYear === year ? null : year)}
                  >
                    {year}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedTags.length > 0 || selectedYear !== null || searchTerm) && (
              <Button onClick={clearFilters} variant="ghost" className="text-white hover:bg-white/10">
                <X className="w-4 h-4 mr-2" />
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="text-white/70 text-sm">
        Showing {filteredProjects.length} of {allProjects.length} projects
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="group cursor-pointer bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            <div className="aspect-[4/3] md:aspect-video bg-gray-800 overflow-hidden">
              <img
                src={project.thumbnail || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400"}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400";
                }}
              />
            </div>
            <div className="p-2 md:p-4 space-y-1 md:space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                  {project.title}
                </h3>
                <span className="hidden md:block text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full whitespace-nowrap">
                  {project.year}
                </span>
              </div>
              <p className="hidden md:block text-sm text-white/70 line-clamp-2">
                {project.description.length > 100 ? (
                  <>
                    {project.description.slice(0, 100)}...
                    <span className="text-blue-300 hover:underline ml-1">see more</span>
                  </>
                ) : (
                  project.description
                )}
              </p>
              <div className="hidden md:flex items-center gap-2 text-xs text-white/60">
                <Users className="w-3 h-3" />
                <span className="line-clamp-1">{project.client}</span>
              </div>
              <div className="hidden md:flex flex-wrap gap-1">
                {project.tags.slice(0, 2).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs bg-white/10 text-white/80 hover:bg-white/20"
                  >
                    {tag}
                  </Badge>
                ))}
                {project.tags.length > 2 && (
                  <Badge variant="secondary" className="text-xs bg-white/10 text-white/80">
                    +{project.tags.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/60">No projects found matching your criteria.</p>
          <Button onClick={clearFilters} variant="ghost" className="mt-4 text-white hover:bg-white/10">
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};
