import { VideoPlayer } from '@/components/VideoPlayer';
import { ClientLogos } from '@/components/ClientLogos';
import { StatsCounter } from '@/components/StatsCounter';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useProjects } from '@/contexts/ProjectsContext';

const neotrixLogo = '/lovable-uploads/e25231ff-24d7-47d0-b8da-ebd1979c96de.png';

const REELS = [{
  id: '1',
  src: 'https://youtu.be/tlpjTqTaj_Y',
  title: 'Neotrix Reels 2024',
  author: 'neotrix.asia'
}, {
  id: '2',
  src: 'https://www.youtube.com/watch?v=at7JQLqKE90',
  title: 'Liquid Reels',
  author: 'neotrix.asia'
}, {
  id: '3',
  src: 'https://youtu.be/WcAUX5glZWc',
  title: 'Beauty Reels',
  author: 'neotrix.asia'
}];

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

const Index = () => {
  const navigate = useNavigate();
  const { customProjects } = useProjects();

  // Get latest 6 projects for preview
  const previewProjects = customProjects
    .map(cp => ({
      id: cp.id,
      title: cp.title,
      thumbnail: cp.thumbnail || (cp.links[0] ? getYouTubeThumbnail(cp.links[0]) : ''),
      tags: cp.tags,
      year: cp.year || new Date(cp.createdAt).getFullYear(),
      client: cp.client || cp.credits || 'Neotrix',
      deliveryDate: cp.deliveryDate,
      createdAt: cp.createdAt,
    }))
    .sort((a, b) => {
      const dateA = a.deliveryDate ? new Date(a.deliveryDate).getTime() : new Date(a.createdAt).getTime();
      const dateB = b.deliveryDate ? new Date(b.deliveryDate).getTime() : new Date(b.createdAt).getTime();
      return dateB - dateA;
    })
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-blue-900 bg-[length:200%_200%] animate-gradient p-3 md:p-6 relative overflow-auto scrollbar-glassmorphism backdrop-blur-md">
      {/* Header */}
      <Header />

      {/* Enhanced Background Effects with More Bouncing Circles and Reduced Blur */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Background Circles - Less Blurred */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/25 to-pink-400/25 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/25 to-indigo-400/25 rounded-full blur-2xl animate-pulse" style={{
        animationDelay: '2s'
      }} />
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-gradient-to-r from-pink-400/15 to-purple-400/15 rounded-full blur-2xl animate-pulse" style={{
        animationDelay: '1s'
      }} />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-2xl animate-pulse" style={{
        animationDelay: '3s'
      }} />
        
        {/* Floating Circle Shapes - Green Blue Gradient with 25% Blur */}
        {[...Array(15)].map((_, i) => {
        const baseSize = 60 + i * 15;
        let left, top;
        let attempts = 0;
        do {
          left = Math.random() * 90;
          top = Math.random() * 90;
          attempts++;
        } while (attempts < 20);

        return <div key={i} className="absolute rounded-full bg-gradient-to-br from-green-500/50 to-blue-600/50" style={{
          width: `${baseSize}px`,
          height: `${baseSize}px`,
          left: `${left}%`,
          top: `${top}%`,
          filter: 'blur(25px)',
          animation: `float-${i % 8} ${12 + i * 1.5}s ease-in-out infinite`
        }} />;
      })}
      </div>

      {/* Floating Animation Keyframes */}
      <style>{`
        @keyframes float-0 { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(200px, -100px); } 50% { transform: translate(-150px, 150px); } 75% { transform: translate(100px, 200px); } }
        @keyframes float-1 { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(-180px, 120px); } 50% { transform: translate(220px, -80px); } 75% { transform: translate(-100px, -150px); } }
        @keyframes float-2 { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(150px, 180px); } 50% { transform: translate(-200px, -100px); } 75% { transform: translate(180px, -120px); } }
        @keyframes float-3 { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(-120px, -180px); } 50% { transform: translate(180px, 120px); } 75% { transform: translate(-150px, 100px); } }
        @keyframes float-4 { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(100px, -150px); } 50% { transform: translate(-180px, 200px); } 75% { transform: translate(150px, -80px); } }
        @keyframes float-5 { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(-200px, 80px); } 50% { transform: translate(120px, -200px); } 75% { transform: translate(-80px, 150px); } }
        @keyframes float-6 { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(180px, 100px); } 50% { transform: translate(-100px, -150px); } 75% { transform: translate(200px, 120px); } }
        @keyframes float-7 { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(-150px, -100px); } 50% { transform: translate(100px, 180px); } 75% { transform: translate(-200px, -120px); } }
      `}</style>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col py-4 md:py-8">
        {/* Main Hero Video - Neotrix Reels 2024 */}
        <div className="max-w-7xl mx-auto w-full mb-8 md:mb-12">
          <div className="text-center mb-6 md:mb-8">
            <div className="flex justify-center mb-4 md:mb-6 animate-fade-in">
              <img src={neotrixLogo} alt="Neotrix Logo" className="h-16 md:h-32 w-auto object-contain" />
            </div>
            <p className="text-lg md:text-2xl text-white/90 font-medium animate-fade-in px-4" style={{
            animationDelay: '0.2s'
          }}>
              Innovate. Animate. Elevate.
            </p>
          </div>
          <div className="aspect-video bg-white/15 backdrop-blur-sm rounded-3xl border border-white/30 overflow-hidden shadow-2xl hover:bg-white/20 transition-all duration-500 max-w-7xl mx-auto ring-2 ring-white/10">
            <VideoPlayer src={REELS[0].src} title={REELS[0].title} author={REELS[0].author} isActive={true} />
          </div>
        </div>

        {/* Secondary Videos - Liquid and Beauty Reels in one row */}
        <div className="flex flex-col gap-4 md:gap-6 max-w-7xl mx-auto w-full mb-8 md:mb-12">
          <h2 className="text-xl md:text-3xl font-bold text-white text-center mb-4 md:mb-6 px-4">More From Our Portfolio</h2>

          <div className="flex flex-col md:flex-row gap-4 md:gap-6 max-w-7xl mx-auto w-full">
            {/* Liquid Reels */}
            <div className="flex-1 aspect-video bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden shadow-2xl hover:bg-white/15 transition-all duration-500">
              <VideoPlayer src={REELS[1].src} title={REELS[1].title} author={REELS[1].author} isActive={true} />
            </div>

            {/* Beauty Reels */}
            <div className="flex-1 aspect-video bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden shadow-2xl hover:bg-white/15 transition-all duration-500">
              <VideoPlayer src={REELS[2].src} title={REELS[2].title} author={REELS[2].author} isActive={true} />
            </div>
          </div>
        </div>

        {/* Projects Preview Section */}
        <div className="max-w-7xl mx-auto w-full mb-8 md:mb-12">
          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-xl md:text-3xl font-bold text-white">Our Projects</h2>
            <Button
              variant="ghost"
              className="text-white/80 hover:text-white hover:bg-white/10"
              onClick={() => navigate('/projects')}
            >
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {previewProjects.map((project) => (
              <div
                key={project.id}
                className="group cursor-pointer bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/projects')}
              >
                <div className="aspect-[4/3] md:aspect-video bg-gray-800 overflow-hidden">
                  <img
                    src={project.thumbnail || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400'}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400';
                    }}
                  />
                </div>
                <div className="p-2 md:p-4 space-y-1 md:space-y-2">
                  <h3 className="font-semibold text-white text-sm md:text-base group-hover:text-blue-300 transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <div className="hidden md:flex items-center gap-2 text-xs text-white/60">
                    <Users className="w-3 h-3" />
                    <span className="line-clamp-1">{project.client}</span>
                  </div>
                  <div className="hidden md:flex flex-wrap gap-1">
                    {project.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-white/10 text-white/80 hover:bg-white/20">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* See All Projects Button */}
          <div className="text-center mt-8">
            <Button
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 rounded-full px-8 py-3"
              onClick={() => navigate('/projects')}
            >
              Explore All Projects
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Client Logos */}
        <div className="max-w-7xl mx-auto w-full py-8">
          <ClientLogos />
        </div>

        {/* Statistics Counter */}
        <StatsCounter />

        {/* Contact CTA */}
        <div className="max-w-7xl mx-auto w-full py-16 text-center">
          <Button className="bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 rounded-full px-6 py-4 text-2xl md:text-3xl font-bold min-h-[60px] md:min-h-[80px]" onClick={() => navigate('/contact')}>
            <Mail className="w-4 h-4 md:w-6 md:h-6 mr-2 md:mr-3" />
            Share your ideas !         
          </Button>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Index;