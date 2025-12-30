import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/contexts/ProjectsContext';
import { ArrowLeft, Plus, LogOut, X, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { isAuthenticated, logout } = useAuth();
  const { customProjects, addProject, deleteProject } = useProjects();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [tags, setTags] = useState('');
  const [links, setLinks] = useState('');
  const [description, setDescription] = useState('');
  const [credits, setCredits] = useState('');

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/admin-login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
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

    addProject({
      title: projectName.trim(),
      description: description.trim(),
      tags: tags.split(',').map(t => t.trim()).filter(t => t),
      links: links.split('\n').map(l => l.trim()).filter(l => l),
      credits: credits.trim(),
    });

    toast({
      title: "Project added!",
      description: `"${projectName}" has been added to the projects page.`,
    });

    // Reset form
    setProjectName('');
    setTags('');
    setLinks('');
    setDescription('');
    setCredits('');
    setShowForm(false);
  };

  const handleDelete = (id: string, title: string) => {
    deleteProject(id);
    toast({
      title: "Project deleted",
      description: `"${title}" has been removed.`,
    });
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
              <h2 className="text-xl font-semibold text-white">Add New Project</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowForm(false)}
                className="text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

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
                <Label htmlFor="tags" className="text-white">Tags</Label>
                <Input
                  id="tags"
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  placeholder="e.g. VFX, Beauty, Liquid (comma-separated)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="links" className="text-white">Links</Label>
                <Textarea
                  id="links"
                  value={links}
                  onChange={(e) => setLinks(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[100px]"
                  placeholder="Enter video/project links (one per line)"
                />
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
                className="w-full bg-green-500/80 hover:bg-green-500 text-white"
              >
                Confirm & Add Project
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
                  className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4 flex items-start justify-between gap-4"
                >
                  <div className="flex-1">
                    <h3 className="text-white font-medium mb-1">{project.title}</h3>
                    {project.description && (
                      <p className="text-white/60 text-sm mb-2">{project.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="bg-white/10 text-white/80">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(project.id, project.title)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
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
