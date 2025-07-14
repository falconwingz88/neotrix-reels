import { useState } from 'react';
import { Search, Filter, X, Users, Calendar, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ProjectDetailModal } from './ProjectDetailModal';

export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  tags: string[];
  dateCreated: string;
  teamMembers: string[];
  backstory: string;
  behindTheScenes: string[];
}

const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Liquid Motion Graphics',
    description: 'A stunning collection of fluid animations showcasing liquid dynamics and particle systems.',
    thumbnail: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
    tags: ['Liquid', 'Commercial'],
    dateCreated: '2024-01-15',
    teamMembers: ['Alex Chen', 'Sarah Kim', 'Mike Rodriguez'],
    backstory: 'This project was born from our fascination with fluid dynamics and the challenge of creating realistic liquid simulations that could be used in commercial applications.',
    behindTheScenes: [
      'We spent 3 weeks perfecting the particle system algorithms',
      'The team experimented with over 50 different shader combinations',
      'Initial renders took 12 hours per frame before optimization'
    ]
  },
  {
    id: '2',
    title: 'Character Walk Cycle',
    description: 'Dynamic character animation featuring realistic movement and personality-driven motion.',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop',
    tags: ['Character Animation', '3D Character'],
    dateCreated: '2024-02-08',
    teamMembers: ['Emma Wilson', 'David Park', 'Lisa Zhang'],
    backstory: 'Inspired by classic Disney animation principles, we wanted to create a character that felt alive and had genuine personality in every step.',
    behindTheScenes: [
      'Motion capture sessions with professional actors',
      'Hand-animated secondary animations for clothing and hair',
      'Over 200 iterations of the walk cycle timing'
    ]
  },
  {
    id: '3',
    title: 'Product Launch Campaign',
    description: 'Commercial animation series for a major tech product launch, featuring sleek 3D visuals.',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    tags: ['Commercial', '3D Character'],
    dateCreated: '2024-01-30',
    teamMembers: ['John Smith', 'Maria Garcia', 'Tom Anderson', 'Jessica Lee'],
    backstory: 'A high-profile commercial project that required perfect timing and flawless execution to meet the client\'s ambitious vision.',
    behindTheScenes: [
      'Pre-visualization phase took 2 weeks of storyboarding',
      'Client requested 47 revisions before final approval',
      'Final render farm used 120 GPUs for 72 hours straight'
    ]
  },
  {
    id: '4',
    title: 'Fantasy Adventure Series',
    description: 'Epic fantasy series featuring magical creatures and breathtaking environments.',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
    tags: ['Series', 'Character Animation', '3D Character'],
    dateCreated: '2023-11-20',
    teamMembers: ['Rachel Thompson', 'Kevin Wu', 'Sophie Martinez', 'Daniel Kim', 'Anna Rodriguez'],
    backstory: 'Our biggest project to date - a 12-episode series that pushed our creative and technical limits to tell an unforgettable story.',
    behindTheScenes: [
      'Created over 50 unique character designs',
      'Built 25 distinct environments from scratch',
      'Recorded original music score with 40-piece orchestra'
    ]
  },
  {
    id: '5',
    title: 'Liquid Abstract Art',
    description: 'Experimental liquid simulations creating mesmerizing abstract visual patterns.',
    thumbnail: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&h=600&fit=crop',
    tags: ['Liquid'],
    dateCreated: '2024-03-05',
    teamMembers: ['Oliver Chang', 'Zoe Adams'],
    backstory: 'An artistic exploration into the beauty of fluid dynamics, where mathematics meets pure visual poetry.',
    behindTheScenes: [
      'Used machine learning to generate unique flow patterns',
      'Experimented with non-Newtonian fluid properties',
      'Created custom color palette generator based on music'
    ]
  },
  {
    id: '6',
    title: 'Corporate Explainer Series',
    description: 'Professional animated explainer videos for corporate training and marketing.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    tags: ['Commercial', 'Series'],
    dateCreated: '2024-02-18',
    teamMembers: ['Grace Liu', 'Marcus Johnson', 'Nina Patel'],
    backstory: 'A series of educational animations that make complex business concepts accessible and engaging for all audiences.',
    behindTheScenes: [
      'Collaborated with educational psychologists for optimal learning',
      'Created modular animation system for easy updates',
      'Translated into 8 different languages'
    ]
  }
];

const AVAILABLE_TAGS = ['Liquid', 'Character Animation', 'Commercial', '3D Character', 'Series'];

export const ProjectsBrowser = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = PROJECTS.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => project.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSearchTerm('');
  };

  return (
    <>
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Our Projects</h2>
          <p className="text-white/70">Explore our creative portfolio and behind-the-scenes stories</p>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
            />
          </div>

          {/* Filter Tags */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 text-white/70">
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filter by tags:</span>
            </div>
            {AVAILABLE_TAGS.map(tag => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedTags.includes(tag)
                    ? 'bg-white text-purple-900 hover:bg-white/90'
                    : 'border-white/30 text-white hover:bg-white/10'
                }`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
            {(selectedTags.length > 0 || searchTerm) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Projects Grid - Simplified to show only large thumbnails with titles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="group cursor-pointer bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500 hover:transform hover:scale-105 animate-fade-in"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both'
              }}
              onClick={() => setSelectedProject(project)}
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                
                {/* Only show title over the image */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">
                    {project.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Layers className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
            <p className="text-white/60">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
};
