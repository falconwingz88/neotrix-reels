import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects, CustomProject } from '@/contexts/ProjectsContext';
import { useContacts } from '@/contexts/ContactsContext';
import { ArrowLeft, Plus, LogOut, X, Trash2, Edit2, Users, AlertCircle, Check, Link2, FolderOpen, RefreshCw, CalendarIcon, FolderKanban, MessageSquare, MapPin, Clock, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import UndoNotification, { UndoNotificationItem } from '@/components/UndoNotification';
import { ThumbnailUpload } from '@/components/ThumbnailUpload';
import { cn } from '@/lib/utils';

const TAG_OPTIONS = ['Beauty', 'Liquid', 'VFX', 'Character Animation', 'Non-Character Animation', 'FX', 'AI'];
const YEAR_OPTIONS = [2030, 2029, 2028, 2027, 2026, 2025, 2024, 2023, 2022, 2021, 2020];

// Helper function to extract YouTube video ID and generate thumbnail
const getYouTubeVideoId = (url: string): string => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
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
  const { isAuthenticated, logout, loading: authLoading } = useAuth();
  const { customProjects, addProject, updateProject, deleteProject, initializeDefaultProjects, loading: projectsLoading } = useProjects();
  const { contacts, deleteContact, clearAllContacts } = useContacts();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<CustomProject | null>(null);
  const [projectName, setProjectName] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [links, setLinks] = useState('');
  const [description, setDescription] = useState('');
  const [credits, setCredits] = useState('');
  const [client, setClient] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [fileLink, setFileLink] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [projectStartDate, setProjectStartDate] = useState<Date | undefined>(undefined);
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(undefined);
  
  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; title: string } | null>(null);
  
  // Undo notifications state
  const [undoNotifications, setUndoNotifications] = useState<UndoNotificationItem[]>([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin-login', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-blue-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Parse links and validate
  const parsedLinks = links.split('\n').map(l => l.trim()).filter(l => l);
  const invalidLinks = parsedLinks.filter(link => !isValidUrl(link));
  const hasInvalidLinks = invalidLinks.length > 0 && parsedLinks.length > 0;
  const firstValidLink = parsedLinks.find(link => isValidUrl(link)) || '';
  
  // Validate file link
  const fileLinkTrimmed = fileLink.trim();
  const hasInvalidFileLink = fileLinkTrimmed && !isValidUrl(fileLinkTrimmed);
  
  // Validate thumbnail URL
  const thumbnailTrimmed = thumbnailUrl.trim();
  const hasInvalidThumbnail = thumbnailTrimmed && !isValidUrl(thumbnailTrimmed);
  
  // Generate preview thumbnail (priority: custom thumbnail > youtube thumbnail > placeholder)
  const previewThumbnail = useMemo(() => {
    if (thumbnailTrimmed && isValidUrl(thumbnailTrimmed)) {
      return thumbnailTrimmed;
    }
    return getYouTubeThumbnail(firstValidLink);
  }, [thumbnailTrimmed, firstValidLink]);

  // Check if form is valid for submission
  const isFormValid = projectName.trim() && !hasInvalidLinks && !hasInvalidFileLink && !hasInvalidThumbnail;

  const handleLogout = async () => {
    await logout();
    navigate('/');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const resetForm = () => {
    setProjectName('');
    setSelectedTags([]);
    setSelectedYear(new Date().getFullYear());
    setLinks('');
    setDescription('');
    setCredits('');
    setClient('');
    setThumbnailUrl('');
    setFileLink('');
    setProjectStartDate(undefined);
    setDeliveryDate(undefined);
    setEditingProject(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsSaving(true);

    const projectData = {
      title: projectName.trim(),
      description: description.trim(),
      tags: selectedTags,
      links: parsedLinks.filter(link => isValidUrl(link)),
      credits: credits.trim(),
      thumbnail: thumbnailTrimmed || undefined,
      fileLink: fileLinkTrimmed || undefined,
      year: selectedYear,
      client: client.trim() || 'Neotrix',
      projectStartDate: projectStartDate?.toISOString(),
      deliveryDate: deliveryDate?.toISOString(),
    };

    try {
      if (editingProject) {
        await updateProject(editingProject.id, projectData);
        toast({
          title: "Project updated!",
          description: `"${projectName}" has been updated.`,
        });
      } else {
        await addProject(projectData);
        toast({
          title: "Project added!",
          description: `"${projectName}" has been added to the projects page.`,
        });
      }
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (project: CustomProject) => {
    setEditingProject(project);
    setProjectName(project.title);
    setSelectedTags(project.tags);
    setSelectedYear(project.year || new Date().getFullYear());
    setLinks(project.links.join('\n'));
    setDescription(project.description);
    setCredits(project.credits);
    setClient(project.client || '');
    setThumbnailUrl(project.thumbnail || '');
    setFileLink(project.fileLink || '');
    setProjectStartDate(project.projectStartDate ? new Date(project.projectStartDate) : undefined);
    setDeliveryDate(project.deliveryDate ? new Date(project.deliveryDate) : undefined);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openDeleteDialog = (id: string, title: string) => {
    setProjectToDelete({ id, title });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    
    // Store the project data for undo
    const deletedProject = customProjects.find(p => p.id === projectToDelete.id);
    
    if (deletedProject) {
      try {
        await deleteProject(projectToDelete.id);
        
        // Add undo notification
        const notificationId = Date.now().toString();
        setUndoNotifications(prev => [...prev, {
          id: notificationId,
          message: `"${projectToDelete.title}" deleted`,
          createdAt: Date.now(),
          onUndo: async () => {
            // Restore the project
            await addProject({
              title: deletedProject.title,
              description: deletedProject.description,
              tags: deletedProject.tags,
              links: deletedProject.links,
              credits: deletedProject.credits,
              thumbnail: deletedProject.thumbnail,
              fileLink: deletedProject.fileLink,
              year: deletedProject.year,
              client: deletedProject.client,
            });
            toast({
              title: "Project restored",
              description: `"${deletedProject.title}" has been restored.`,
            });
          },
        }]);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete project.",
          variant: "destructive",
        });
      }
    }
    
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  const dismissUndoNotification = useCallback((id: string) => {
    setUndoNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Get thumbnail for a project
  const getProjectThumbnail = (project: CustomProject) => {
    if (project.thumbnail) return project.thumbnail;
    const firstLink = project.links[0];
    if (firstLink) {
      const ytThumb = getYouTubeThumbnail(firstLink);
      if (ytThumb) return ytThumb;
    }
    return 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400';
  };

  // Filter projects
  const filteredProjects = customProjects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.credits.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleResetProjects = async () => {
    if (window.confirm('This will reset all projects to the default list. Your custom changes will be lost. Continue?')) {
      await initializeDefaultProjects();
      toast({
        title: "Projects reset",
        description: "All projects have been reset to defaults.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-blue-900 p-4 md:p-8 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/10 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-white hover:bg-white/10 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-white/60 text-sm md:text-base mb-6 md:mb-8">Manage your projects and contacts</p>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white/10 border border-white/20 mb-6 w-full sm:w-auto flex">
            <TabsTrigger value="projects" className="data-[state=active]:bg-white/20 text-white flex-1 sm:flex-none text-xs sm:text-sm">
              <FolderKanban className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Projects</span> ({customProjects.length})
            </TabsTrigger>
            <TabsTrigger value="contacts" className="data-[state=active]:bg-white/20 text-white flex-1 sm:flex-none text-xs sm:text-sm">
              <MessageSquare className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Clients</span> ({contacts.length})
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects">
            {/* Search and New Project */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 flex-1"
              />
              {!showForm && (
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/20"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              )}
            </div>

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
                        {selectedYear}
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
                    {fileLinkTrimmed && (
                      <div className="flex items-center gap-2 text-xs text-green-400">
                        <FolderOpen className="w-3 h-3" />
                        <span>Has file link (admin only)</span>
                      </div>
                    )}
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
                <Label className="text-white">Year</Label>
                <div className="flex flex-wrap gap-2">
                  {YEAR_OPTIONS.map(year => (
                    <Badge
                      key={year}
                      variant={selectedYear === year ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        selectedYear === year
                          ? 'bg-white text-black hover:bg-white/90'
                          : 'border-white/20 text-white hover:bg-white/10'
                      }`}
                      onClick={() => setSelectedYear(year)}
                    >
                      {year}
                    </Badge>
                  ))}
                </div>
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

              <ThumbnailUpload
                value={thumbnailUrl}
                onChange={setThumbnailUrl}
                hasError={hasInvalidThumbnail}
              />

              <div className="space-y-2">
                <Label htmlFor="links" className="text-white flex items-center gap-2">
                  <Link2 className="w-4 h-4" />
                  Video/Project Links
                </Label>
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
                <Label htmlFor="fileLink" className="text-white flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" />
                  File Link (Admin Only)
                </Label>
                <Input
                  id="fileLink"
                  type="text"
                  value={fileLink}
                  onChange={(e) => setFileLink(e.target.value)}
                  className={`bg-white/10 border-white/20 text-white placeholder:text-white/40 ${
                    hasInvalidFileLink ? 'border-red-500' : ''
                  }`}
                  placeholder="https://drive.google.com/... (high-res files for admins)"
                />
                {hasInvalidFileLink && (
                  <div className="flex items-start gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Please enter a valid URL</span>
                  </div>
                )}
                <p className="text-white/50 text-xs">Google Drive link for high-resolution files. Only visible to logged-in admins.</p>
              </div>

              {/* Project Duration */}
              <div className="space-y-2">
                <Label className="text-white flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Project Duration
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Start Date */}
                  <div className="space-y-1">
                    <Label className="text-white/70 text-sm">Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white",
                            !projectStartDate && "text-white/40"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {projectStartDate ? format(projectStartDate, "PPP") : <span>Pick start date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-zinc-900 border-white/20" align="start">
                        <Calendar
                          mode="single"
                          selected={projectStartDate}
                          onSelect={setProjectStartDate}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Delivery Date */}
                  <div className="space-y-1">
                    <Label className="text-white/70 text-sm">Delivery Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white",
                            !deliveryDate && "text-white/40"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {deliveryDate ? format(deliveryDate, "PPP") : <span>Pick delivery date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-zinc-900 border-white/20" align="start">
                        <Calendar
                          mode="single"
                          selected={deliveryDate}
                          onSelect={setDeliveryDate}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <p className="text-white/50 text-xs">Optional: Track when the project started and was delivered.</p>
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
                <Label htmlFor="client" className="text-white">Client</Label>
                <Input
                  id="client"
                  type="text"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  placeholder="e.g. OPPO, Telkomsel, BNI"
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
                  placeholder="e.g. Milkyway Studio, Neotrix CGI Team"
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
                    {!projectName.trim() ? 'Project name required' : 'Fix invalid URLs'}
                  </>
                )}
              </Button>
            </form>
          </div>
        )}

        {/* Projects List - Hidden when form is open */}
        {!showForm && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">
              All Projects ({filteredProjects.length}{searchTerm ? ` of ${customProjects.length}` : ''})
            </h2>
            
            {filteredProjects.length === 0 ? (
              <p className="text-white/60">
                {searchTerm ? 'No projects found matching your search.' : 'No projects yet. Click "New Project" to add one.'}
              </p>
            ) : (
              <div className="grid gap-4">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-3 md:p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 md:gap-4">
                      {/* Thumbnail */}
                      <div className="w-full sm:w-24 md:w-32 h-24 sm:h-16 md:h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-800">
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
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="text-white font-medium truncate">{project.title}</h3>
                              <span className="text-xs text-white/40">({project.year || 'N/A'})</span>
                              {project.fileLink && (
                                <Badge variant="secondary" className="bg-green-500/20 text-green-300 text-xs">
                                  <FolderOpen className="w-3 h-3 mr-1" />
                                  Files
                                </Badge>
                              )}
                            </div>
                            {project.description && (
                              <p className="text-white/60 text-sm mb-2 line-clamp-2 sm:line-clamp-1">{project.description}</p>
                            )}
                            <div className="flex flex-wrap gap-1 md:gap-2">
                              {project.tags.slice(0, 3).map((tag, i) => (
                                <Badge key={i} variant="secondary" className="bg-white/10 text-white/80 text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {project.tags.length > 3 && (
                                <Badge variant="secondary" className="bg-white/10 text-white/80 text-xs">
                                  +{project.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                            {project.client && (
                              <p className="text-white/50 text-xs mt-2">Client: {project.client}</p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-1 md:gap-2 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(project)}
                              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 w-8 h-8"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(project.id, project.title)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/20 w-8 h-8"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  Contacted Clients ({contacts.length})
                </h2>
                {contacts.length > 0 && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to clear all contact submissions?')) {
                        clearAllContacts();
                        toast({
                          title: "Contacts cleared",
                          description: "All contact submissions have been removed.",
                        });
                      }
                    }}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </div>
              
              {contacts.length === 0 ? (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">No contact submissions yet.</p>
                  <p className="text-white/40 text-sm">Clients who fill out the contact form will appear here.</p>
                </div>
              ) : (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/10 hover:bg-transparent">
                          <TableHead className="text-white/80">Name</TableHead>
                          <TableHead className="text-white/80">Role</TableHead>
                          <TableHead className="text-white/80">Project Status</TableHead>
                          <TableHead className="text-white/80">Video Details</TableHead>
                          <TableHead className="text-white/80">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              Location
                            </div>
                          </TableHead>
                          <TableHead className="text-white/80">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Submitted
                            </div>
                          </TableHead>
                          <TableHead className="text-white/80 text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contacts.map((contact) => {
                          const projectStatusLabel = 
                            contact.projectStatus === 'have_project' ? 'Has project' :
                            contact.projectStatus === 'not_sure' ? 'Not sure' :
                            contact.projectStatus === 'discuss' ? 'Wants to discuss' : contact.projectStatus;
                          
                          return (
                            <TableRow 
                              key={contact.id} 
                              className="border-white/10 cursor-pointer hover:bg-white/5 transition-colors"
                              onClick={() => navigate(`/client/${contact.id}`)}
                            >
                              <TableCell className="text-white font-medium">
                                <div className="flex items-center gap-2">
                                  {contact.name}
                                  <ExternalLink className="w-3 h-3 text-white/40" />
                                </div>
                                <div className="text-xs font-mono text-white/40">
                                  LEAD-{contact.id.slice(-6).toUpperCase()}
                                </div>
                              </TableCell>
                              <TableCell className="text-white/70">{contact.role}</TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <Badge variant="secondary" className="bg-white/10 text-white/80 text-xs">
                                    {projectStatusLabel}
                                  </Badge>
                                  {contact.hasDeck && (
                                    <div className="text-xs text-green-400">Has deck/storyboard</div>
                                  )}
                                  {contact.deckLink && (
                                    <a 
                                      href={contact.deckLink} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-xs text-blue-400 hover:underline block truncate max-w-[120px]"
                                    >
                                      {contact.deckLink}
                                    </a>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-white/70 text-sm space-y-1">
                                  <div>{contact.videoVersions} version(s)</div>
                                  <div>{contact.videoDuration}</div>
                                  {contact.deliveryDate && (
                                    <div className="text-xs text-white/50">
                                      Delivery: {format(new Date(contact.deliveryDate), 'PP')}
                                    </div>
                                  )}
                                  {contact.startDate && (
                                    <div className="text-xs text-white/50">
                                      Start: {format(new Date(contact.startDate), 'PP')}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-white/70">{contact.location}</TableCell>
                              <TableCell className="text-white/70">
                                <div className="text-sm">
                                  {format(new Date(contact.submittedAt), 'PP')}
                                </div>
                                <div className="text-xs text-white/50">
                                  {format(new Date(contact.submittedAt), 'p')}
                                </div>
                              </TableCell>
                              <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    deleteContact(contact.id);
                                    toast({
                                      title: "Contact removed",
                                      description: `${contact.name}'s submission has been removed.`,
                                    });
                                  }}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-zinc-900 border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Project?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              Are you sure you want to delete "{projectToDelete?.title}"? You can undo this action within 10 seconds.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Undo Notifications */}
      <UndoNotification 
        notifications={undoNotifications} 
        onDismiss={dismissUndoNotification} 
      />
    </div>
  );
};

export default AdminDashboard;
