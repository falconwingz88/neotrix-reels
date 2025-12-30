import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects, CustomProject } from '@/contexts/ProjectsContext';
import { ArrowLeft, Plus, LogOut, X, Trash2, Edit2, Users, AlertCircle, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TAG_OPTIONS = ['Beauty', 'Liquid', 'VFX', 'Character Animation'];

// Helper function to extract YouTube video ID and generate thumbnail
const getYouTubeVideoId = (url: string): string => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
};

const getYouTubeThumbnail = (url: string): string => {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
};

// URL validation function
const isValidUrl = (string: string): boolean => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const AdminDashboard = () => {
  const { isAuthenticated, logout } = useAuth();
  const { customProjects, addProject, updateProject, deleteProject } = useProjects();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<CustomProject | null>(null);
  const [projectName, setProjectName] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [links, setLinks] = useState('');
  const [description, setDescription] = useState('');
  const [credits, setCredits] = useState('');

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/admin-login');
    return null;
  }

  // Parse links and validate
  const parsedLinks = links.split('\n').map(l => l.trim()).filter(l => l);
  const invalidLinks = parsedLinks.filter(link => !isValidUrl(link));
  const hasInvalidLinks = invalidLinks.length > 0 && parsedLinks.length > 0;
  const firstValidLink = parsedLinks.find(link => isValidUrl(link)) || '';
  
  // Generate preview thumbnail
  const previewThumbnail = useMemo(() => {
    return getYouTubeThumbnail(firstValidLink);
  }, [firstValidLink]);

  // Check if form is valid for submission
  const isFormValid = projectName.trim() && !hasInvalidLinks;

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const resetForm = () => {
    setProjectName('');
    setSelectedTags([]);
    setLinks('');
    setDescription('');
    setCredits('');
    setEditingProject(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectName.trim()) {
      toast({
        title: "Error",
        description: "Project name is required.",
        variant: "destructive",
      });
      return;
    }

    if (hasInvalidLinks) {
      toast({
        title: "Error",
        description: "Please fix invalid links before submitting.",
        variant: "destructive",
      });
      return;
    }

    const projectData = {
      title: projectName.trim(),
      description: description.trim(),
      tags: selectedTags,
      links: parsedLinks.filter(link => isValidUrl(link)),
      credits: credits.trim(),
    };

    if (editingProject) {
      updateProject(editingProject.id, projectData);
      toast({
        title: "Project updated!",
        description: `"${projectName}" has been updated.`,
      });
    } else {
      addProject(projectData);
      toast({
        title: "Project added!",
        description: `"${projectName}" has been added to the projects page.`,
      });
    }

    resetForm();
  };

  const handleEdit = (project: CustomProject) => {
    setEditingProject(project);
    setProjectName(project.title);
    setSelectedTags(project.tags);
    setLinks(project.links.join('\n'));
    setDescription(project.description);
    setCredits(project.credits);
    setShowForm(true);
  };

  const handleDelete = (id: string, title: string) => {
    deleteProject(id);
    toast({
      title: "Project deleted",
      description: `"${title}" has been removed.`,
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Get thumbnail for a project
  const getProjectThumbnail = (project: CustomProject) => {
    const firstLink = project.links[0];
    if (firstLink) {
      const ytThumb = getYouTubeThumbnail(firstLink);
      if (ytThumb) return ytThumb;
    }
    return 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-blue-900 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/10 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="text-white hover:bg-white/10 flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-white/60 mb-8">Manage your projects and content</p>

        {/* New Project Button */}
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="mb-8 bg-white/20 hover:bg-white/30 text-white border border-white/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        )}

        {/* New Project Form */}
        {showForm && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 md:p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={resetForm}
                className="text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Live Preview Card */}
            {(projectName || description || credits || selectedTags.length > 0 || previewThumbnail) && (
              <div className="mb-6">
                <Label className="text-white/80 text-sm mb-2 block">Preview</Label>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 max-w-sm">
                  <div className="aspect-video bg-gray-800 overflow-hidden">
                    <img
                      src={previewThumbnail || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400'}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400';
                      }}
                    />
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-white line-clamp-1">
                        {projectName || 'Project Name'}
                      </h3>
                      <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full whitespace-nowrap">
                        {new Date().getFullYear()}
                      </span>
                    </div>
                    <p className="text-sm text-white/70 line-clamp-2">
                      {description || 'Project description will appear here...'}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <Users className="w-3 h-3" />
                      <span className="line-clamp-1">{credits || 'Credits'}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selectedTags.length > 0 ? (
                        selectedTags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-white/10 text-white/80">
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="secondary" className="text-xs bg-white/10 text-white/50">
                          No tags selected
                        </Badge>
                      )}
                      {selectedTags.length > 2 && (
                        <Badge variant="secondary" className="text-xs bg-white/10 text-white/80">
                          +{selectedTags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="projectName" className="text-white">Project Name *</Label>
                <Input
                  id="projectName"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  placeholder="e.g. Brand Campaign 2024"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Tags</Label>
                <div className="flex flex-wrap gap-3">
                  {TAG_OPTIONS.map(tag => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${tag}`}
                        checked={selectedTags.includes(tag)}
                        onCheckedChange={() => toggleTag(tag)}
                        className="border-white/40 data-[state=checked]:bg-white data-[state=checked]:text-black"
                      />
                      <label
                        htmlFor={`tag-${tag}`}
                        className="text-sm text-white cursor-pointer"
                      >
                        {tag}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="links" className="text-white">Links</Label>
                <Textarea
                  id="links"
                  value={links}
                  onChange={(e) => setLinks(e.target.value)}
                  className={`bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[100px] ${
                    hasInvalidLinks ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter video/project links (one per line)&#10;e.g. https://youtu.be/abc123"
                />
                {hasInvalidLinks && (
                  <div className="flex items-start gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      Invalid URL(s): {invalidLinks.map(l => `"${l}"`).join(', ')}. 
                      Please enter valid URLs starting with http:// or https://
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[100px]"
                  placeholder="Brief description of the project..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="credits" className="text-white">Credits</Label>
                <Input
                  id="credits"
                  type="text"
                  value={credits}
                  onChange={(e) => setCredits(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  placeholder="e.g. Client: Brand Name, Studio: Partner Studio"
                />
              </div>

              <Button
                type="submit"
                disabled={!isFormValid}
                className={`w-full ${
                  isFormValid
                    ? 'bg-green-500/80 hover:bg-green-500 text-white'
                    : 'bg-gray-500/50 text-white/50 cursor-not-allowed'
                }`}
              >
                {isFormValid ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    {editingProject ? 'Update Project' : 'Confirm & Add Project'}
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {!projectName.trim() ? 'Project name required' : 'Fix invalid links'}
                  </>
                )}
              </Button>
            </form>
          </div>
        )}

        {/* Existing Custom Projects */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Custom Projects ({customProjects.length})</h2>
          
          {customProjects.length === 0 ? (
            <p className="text-white/60">No custom projects yet. Click "New Project" to add one.</p>
          ) : (
            <div className="grid gap-4">
              {customProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4 flex items-start gap-4"
                >
                  {/* Thumbnail */}
                  <div className="w-24 h-16 md:w-32 md:h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-800">
                    <img
                      src={getProjectThumbnail(project)}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400';
                      }}
                    />
                  </div>

                  {/* Project Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium mb-1 truncate">{project.title}</h3>
                    {project.description && (
                      <p className="text-white/60 text-sm mb-2 line-clamp-1">{project.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="bg-white/10 text-white/80">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    {project.credits && (
                      <p className="text-white/50 text-xs mt-2">{project.credits}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(project)}
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(project.id, project.title)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
