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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-blue-900 bg-[length:200%_200%] animate-gradient p-6 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-indigo-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-to-r from-indigo-400/25 to-blue-400/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-screen flex flex-col justify-center">
        {/* Glassmorphism Video Container */}
        <div className="flex gap-6 max-w-7xl mx-auto w-full h-[80vh]">
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
