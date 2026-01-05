import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
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
import { ArrowLeft, Plus, LogOut, X, Trash2, Edit2, Users, AlertCircle, Check, Link2, FolderOpen, RefreshCw, CalendarIcon, FolderKanban, MessageSquare, MapPin, Clock, ExternalLink, GripVertical, List, LayoutGrid, Briefcase, Image, Search } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import UndoNotification, { UndoNotificationItem } from '@/components/UndoNotification';
import { ThumbnailUpload } from '@/components/ThumbnailUpload';
import { SortableProjectItem } from '@/components/SortableProjectItem';
import { ClientLogoSelector } from '@/components/ClientLogoSelector';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface JobOpening {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  responsibilities: string[];
  requirements: string[];
  traits: string[];
  sort_order: number | null;
  is_active: boolean;
}

interface ClientLogo {
  id: string;
  name: string;
  url: string;
  scale: string;
  sort_order: number;
  is_active: boolean;
}

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
  const { isAuthenticated, isAdmin, logout, loading: authLoading } = useAuth();
  const { customProjects, addProject, updateProject, deleteProject, reorderProjectsByIds, initializeDefaultProjects, loading: projectsLoading } = useProjects();
  const { contacts, deleteContact, clearAllContacts } = useContacts();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');
  const [isCompactView, setIsCompactView] = useState(true);

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
  
  // Job openings state
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobOpening | null>(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobSubtitle, setJobSubtitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobResponsibilities, setJobResponsibilities] = useState('');
  const [jobRequirements, setJobRequirements] = useState('');
  const [jobTraits, setJobTraits] = useState('');
  const [jobIsActive, setJobIsActive] = useState(true);
  
  // Client logos state
  const [clientLogos, setClientLogos] = useState<ClientLogo[]>([]);
  const [logosLoading, setLogosLoading] = useState(true);
  const [showLogoForm, setShowLogoForm] = useState(false);
  const [editingLogo, setEditingLogo] = useState<ClientLogo | null>(null);
  const [logoName, setLogoName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoScale, setLogoScale] = useState('normal');
  const [logoIsActive, setLogoIsActive] = useState(true);
  const [logoSearchTerm, setLogoSearchTerm] = useState('');
  
  // Undo notifications state
  const [undoNotifications, setUndoNotifications] = useState<UndoNotificationItem[]>([]);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );


  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate('/admin-login', { replace: true });
      } else if (!isAdmin) {
        navigate('/', { replace: true });
        toast({
          title: "Access denied",
          description: "You don't have admin privileges.",
          variant: "destructive",
        });
      }
    }
  }, [isAuthenticated, isAdmin, authLoading, navigate, toast]);

  // Handle edit query parameter from project detail page
  useEffect(() => {
    const editId = searchParams.get('edit');
    const tabParam = searchParams.get('tab');
    
    // Handle tab parameter from Join Us page
    if (tabParam === 'jobs') {
      setActiveTab('jobs');
      setSearchParams({}, { replace: true });
    }
    
    if (editId && customProjects.length > 0 && !projectsLoading) {
      const projectToEdit = customProjects.find(p => p.id === editId);
      if (projectToEdit) {
        setEditingProject(projectToEdit);
        setProjectName(projectToEdit.title);
        setSelectedTags(projectToEdit.tags);
        setSelectedYear(projectToEdit.year || new Date().getFullYear());
        setLinks(projectToEdit.links.join('\n'));
        setDescription(projectToEdit.description);
        setCredits(projectToEdit.credits);
        setClient(projectToEdit.client || '');
        setThumbnailUrl(projectToEdit.thumbnail || '');
        setFileLink(projectToEdit.fileLink || '');
        setProjectStartDate(projectToEdit.projectStartDate ? new Date(projectToEdit.projectStartDate) : undefined);
        setDeliveryDate(projectToEdit.deliveryDate ? new Date(projectToEdit.deliveryDate) : undefined);
        setShowForm(true);
        // Clear the search param after loading
        setSearchParams({}, { replace: true });
      }
    }
  }, [searchParams, customProjects, projectsLoading, setSearchParams]);

  // Fetch job openings
  const fetchJobOpenings = async () => {
    setJobsLoading(true);
    const { data, error } = await supabase
      .from('job_openings')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (!error && data) {
      setJobOpenings(data as JobOpening[]);
    }
    setJobsLoading(false);
  };

  // Fetch client logos
  const fetchClientLogos = async () => {
    setLogosLoading(true);
    const { data, error } = await supabase
      .from('client_logos')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (!error && data) {
      setClientLogos(data as ClientLogo[]);
    }
    setLogosLoading(false);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchJobOpenings();
      fetchClientLogos();
    }
  }, [isAdmin]);

  // Parse links and validate - must be before early return to maintain hook order
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

  if (authLoading || !isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

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

  // Handle drag end for reordering
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = filteredProjects.findIndex(p => p.id === active.id);
      const newIndex = filteredProjects.findIndex(p => p.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(filteredProjects, oldIndex, newIndex);
        const orderedIds = newOrder.map(p => p.id);
        
        try {
          await reorderProjectsByIds(orderedIds);
          toast({
            title: "Order updated",
            description: "Project order has been saved.",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to update project order.",
            variant: "destructive",
          });
        }
      }
    }
  };

  const handleResetProjects = async () => {
    if (window.confirm('This will reset all projects to the default list. Your custom changes will be lost. Continue?')) {
      await initializeDefaultProjects();
      toast({
        title: "Projects reset",
        description: "All projects have been reset to defaults.",
      });
    }
  };

  // Job form handlers
  const resetJobForm = () => {
    setJobTitle('');
    setJobSubtitle('');
    setJobDescription('');
    setJobResponsibilities('');
    setJobRequirements('');
    setJobTraits('');
    setJobIsActive(true);
    setEditingJob(null);
    setShowJobForm(false);
  };

  const handleEditJob = (job: JobOpening) => {
    setEditingJob(job);
    setJobTitle(job.title);
    setJobSubtitle(job.subtitle || '');
    setJobDescription(job.description || '');
    setJobResponsibilities(job.responsibilities.join('\n'));
    setJobRequirements(job.requirements.join('\n'));
    setJobTraits(job.traits.join('\n'));
    setJobIsActive(job.is_active);
    setShowJobForm(true);
  };

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobTitle.trim()) {
      toast({
        title: "Error",
        description: "Job title is required.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    const jobData = {
      title: jobTitle.trim(),
      subtitle: jobSubtitle.trim() || null,
      description: jobDescription.trim() || null,
      responsibilities: jobResponsibilities.split('\n').map(l => l.trim()).filter(l => l),
      requirements: jobRequirements.split('\n').map(l => l.trim()).filter(l => l),
      traits: jobTraits.split('\n').map(l => l.trim()).filter(l => l),
      is_active: jobIsActive,
    };

    try {
      if (editingJob) {
        const { error } = await supabase
          .from('job_openings')
          .update(jobData)
          .eq('id', editingJob.id);
        
        if (error) throw error;
        
        toast({
          title: "Job updated!",
          description: `"${jobTitle}" has been updated.`,
        });
      } else {
        const maxOrder = jobOpenings.reduce((max, j) => Math.max(max, j.sort_order || 0), 0);
        const { error } = await supabase
          .from('job_openings')
          .insert({ ...jobData, sort_order: maxOrder + 1 });
        
        if (error) throw error;
        
        toast({
          title: "Job added!",
          description: `"${jobTitle}" has been added.`,
        });
      }
      
      resetJobForm();
      fetchJobOpenings();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteJob = async (jobId: string, jobTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${jobTitle}"?`)) return;
    
    try {
      const { error } = await supabase
        .from('job_openings')
        .delete()
        .eq('id', jobId);
      
      if (error) throw error;
      
      toast({
        title: "Job deleted",
        description: `"${jobTitle}" has been removed.`,
      });
      
      fetchJobOpenings();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete job.",
        variant: "destructive",
      });
    }
  };

  const toggleJobActive = async (job: JobOpening) => {
    try {
      const { error } = await supabase
        .from('job_openings')
        .update({ is_active: !job.is_active })
        .eq('id', job.id);
      
      if (error) throw error;
      
      toast({
        title: job.is_active ? "Job hidden" : "Job published",
        description: `"${job.title}" is now ${job.is_active ? 'hidden from' : 'visible on'} the Join Us page.`,
      });
      
      fetchJobOpenings();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update job status.",
        variant: "destructive",
      });
    }
  };

  // Logo form handlers
  const resetLogoForm = () => {
    setLogoName('');
    setLogoUrl('');
    setLogoScale('normal');
    setLogoIsActive(true);
    setEditingLogo(null);
    setShowLogoForm(false);
  };

  const handleLogoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!logoName.trim() || !logoUrl.trim()) {
      toast({
        title: "Error",
        description: "Logo name and URL are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingLogo) {
        const { error } = await supabase
          .from('client_logos')
          .update({
            name: logoName.trim(),
            url: logoUrl.trim(),
            scale: logoScale,
            is_active: logoIsActive,
          })
          .eq('id', editingLogo.id);
        
        if (error) throw error;
        
        toast({
          title: "Logo updated",
          description: `"${logoName}" has been updated.`,
        });
      } else {
        const maxOrder = clientLogos.reduce((max, l) => Math.max(max, l.sort_order), 0);
        
        const { error } = await supabase
          .from('client_logos')
          .insert({
            name: logoName.trim(),
            url: logoUrl.trim(),
            scale: logoScale,
            is_active: logoIsActive,
            sort_order: maxOrder + 1,
          });
        
        if (error) throw error;
        
        toast({
          title: "Logo added",
          description: `"${logoName}" has been added to the client logos.`,
        });
      }
      
      resetLogoForm();
      fetchClientLogos();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save logo.",
        variant: "destructive",
      });
    }
  };

  const handleEditLogo = (logo: ClientLogo) => {
    setEditingLogo(logo);
    setLogoName(logo.name);
    setLogoUrl(logo.url);
    setLogoScale(logo.scale);
    setLogoIsActive(logo.is_active);
    setShowLogoForm(true);
  };

  const handleDeleteLogo = async (logoId: string, logoName: string) => {
    if (!window.confirm(`Delete "${logoName}"?`)) return;
    
    try {
      const { error } = await supabase
        .from('client_logos')
        .delete()
        .eq('id', logoId);
      
      if (error) throw error;
      
      toast({
        title: "Logo deleted",
        description: `"${logoName}" has been removed.`,
      });
      
      fetchClientLogos();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete logo.",
        variant: "destructive",
      });
    }
  };

  const toggleLogoActive = async (logo: ClientLogo) => {
    try {
      const { error } = await supabase
        .from('client_logos')
        .update({ is_active: !logo.is_active })
        .eq('id', logo.id);
      
      if (error) throw error;
      
      toast({
        title: logo.is_active ? "Logo hidden" : "Logo shown",
        description: `"${logo.name}" is now ${logo.is_active ? 'hidden from' : 'visible on'} the homepage.`,
      });
      
      fetchClientLogos();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update logo status.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-8 overflow-x-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-r from-blue-500/25 to-cyan-400/25 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/25 to-indigo-400/25 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-gradient-to-r from-cyan-400/15 to-blue-400/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>
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
            <TabsTrigger value="logos" className="data-[state=active]:bg-white/20 text-white flex-1 sm:flex-none text-xs sm:text-sm">
              <Image className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Client Logos</span> ({clientLogos.length})
            </TabsTrigger>
            <TabsTrigger value="jobs" className="data-[state=active]:bg-white/20 text-white flex-1 sm:flex-none text-xs sm:text-sm">
              <Briefcase className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Job Opening</span> ({jobOpenings.length})
            </TabsTrigger>
            <TabsTrigger value="contacts" className="data-[state=active]:bg-white/20 text-white flex-1 sm:flex-none text-xs sm:text-sm">
              <MessageSquare className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Interested Form</span> ({contacts.length})
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
                            "w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white min-w-[180px]",
                            !projectStartDate && "text-white/40"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{projectStartDate ? format(projectStartDate, "PPP") : "Pick start date"}</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-zinc-900 border-white/20" align="start">
                        <Calendar
                          mode="single"
                          selected={projectStartDate}
                          onSelect={setProjectStartDate}
                          initialFocus
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
                            "w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white min-w-[180px]",
                            !deliveryDate && "text-white/40"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{deliveryDate ? format(deliveryDate, "PPP") : "Pick delivery date"}</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-zinc-900 border-white/20" align="start">
                        <Calendar
                          mode="single"
                          selected={deliveryDate}
                          onSelect={setDeliveryDate}
                          initialFocus
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
                <Label htmlFor="client" className="text-white flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Client Logo
                </Label>
                <ClientLogoSelector
                  value={client}
                  onChange={setClient}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="credits" className="text-white">Credits</Label>
                <Textarea
                  id="credits"
                  value={credits}
                  onChange={(e) => setCredits(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[80px]"
                  placeholder="e.g. Milkyway Studio, Neotrix CGI Team&#10;Use Shift+Enter for new lines"
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
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                All Projects ({filteredProjects.length}{searchTerm ? ` of ${customProjects.length}` : ''})
              </h2>
              <div className="flex items-center gap-2">
                <List className="w-4 h-4 text-white/60" />
                <Switch
                  checked={!isCompactView}
                  onCheckedChange={(checked) => setIsCompactView(!checked)}
                  className="data-[state=checked]:bg-white/30"
                />
                <LayoutGrid className="w-4 h-4 text-white/60" />
              </div>
            </div>
            
            {filteredProjects.length === 0 ? (
              <p className="text-white/60">
                {searchTerm ? 'No projects found matching your search.' : 'No projects yet. Click "New Project" to add one.'}
              </p>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={filteredProjects.map(p => p.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="grid gap-3">
                    {filteredProjects.map((project) => (
                      <SortableProjectItem
                        key={project.id}
                        project={project}
                        thumbnail={getProjectThumbnail(project)}
                        onEdit={handleEdit}
                        onDelete={openDeleteDialog}
                        isCompact={isCompactView}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
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

          {/* Jobs Tab */}
          <TabsContent value="jobs">
            <div className="space-y-6">
              {/* Add/Edit Job Form */}
              {showJobForm ? (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">
                      {editingJob ? 'Edit Job Opening' : 'Add New Job Opening'}
                    </h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={resetJobForm}
                      className="text-white hover:bg-white/10"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <form onSubmit={handleJobSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle" className="text-white">Job Title *</Label>
                      <Input
                        id="jobTitle"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        placeholder="e.g. Project Manager (3D / Production)"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jobSubtitle" className="text-white">Subtitle</Label>
                      <Input
                        id="jobSubtitle"
                        value={jobSubtitle}
                        onChange={(e) => setJobSubtitle(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        placeholder="e.g. What This Role Really Is"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jobDescription" className="text-white">Description</Label>
                      <Textarea
                        id="jobDescription"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[100px]"
                        placeholder="Brief description of the role..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jobResponsibilities" className="text-white">What You'll Do (one per line)</Label>
                      <Textarea
                        id="jobResponsibilities"
                        value={jobResponsibilities}
                        onChange={(e) => setJobResponsibilities(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[120px]"
                        placeholder="Translate creative briefs into clear production plans&#10;Build realistic timelines&#10;Coordinate artists and teams"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jobRequirements" className="text-white">What You Must Understand (one per line)</Label>
                      <Textarea
                        id="jobRequirements"
                        value={jobRequirements}
                        onChange={(e) => setJobRequirements(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[120px]"
                        placeholder="3D production stages&#10;How revisions affect time and cost&#10;The difference between offline and real-time workflows"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jobTraits" className="text-white">Who You Are (one per line)</Label>
                      <Textarea
                        id="jobTraits"
                        value={jobTraits}
                        onChange={(e) => setJobTraits(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[120px]"
                        placeholder="You think in cause–effect, not panic mode&#10;You enjoy making messy systems clean&#10;You're calm under pressure"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        id="jobIsActive"
                        checked={jobIsActive}
                        onCheckedChange={setJobIsActive}
                      />
                      <Label htmlFor="jobIsActive" className="text-white">
                        Published (visible on Join Us page)
                      </Label>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        type="submit"
                        disabled={isSaving || !jobTitle.trim()}
                        className="bg-white/20 hover:bg-white/30 text-white border border-white/20"
                      >
                        {isSaving ? 'Saving...' : editingJob ? 'Update Job' : 'Add Job'}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={resetJobForm}
                        className="text-white hover:bg-white/10"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              ) : (
                <Button
                  onClick={() => setShowJobForm(true)}
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/20"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Job Opening
                </Button>
              )}

              {/* Job Listings */}
              {jobsLoading ? (
                <div className="text-white/60 text-center py-8">Loading jobs...</div>
              ) : jobOpenings.length === 0 ? (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 text-center">
                  <Briefcase className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">No job openings yet.</p>
                  <p className="text-white/40 text-sm">Add your first job opening above.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {jobOpenings.map((job) => (
                    <div
                      key={job.id}
                      className={cn(
                        "bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4",
                        !job.is_active && "opacity-60"
                      )}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-white/60 flex-shrink-0" />
                            <h3 className="text-white font-medium truncate">{job.title}</h3>
                            {!job.is_active && (
                              <Badge variant="secondary" className="bg-white/10 text-white/60 text-xs">
                                Hidden
                              </Badge>
                            )}
                          </div>
                          {job.subtitle && (
                            <p className="text-white/50 text-sm mt-1 truncate">{job.subtitle}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                            <span>{job.responsibilities.length} responsibilities</span>
                            <span>{job.requirements.length} requirements</span>
                            <span>{job.traits.length} traits</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleJobActive(job)}
                            className={cn(
                              "text-white hover:bg-white/10",
                              job.is_active ? "text-green-400" : "text-white/40"
                            )}
                          >
                            {job.is_active ? 'Published' : 'Hidden'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditJob(job)}
                            className="text-white hover:bg-white/10"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteJob(job.id, job.title)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Logos Tab */}
          <TabsContent value="logos">
            <div className="space-y-6">
              {/* Add/Edit Logo Form */}
              {showLogoForm ? (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">
                      {editingLogo ? 'Edit Logo' : 'Add New Logo'}
                    </h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={resetLogoForm}
                      className="text-white hover:bg-white/10"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <form onSubmit={handleLogoSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="logoName" className="text-white">Brand Name *</Label>
                      <Input
                        id="logoName"
                        value={logoName}
                        onChange={(e) => setLogoName(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        placeholder="e.g. BCA, Oppo, Telkomsel"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="logoUrl" className="text-white">Logo URL *</Label>
                      <Input
                        id="logoUrl"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        placeholder="/client-logos/brand_white.png or https://..."
                        required
                      />
                      <p className="text-white/50 text-xs">Use /client-logos/ for local files or full URL for external images</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Logo Scale</Label>
                      <div className="flex flex-wrap gap-2">
                        {['small', 'normal', '2x', '3x'].map((scale) => (
                          <Badge
                            key={scale}
                            variant={logoScale === scale ? "default" : "outline"}
                            className={`cursor-pointer transition-colors ${
                              logoScale === scale
                                ? 'bg-white text-black hover:bg-white/90'
                                : 'border-white/20 text-white hover:bg-white/10'
                            }`}
                            onClick={() => setLogoScale(scale)}
                          >
                            {scale === 'small' ? '0.75x' : scale === 'normal' ? '1x' : scale}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-white/50 text-xs">Adjust if logo appears too small or too large</p>
                    </div>

                    {logoUrl && (
                      <div className="space-y-2">
                        <Label className="text-white">Preview</Label>
                        <div className="bg-white/10 rounded-lg p-4 flex items-center justify-center h-20">
                          <img
                            src={logoUrl}
                            alt="Preview"
                            className={`max-h-full object-contain filter brightness-0 invert ${
                              logoScale === '3x' ? 'scale-[3]' : 
                              logoScale === '2x' ? 'scale-[2]' : 
                              logoScale === 'small' ? 'scale-75' : ''
                            }`}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Switch
                        id="logoIsActive"
                        checked={logoIsActive}
                        onCheckedChange={setLogoIsActive}
                      />
                      <Label htmlFor="logoIsActive" className="text-white cursor-pointer">
                        Show on homepage
                      </Label>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        className="bg-white/20 hover:bg-white/30 text-white border border-white/20"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        {editingLogo ? 'Update Logo' : 'Add Logo'}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={resetLogoForm}
                        className="text-white hover:bg-white/10"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => setShowLogoForm(true)}
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/20"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Logo
                  </Button>
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <Input
                      value={logoSearchTerm}
                      onChange={(e) => setLogoSearchTerm(e.target.value)}
                      placeholder="Search logos..."
                      className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>
                </div>
              )}

              {/* Logos List */}
              {logosLoading ? (
                <div className="text-center text-white/50 py-8">Loading logos...</div>
              ) : clientLogos.length === 0 ? (
                <div className="text-center text-white/50 py-8">No client logos yet</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {clientLogos
                    .filter((logo) => logo.name.toLowerCase().includes(logoSearchTerm.toLowerCase()))
                    .map((logo) => (
                    <div
                      key={logo.id}
                      className={cn(
                        "bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4 relative group",
                        !logo.is_active && "opacity-50"
                      )}
                    >
                      <div className="aspect-square flex items-center justify-center mb-3">
                        <img
                          src={logo.url}
                          alt={logo.name}
                          className={`max-w-full max-h-full object-contain filter brightness-0 invert ${
                            logo.scale === '3x' ? 'scale-[2]' : 
                            logo.scale === '2x' ? 'scale-150' : 
                            logo.scale === 'small' ? 'scale-75' : ''
                          }`}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                      <p className="text-white text-xs text-center truncate font-medium">{logo.name}</p>
                      <p className="text-white/40 text-[10px] text-center">{logo.scale}</p>
                      
                      {/* Actions overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleLogoActive(logo)}
                          className={cn(
                            "text-white hover:bg-white/10",
                            logo.is_active ? "text-green-400" : "text-white/40"
                          )}
                        >
                          {logo.is_active ? 'Hide' : 'Show'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditLogo(logo)}
                          className="text-white hover:bg-white/10"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteLogo(logo.id, logo.name)}
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
