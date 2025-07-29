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
  year: number;
  client: string;
  brand: string;
  mainVideoUrl?: string;
  additionalVideos?: string[];
  videoThumbnail?: string;
}

// Helper function to extract YouTube video ID from URL
const getYouTubeVideoId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// Helper function to get YouTube thumbnail
const getYouTubeThumbnail = (url: string): string => {
  const videoId = getYouTubeVideoId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  return 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop';
};

// Helper function to extract brand name from project title
const getBrandName = (title: string): string => {
  return title.split(' ').slice(0, 2).join(' ');
};

// Helper function to parse multiple URLs
const parseUrls = (urlString: string): string[] => {
  if (!urlString) return [];
  return urlString.split(',').map(url => url.trim()).filter(url => url.length > 0);
};

const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Wardah UV Shield',
    description: 'Sunscreen commercial showcasing UV protection technology with cutting-edge 3D animation for Liquid Production.',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    tags: ['Wardah', '2025', 'Commercial'],
    year: 2025,
    client: 'Liquid Production',
    brand: 'Wardah',
    mainVideoUrl: '',
    additionalVideos: [],
    videoThumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
  },
  {
    id: '2',
    title: 'Caplang',
    description: 'Creative commercial project delivered for Lieve and Masterpiece, showcasing innovative storytelling.',
    thumbnail: 'https://img.youtube.com/vi/os941LA67aE/maxresdefault.jpg',
    tags: ['Caplang', '2025', 'Commercial'],
    year: 2025,
    client: 'Lieve, Masterpiece',
    brand: 'Caplang',
    mainVideoUrl: 'https://youtu.be/os941LA67aE',
    additionalVideos: ['https://youtu.be/GTk5W7jzSc0'],
    videoThumbnail: 'https://img.youtube.com/vi/os941LA67aE/maxresdefault.jpg'
  },
  {
    id: '3',
    title: 'Yamalube',
    description: 'Motorcycle oil commercial featuring dynamic 3D product visualization for Faris Aprillio.',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    tags: ['Yamalube', '2025', 'Commercial'],
    year: 2025,
    client: 'Faris Aprillio',
    brand: 'Yamalube',
    mainVideoUrl: '',
    additionalVideos: [],
    videoThumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
  },
  {
    id: '4',
    title: 'Wuling',
    description: 'Automotive commercial showcasing vehicle features through sophisticated 3D animation for Above Space.',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    tags: ['Wuling', '2025', 'Automotive'],
    year: 2025,
    client: 'Above Space',
    brand: 'Wuling',
    mainVideoUrl: '',
    additionalVideos: [],
    videoThumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
  },
  {
    id: '5',
    title: 'Ultima II X Mikha Tambayong',
    description: 'Beauty campaign featuring celebrity endorsement with premium visual effects for Lieve.',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    tags: ['Ultima', '2025', 'Beauty'],
    year: 2025,
    client: 'Lieve',
    brand: 'Ultima II',
    mainVideoUrl: '',
    additionalVideos: [],
    videoThumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
  },
  {
    id: '6',
    title: 'Bibit X Deddy Corbuzier',
    description: 'Investment app commercial featuring celebrity collaboration for Adi Victory.',
    thumbnail: 'https://img.youtube.com/vi/mFd3rPt-R-U/maxresdefault.jpg',
    tags: ['Bibit', '2024', 'Fintech'],
    year: 2024,
    client: 'Adi Victory',
    brand: 'Bibit',
    mainVideoUrl: 'https://youtube.com/shorts/mFd3rPt-R-U?feature=share',
    additionalVideos: [],
    videoThumbnail: 'https://img.youtube.com/vi/mFd3rPt-R-U/maxresdefault.jpg'
  },
  {
    id: '7',
    title: 'Infestation Spirit',
    description: 'Gaming commercial featuring dynamic action sequences for Milkyway Studio.',
    thumbnail: 'https://img.youtube.com/vi/P-gxYwF0r0w/maxresdefault.jpg',
    tags: ['Gaming', '2024', 'Action'],
    year: 2024,
    client: 'Milkyway Studio',
    brand: 'Infestation Spirit',
    mainVideoUrl: 'https://youtu.be/P-gxYwF0r0w?si=mN1o7TkonEUrydHW',
    additionalVideos: [],
    videoThumbnail: 'https://img.youtube.com/vi/P-gxYwF0r0w/maxresdefault.jpg'
  },
  {
    id: '8',
    title: 'J&T Express',
    description: 'Logistics company commercial showcasing delivery services for Milkyway Studio.',
    thumbnail: 'https://img.youtube.com/vi/rzXekAUlEvI/maxresdefault.jpg',
    tags: ['J&T', '2024', 'Logistics'],
    year: 2024,
    client: 'Milkyway Studio',
    brand: 'J&T Express',
    mainVideoUrl: 'https://youtu.be/rzXekAUlEvI?si=5RbPP0gExQwiSTSq',
    additionalVideos: [],
    videoThumbnail: 'https://img.youtube.com/vi/rzXekAUlEvI/maxresdefault.jpg'
  },
  {
    id: '9',
    title: 'Valorant VCT Ascension Pacific',
    description: 'Esports tournament promotional content featuring high-energy gaming visuals for Milkyway Studio.',
    thumbnail: 'https://img.youtube.com/vi/OT4MzLnsx1o/maxresdefault.jpg',
    tags: ['Valorant', '2024', 'Esports'],
    year: 2024,
    client: 'Milkyway Studio',
    brand: 'Valorant VCT',
    mainVideoUrl: 'https://youtu.be/OT4MzLnsx1o?si=WGoF4WRMVFl-GQX2',
    additionalVideos: [],
    videoThumbnail: 'https://img.youtube.com/vi/OT4MzLnsx1o/maxresdefault.jpg'
  },
  {
    id: '10',
    title: 'Mobile Legend All Star',
    description: 'Gaming tournament promotional video featuring epic battle sequences for Milkyway Studio.',
    thumbnail: 'https://img.youtube.com/vi/239w3mLbR78/maxresdefault.jpg',
    tags: ['Mobile Legends', '2024', 'Gaming'],
    year: 2024,
    client: 'Milkyway Studio',
    brand: 'Mobile Legend',
    mainVideoUrl: 'https://youtu.be/239w3mLbR78?si=2M9dDAd3fT-q1oKQ',
    additionalVideos: [],
    videoThumbnail: 'https://img.youtube.com/vi/239w3mLbR78/maxresdefault.jpg'
  },
  {
    id: '11',
    title: 'Garuda Miles',
    description: 'Airline loyalty program commercial featuring travel-inspired visuals for Lieve.',
    thumbnail: 'https://img.youtube.com/vi/-7_nktP0pG4/maxresdefault.jpg',
    tags: ['Garuda', '2024', 'Travel'],
    year: 2024,
    client: 'Lieve',
    brand: 'Garuda Miles',
    mainVideoUrl: 'https://youtu.be/-7_nktP0pG4',
    additionalVideos: [],
    videoThumbnail: 'https://img.youtube.com/vi/-7_nktP0pG4/maxresdefault.jpg'
  },
  {
    id: '12',
    title: 'Ultima II Brand Manifesto',
    description: 'Brand manifesto video showcasing beauty and elegance for Winaya Studio.',
    thumbnail: 'https://img.youtube.com/vi/fe_LzsL1x-I/maxresdefault.jpg',
    tags: ['Ultima', '2024', 'Beauty'],
    year: 2024,
    client: 'Winaya Studio',
    brand: 'Ultima II',
    mainVideoUrl: 'https://youtu.be/fe_LzsL1x-I',
    additionalVideos: [],
    videoThumbnail: 'https://img.youtube.com/vi/fe_LzsL1x-I/maxresdefault.jpg'
  },
  {
    id: '13',
    title: 'Natur-E',
    description: 'Vitamin supplement commercial featuring natural elements and health benefits for Winaya Studio.',
    thumbnail: 'https://img.youtube.com/vi/VWRsTt-DQj4/maxresdefault.jpg',
    tags: ['Natur-E', '2024', 'Health'],
    year: 2024,
    client: 'Winaya Studio',
    brand: 'Natur-E',
    mainVideoUrl: 'https://youtu.be/VWRsTt-DQj4',
    additionalVideos: [],
    videoThumbnail: 'https://img.youtube.com/vi/VWRsTt-DQj4/maxresdefault.jpg'
  },
  {
    id: '14',
    title: 'RWS Casino',
    description: 'Casino entertainment commercial featuring luxury and excitement for hiremistress.',
    thumbnail: 'https://img.youtube.com/vi/oMSz56zS2uk/maxresdefault.jpg',
    tags: ['RWS', '2024', 'Entertainment'],
    year: 2024,
    client: 'hiremistress',
    brand: 'RWS Casino',
    mainVideoUrl: 'https://youtu.be/oMSz56zS2uk',
    additionalVideos: ['https://youtu.be/7eDrA8IrLeA'],
    videoThumbnail: 'https://img.youtube.com/vi/oMSz56zS2uk/maxresdefault.jpg'
  },
  {
    id: '15',
    title: 'BBL X Chelsea Islan',
    description: 'Beauty brand collaboration featuring celebrity endorsement with multiple campaign videos for Lieve.',
    thumbnail: 'https://img.youtube.com/vi/x7gmGrbucIU/maxresdefault.jpg',
    tags: ['BBL', '2024', 'Beauty'],
    year: 2024,
    client: 'Lieve',
    brand: 'BBL',
    mainVideoUrl: 'https://youtu.be/x7gmGrbucIU',
    additionalVideos: ['https://youtu.be/jiAVzjXO4Uw', 'https://youtu.be/Fq8lmuzh5e0', 'https://youtu.be/GkTJquLGTzc'],
    videoThumbnail: 'https://img.youtube.com/vi/x7gmGrbucIU/maxresdefault.jpg'
  },
  {
    id: '16',
    title: 'Indomilk X Timnas',
    description: 'Sports sponsorship commercial featuring Indonesian national football team for United Creative.',
    thumbnail: 'https://img.youtube.com/vi/GMeCmOyHu1g/maxresdefault.jpg',
    tags: ['Indomilk', '2023', 'Sports'],
    year: 2023,
    client: 'United Creative',
    brand: 'Indomilk',
    mainVideoUrl: 'https://youtube.com/shorts/GMeCmOyHu1g',
    additionalVideos: [],
    videoThumbnail: 'https://img.youtube.com/vi/GMeCmOyHu1g/maxresdefault.jpg'
  },
  {
    id: '17',
    title: 'BCA Sekali Jalan',
    description: 'Banking service commercial featuring travel and financial convenience for Cuatrodia.',
    thumbnail: 'https://img.youtube.com/vi/vYOt2WfiZpM/maxresdefault.jpg',
    tags: ['BCA', '2023', 'Banking'],
    year: 2023,
    client: 'Cuatrodia',
    brand: 'BCA',
    mainVideoUrl: 'https://youtu.be/vYOt2WfiZpM',
    additionalVideos: [],
    videoThumbnail: 'https://img.youtube.com/vi/vYOt2WfiZpM/maxresdefault.jpg'
  },
  {
    id: '18',
    title: 'Kopi Kenangan Matcha',
    description: 'Coffee chain commercial featuring matcha products for Milkyway Studio.',
    thumbnail: 'https://img.youtube.com/vi/ZyRs2eIR4Mo/maxresdefault.jpg',
    tags: ['Kopi Kenangan', '2023', 'F&B'],
    year: 2023,
    client: 'Milkyway Studio',
    brand: 'Kopi Kenangan',
    mainVideoUrl: 'https://youtu.be/ZyRs2eIR4Mo?si=9DOpLpNpoWbpOqc_',
    additionalVideos: [],
    videoThumbnail: 'https://img.youtube.com/vi/ZyRs2eIR4Mo/maxresdefault.jpg'
  },
  {
    id: '19',
    title: 'Flimty X Deddy Corbuzier',
    description: 'Health supplement commercial featuring celebrity endorsement for Milkyway Studio.',
    thumbnail: 'https://img.youtube.com/vi/HbaDfSrCBp4/maxresdefault.jpg',
    tags: ['Flimty', '2023', 'Health'],
    year: 2023,
    client: 'Milkyway Studio',
    brand: 'Flimty',
    mainVideoUrl: 'https://youtu.be/HbaDfSrCBp4?si=NrIbL_KBHlO-lEDq',
    additionalVideos: [],
    videoThumbnail: 'https://img.youtube.com/vi/HbaDfSrCBp4/maxresdefault.jpg'
  },
  {
    id: '20',
    title: 'Mobile Legends M4',
    description: 'Gaming tournament championship promotional content for Milkyway Studio.',
    thumbnail: 'https://img.youtube.com/vi/7tCSKIO1Qkc/maxresdefault.jpg',
    tags: ['Mobile Legends', '2022', 'Gaming'],
    year: 2022,
    client: 'Milkyway Studio',
    brand: 'Mobile Legends',
    mainVideoUrl: 'https://youtu.be/7tCSKIO1Qkc?si=DiH00hbO4UNNgYd7',
    additionalVideos: [],
    videoThumbnail: 'https://img.youtube.com/vi/7tCSKIO1Qkc/maxresdefault.jpg'
  }
];

// Generate tags from projects dynamically
const AVAILABLE_TAGS = Array.from(new Set(
  PROJECTS.flatMap(project => project.tags)
)).sort();

const AVAILABLE_YEARS = Array.from(new Set(
  PROJECTS.map(project => project.year)
)).sort((a, b) => b - a);

export const ProjectsBrowser = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = PROJECTS.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         project.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => project.tags.includes(tag));
    const matchesYears = selectedYears.length === 0 || selectedYears.includes(project.year);
    return matchesSearch && matchesTags && matchesYears;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const toggleYear = (year: number) => {
    setSelectedYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSelectedYears([]);
    setSearchTerm('');
  };

  return (
    <>
      <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 shadow-2xl">
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
              className="pl-12 bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 rounded-full"
            />
          </div>

          {/* Filter Tags */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2 text-white/70">
                <Filter className="w-4 h-4" />
                <span className="text-sm">Filter by tags:</span>
              </div>
              {AVAILABLE_TAGS.slice(0, 12).map(tag => (
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
            </div>
            
            {/* Year Filter */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2 text-white/70">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Filter by year:</span>
              </div>
              {AVAILABLE_YEARS.map(year => (
                <Badge
                  key={year}
                  variant={selectedYears.includes(year) ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedYears.includes(year)
                      ? 'bg-white text-purple-900 hover:bg-white/90'
                      : 'border-white/30 text-white hover:bg-white/10'
                  }`}
                  onClick={() => toggleYear(year)}
                >
                  {year}
                </Badge>
              ))}
              {(selectedTags.length > 0 || selectedYears.length > 0 || searchTerm) && (
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
        </div>

        {/* Projects Grid - Extended panels with separate sections for image and text */}
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
              {/* Video Thumbnail Section */}
              <div className="aspect-[16/9] relative overflow-hidden">
                {project.mainVideoUrl ? (
                  <img
                    src={project.videoThumbnail || project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-pink-800/50 flex items-center justify-center">
                    <div className="text-center text-white/70">
                      <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/10 flex items-center justify-center">
                        <Users className="w-6 h-6" />
                      </div>
                      <p className="text-sm">{project.brand}</p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 right-3">
                  <Badge className="bg-white/20 text-white border-none backdrop-blur-sm">
                    {project.year}
                  </Badge>
                </div>
              </div>
              
              {/* Text Content Section */}
              <div className="p-5 space-y-3">
                <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors leading-tight">
                  {project.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">Client: {project.client}</span>
                  <span className="text-purple-300">{project.brand}</span>
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
