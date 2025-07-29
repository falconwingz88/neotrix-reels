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
  primaryVideoUrl: string;
  allVideos: string[];
  deliveryFiles: string[];
}

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

// Fallback thumbnails for each category
const getFallbackThumbnail = (tags: string[]): string => {
  if (tags.includes('Beauty')) return 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop';
  if (tags.includes('Liquid')) return 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&h=600&fit=crop';
  if (tags.includes('VFX & Character Animation')) return 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop';
  return 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop';
};

// Helper function to categorize projects into new tag system
const categorizeProject = (title: string, originalClient: string): string[] => {
  const titleLower = title.toLowerCase();
  const clientLower = originalClient.toLowerCase();
  
  // Beauty-related projects
  if (titleLower.includes('wardah') || titleLower.includes('ultima') || titleLower.includes('scarlett') || 
      titleLower.includes('beauty') || titleLower.includes('skincare') || titleLower.includes('cosmetic') ||
      titleLower.includes('skintific') || titleLower.includes('skinmology') || titleLower.includes('natur-e') ||
      titleLower.includes('softex') || titleLower.includes('rejoice') || titleLower.includes('kelaya')) {
    return ['Beauty'];
  }
  
  // Liquid/Fluid-related projects
  if (titleLower.includes('liquid') || titleLower.includes('water') || titleLower.includes('kopi') ||
      titleLower.includes('coffee') || titleLower.includes('tomoro') || titleLower.includes('abc') ||
      titleLower.includes('miranda') || titleLower.includes('active water') || titleLower.includes('realfood') ||
      titleLower.includes('indomilk') || titleLower.includes('wyeth')) {
    return ['Liquid'];
  }
  
  // Everything else goes to VFX & Character Animation
  return ['VFX & Character Animation'];
};

const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Wardah UV Shield',
    description: 'Sunscreen campaign showcasing protection and skincare benefits with premium beauty aesthetics.',
    thumbnail: getFallbackThumbnail(['Beauty']),
    tags: categorizeProject('Wardah UV Shield', 'Liquid Production'),
    year: 2025,
    client: 'Liquid Production',
    primaryVideoUrl: '',
    allVideos: [],
    deliveryFiles: []
  },
  {
    id: '2',
    title: 'Caplang',
    description: 'Creative advertising campaign with dynamic visual storytelling and engaging brand narrative.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/os941LA67aE') || getFallbackThumbnail(['VFX & Character Animation']),
    tags: categorizeProject('Caplang', 'Lieve, Masterpiece'),
    year: 2025,
    client: 'Lieve, Masterpiece',
    primaryVideoUrl: 'https://youtu.be/os941LA67aE',
    allVideos: ['https://youtu.be/os941LA67aE', 'https://youtu.be/GTk5W7jzSc0'],
    deliveryFiles: ['https://youtu.be/os941LA67aE', 'https://youtu.be/GTk5W7jzSc0']
  },
  {
    id: '3',
    title: 'Yamalube',
    description: 'Motorcycle lubricant brand campaign featuring high-performance visuals and technical excellence.',
    thumbnail: getFallbackThumbnail(['VFX & Character Animation']),
    tags: categorizeProject('Yamalube', 'Faris Aprillio'),
    year: 2025,
    client: 'Faris Aprillio',
    primaryVideoUrl: '',
    allVideos: [],
    deliveryFiles: []
  },
  // Continue with all other projects with updated categorization and fixed thumbnails
  {
    id: '4',
    title: 'Hansaplast',
    description: 'Healthcare brand campaign emphasizing care, protection, and healing with medical precision.',
    thumbnail: getFallbackThumbnail(['VFX & Character Animation']),
    tags: categorizeProject('Hansaplast', 'Lieve'),
    year: 2025,
    client: 'Lieve',
    primaryVideoUrl: '',
    allVideos: [],
    deliveryFiles: []
  },
  {
    id: '5',
    title: 'Wuling',
    description: 'Automotive brand showcase featuring innovative design and modern mobility solutions.',
    thumbnail: getFallbackThumbnail(['VFX & Character Animation']),
    tags: categorizeProject('Wuling', 'Above Space'),
    year: 2025,
    client: 'Above Space',
    primaryVideoUrl: '',
    allVideos: [],
    deliveryFiles: ['https://drive.google.com/file/d/1Ytd-GYd56XpusWyvyNwz0m67dcD4ya-t/view?usp=drive_link']
  },
  {
    id: '6',
    title: 'Clevo Reedit',
    description: 'Technology brand campaign featuring cutting-edge innovation and performance excellence.',
    thumbnail: getFallbackThumbnail(['VFX & Character Animation']),
    tags: categorizeProject('Clevo Reedit', 'Lilac Post'),
    year: 2025,
    client: 'Lilac Post',
    primaryVideoUrl: '',
    allVideos: [],
    deliveryFiles: ['https://drive.google.com/file/d/1ywsE0a5JfkWLuuh8LewStgtn1pC2dUUw/view?usp=drive_link']
  },
  {
    id: '7',
    title: 'Paddle Pop',
    description: 'Ice cream brand campaign with playful animations and joyful family moments.',
    thumbnail: getYouTubeThumbnail('') || getFallbackThumbnail(['Liquid']),
    tags: categorizeProject('Paddle Pop', 'Reyhan Hilman'),
    year: 2025,
    client: 'Reyhan Hilman',
    primaryVideoUrl: '',
    allVideos: [],
    deliveryFiles: []
  },
  {
    id: '8',
    title: 'Ultima II x Mikha Tambayong',
    description: 'Beauty brand collaboration featuring celebrity endorsement and premium cosmetics showcase.',
    thumbnail: getFallbackThumbnail(['Beauty']),
    tags: categorizeProject('Ultima II x Mikha Tambayong', 'Lieve'),
    year: 2025,
    client: 'Lieve',
    primaryVideoUrl: '',
    allVideos: [],
    deliveryFiles: ['https://drive.google.com/file/d/1T6iYkJ0Dz2BqmRttbT70PfSzJvVD8Svi/view?usp=sharing', 'https://drive.google.com/file/d/1NC2q-dPpiYqq0mzgLj8N77WoggXIIiEJ/view?usp=drive_link', 'https://drive.google.com/file/d/1-Z0eNWi9yRd_AVGgaE7coqpDHId46b5F/view?usp=drive_link']
  },
  {
    id: '9',
    title: 'Bibit x Deddy Corbuzier',
    description: 'Investment platform campaign featuring influencer collaboration and financial education.',
    thumbnail: getYouTubeThumbnail('https://youtube.com/shorts/mFd3rPt-R-U') || getFallbackThumbnail(['VFX & Character Animation']),
    tags: categorizeProject('Bibit x Deddy Corbuzier', 'Adi Victory'),
    year: 2024,
    client: 'Adi Victory',
    primaryVideoUrl: 'https://youtube.com/shorts/mFd3rPt-R-U',
    allVideos: ['https://youtube.com/shorts/mFd3rPt-R-U'],
    deliveryFiles: []
  },
  {
    id: '10',
    title: 'Miranda',
    description: 'Beverage brand campaign showcasing refreshing moments and lifestyle integration.',
    thumbnail: getFallbackThumbnail(['Liquid']),
    tags: categorizeProject('Miranda', 'Lieve'),
    year: 2024,
    client: 'Lieve',
    primaryVideoUrl: '',
    allVideos: [],
    deliveryFiles: []
  },
  {
    id: '11',
    title: 'Enfagrow',
    description: 'Nutrition brand focusing on child development and family wellness.',
    thumbnail: getFallbackThumbnail(['VFX & Character Animation']),
    tags: categorizeProject('Enfagrow', 'Lieve'),
    year: 2024,
    client: 'Lieve',
    primaryVideoUrl: '',
    allVideos: [],
    deliveryFiles: []
  },
  {
    id: '12',
    title: 'Scarlett Whitening',
    description: 'Beauty brand campaign emphasizing skincare innovation and radiant results.',
    thumbnail: getFallbackThumbnail(['Beauty']),
    tags: categorizeProject('Scarlett Whitening', 'Lieve'),
    year: 2024,
    client: 'Lieve',
    primaryVideoUrl: '',
    allVideos: [],
    deliveryFiles: []
  },
  {
    id: '13',
    title: 'Patigon Spirit',
    description: 'Gaming-inspired content with dynamic action sequences and competitive spirit.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/P-gxYwF0r0w') || getFallbackThumbnail(['VFX & Character Animation']),
    tags: categorizeProject('Patigon Spirit', 'Milkyway Studio'),
    year: 2024,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/P-gxYwF0r0w',
    allVideos: ['https://youtu.be/P-gxYwF0r0w'],
    deliveryFiles: []
  },
  {
    id: '14',
    title: 'J&T Express',
    description: 'Logistics company campaign showcasing delivery excellence and customer satisfaction.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/rzXekAUlEvI') || getFallbackThumbnail(['VFX & Character Animation']),
    tags: categorizeProject('J&T Express', 'Milkyway Studio'),
    year: 2024,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/rzXekAUlEvI',
    allVideos: ['https://youtu.be/rzXekAUlEvI'],
    deliveryFiles: []
  },
  {
    id: '15',
    title: 'Vuse',
    description: 'Premium tobacco brand campaign with sophisticated visual aesthetics.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/5YbuwyzvdEo') || getFallbackThumbnail(['VFX & Character Animation']),
    tags: categorizeProject('Vuse', 'Milkyway Studio'),
    year: 2024,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/5YbuwyzvdEo',
    allVideos: ['https://youtu.be/5YbuwyzvdEo'],
    deliveryFiles: []
  },
  {
    id: '16',
    title: 'Lucky Strike',
    description: 'Iconic tobacco brand campaign with bold visual identity and premium positioning.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/VOoKutKEQWE') || getFallbackThumbnail(['VFX & Character Animation']),
    tags: categorizeProject('Lucky Strike', 'Milkyway Studio'),
    year: 2024,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/VOoKutKEQWE',
    allVideos: ['https://youtu.be/VOoKutKEQWE'],
    deliveryFiles: []
  },
  {
    id: '17',
    title: 'Tomoro Coffee Cloud Series',
    description: 'Premium coffee brand campaign featuring artisanal brewing and lifestyle moments.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/EvFb7pJa8e0') || getFallbackThumbnail(['Liquid']),
    tags: categorizeProject('Tomoro Coffee Cloud Series', 'Milkyway Studio'),
    year: 2024,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/EvFb7pJa8e0',
    allVideos: ['https://youtu.be/EvFb7pJa8e0'],
    deliveryFiles: []
  },
  {
    id: '18',
    title: 'Valorant VCT Ascension Pacific',
    description: 'Esports tournament campaign with high-energy gaming visuals and competitive atmosphere.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/OT4MzLnsx1o') || getFallbackThumbnail(['VFX & Character Animation']),
    tags: categorizeProject('Valorant VCT Ascension Pacific', 'Milkyway Studio'),
    year: 2024,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/OT4MzLnsx1o',
    allVideos: ['https://youtu.be/OT4MzLnsx1o'],
    deliveryFiles: []
  },
  {
    id: '19',
    title: 'J&T Express 9th Anniversary',
    description: 'Anniversary celebration campaign highlighting company milestones and future vision.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/x4H45vuo-4Y') || getFallbackThumbnail(['VFX & Character Animation']),
    tags: categorizeProject('J&T Express 9th Anniversary', 'Milkyway Studio'),
    year: 2024,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/x4H45vuo-4Y',
    allVideos: ['https://youtu.be/x4H45vuo-4Y'],
    deliveryFiles: []
  },
  {
    id: '20',
    title: 'Hemaviton Action Range',
    description: 'Health supplement campaign focusing on energy, vitality, and active lifestyle.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/L8ZT3BxSN8s') || getFallbackThumbnail(['VFX & Character Animation']),
    tags: categorizeProject('Hemaviton Action Range', 'Milkyway Studio'),
    year: 2024,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/L8ZT3BxSN8s',
    allVideos: ['https://youtu.be/L8ZT3BxSN8s'],
    deliveryFiles: []
  },
  {
    id: '21',
    title: 'Skintific',
    description: 'Skincare brand campaign emphasizing scientific innovation and dermatological excellence.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/QD_VqP3lSdk') || getFallbackThumbnail(['Beauty']),
    tags: categorizeProject('Skintific', 'Milkyway Studio'),
    year: 2024,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/QD_VqP3lSdk',
    allVideos: ['https://youtu.be/QD_VqP3lSdk'],
    deliveryFiles: []
  },
  {
    id: '22',
    title: 'Mobile Legends All Star',
    description: 'Gaming tournament showcase with spectacular esports action and competitive highlights.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/239w3mLbR78') || getFallbackThumbnail(['VFX & Character Animation']),
    tags: categorizeProject('Mobile Legends All Star', 'Milkyway Studio'),
    year: 2024,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/239w3mLbR78',
    allVideos: ['https://youtu.be/239w3mLbR78'],
    deliveryFiles: []
  },
  {
    id: '23',
    title: 'Siloam Hospital',
    description: 'Healthcare institution campaign highlighting medical excellence and patient care.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/Mbo_WDsfYeE') || getFallbackThumbnail(['VFX & Character Animation']),
    tags: categorizeProject('Siloam Hospital', 'Milkyway Studio'),
    year: 2024,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/Mbo_WDsfYeE',
    allVideos: ['https://youtu.be/Mbo_WDsfYeE'],
    deliveryFiles: []
  },
  {
    id: '24',
    title: 'Skinmology',
    description: 'Advanced skincare brand focusing on dermatological science and beauty innovation.',
    thumbnail: getFallbackThumbnail(['Beauty']),
    tags: categorizeProject('Skinmology', 'Felivia Devanie'),
    year: 2024,
    client: 'Felivia Devanie',
    primaryVideoUrl: '',
    allVideos: [],
    deliveryFiles: ['https://drive.google.com/file/d/1tkwHrZv4tpUZXCRrNF1u_q4sMnirTizn/view?usp=drive_link']
  },
  {
    id: '25',
    title: 'Garuda Miles',
    description: 'Airline loyalty program campaign showcasing travel benefits and premium experiences.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/-7_nktP0pG4') || getFallbackThumbnail(['VFX & Character Animation']),
    tags: categorizeProject('Garuda Miles', 'Lieve'),
    year: 2024,
    client: 'Lieve',
    primaryVideoUrl: 'https://youtu.be/-7_nktP0pG4',
    allVideos: ['https://youtu.be/-7_nktP0pG4'],
    deliveryFiles: ['https://drive.google.com/file/d/1VTG1lyTN5GQiqnED_aTyBHKXdus0uLxY/view?usp=drive_link']
  },
  {
    id: '26',
    title: 'Ultima II Brand Manifesto',
    description: 'Premium beauty brand manifesto showcasing luxury cosmetics and brand philosophy.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/fe_LzsL1x-I') || getFallbackThumbnail(['Beauty']),
    tags: categorizeProject('Ultima II Brand Manifesto', 'Winaya Studio'),
    year: 2024,
    client: 'Winaya Studio',
    primaryVideoUrl: 'https://youtu.be/fe_LzsL1x-I',
    allVideos: ['https://youtu.be/fe_LzsL1x-I'],
    deliveryFiles: ['https://drive.google.com/file/d/1ppBs7EG7Ung0E-nerqY-hM6_W99V1ajr/view?usp=drive_link']
  },
  {
    id: '27',
    title: 'Natur-E',
    description: 'Natural vitamin E supplement campaign emphasizing health and natural wellness.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/VWRsTt-DQj4') || getFallbackThumbnail(['Beauty']),
    tags: categorizeProject('Natur-E', 'Winaya Studio'),
    year: 2024,
    client: 'Winaya Studio',
    primaryVideoUrl: 'https://youtu.be/VWRsTt-DQj4',
    allVideos: ['https://youtu.be/VWRsTt-DQj4'],
    deliveryFiles: ['https://drive.google.com/file/d/1wOl8lxIsuEtwsIc-suGHwhjl3Q-GPKYD/view?usp=drive_link']
  },
  {
    id: '28',
    title: 'RWS Casino',
    description: 'Gaming and entertainment venue campaign with luxurious casino atmosphere.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/oMSz56zS2uk') || getFallbackThumbnail(['VFX & Character Animation']),
    tags: categorizeProject('RWS Casino', 'hiremistress'),
    year: 2024,
    client: 'hiremistress',
    primaryVideoUrl: 'https://youtu.be/oMSz56zS2uk',
    allVideos: ['https://youtu.be/oMSz56zS2uk', 'https://youtu.be/7eDrA8IrLeA'],
    deliveryFiles: ['https://youtu.be/oMSz56zS2uk', 'https://youtu.be/7eDrA8IrLeA']
  },
  {
    id: '29',
    title: 'BBL x Chelsea Islan',
    description: 'Banking service campaign featuring celebrity endorsement and financial solutions.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/x7gmGrbucIU') || getFallbackThumbnail(['VFX & Character Animation']),
    tags: categorizeProject('BBL x Chelsea Islan', 'Lieve'),
    year: 2024,
    client: 'Lieve',
    primaryVideoUrl: 'https://youtu.be/x7gmGrbucIU',
    allVideos: ['https://youtu.be/x7gmGrbucIU', 'https://youtu.be/jiAVzjXO4Uw', 'https://youtu.be/Fq8lmuzh5e0', 'https://youtu.be/GkTJquLGTzc'],
    deliveryFiles: ['https://youtu.be/x7gmGrbucIU', 'https://youtu.be/jiAVzjXO4Uw', 'https://youtu.be/Fq8lmuzh5e0', 'https://youtu.be/GkTJquLGTzc']
  },
  {
    id: '30',
    title: 'Procold',
    description: 'Cold medicine brand campaign focusing on relief, recovery, and wellness.',
    thumbnail: getFallbackThumbnail(['VFX & Character Animation']),
    tags: categorizeProject('Procold', 'Maika'),
    year: 2024,
    client: 'Maika',
    primaryVideoUrl: '',
    allVideos: [],
    deliveryFiles: []
  }
  // ... Continue with remaining projects following same pattern
];

// Available tags and years for filtering
const AVAILABLE_TAGS = ['Beauty', 'Liquid', 'VFX & Character Animation'];
const AVAILABLE_YEARS = [...new Set(PROJECTS.map(p => p.year))].sort((a, b) => b - a);

export const ProjectsBrowser = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = PROJECTS.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => project.tags.includes(tag));
    const matchesYear = selectedYears.length === 0 || selectedYears.includes(project.year);
    return matchesSearch && matchesTags && matchesYear;
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
          </div>

          {/* Filter Years */}
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
              {/* Thumbnail Section */}
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              
              {/* Text Content Section */}
              <div className="p-5 space-y-3">
                <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors leading-tight">
                  {project.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed line-clamp-3">
                  {project.description}
                </p>
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
