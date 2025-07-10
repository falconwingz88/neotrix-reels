import { VideoPlayer } from '@/components/VideoPlayer';
import { Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

const REELS = [
  {
    id: '1',
    src: 'https://youtu.be/tlpjTqTaj_Y',
    title: 'Neotrix Reels 2024',
    author: 'neotrix.asia'
  },
  {
    id: '2',
    src: 'https://www.youtube.com/watch?v=at7JQLqKE90',
    title: 'Liquid Compilation',
    author: 'neotrix.asia'
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-white mb-2">Neotrix Reels</h1>
          <p className="text-white/70">Experience the visual journey</p>
        </div>

        {/* Glassmorphism Video Container */}
        <div className="flex-1 flex gap-6 max-w-7xl mx-auto w-full">
          {/* Left Reel */}
          <div className="flex-1 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl hover:bg-white/15 transition-all duration-500">
            <VideoPlayer
              src={REELS[0].src}
              title={REELS[0].title}
              author={REELS[0].author}
              isActive={true}
            />
          </div>

          {/* Right Reel */}
          <div className="flex-1 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl hover:bg-white/15 transition-all duration-500">
            <VideoPlayer
              src={REELS[1].src}
              title={REELS[1].title}
              author={REELS[1].author}
              isActive={true}
            />
          </div>
        </div>

        {/* Instagram Button */}
        <div className="flex justify-center py-8">
          <Button
            variant="outline"
            size="lg"
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 rounded-full px-8 py-6"
            onClick={() => window.open('https://instagram.com/neotrix.asia', '_blank')}
          >
            <Instagram className="w-6 h-6 mr-3" />
            Follow @neotrix.asia
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
