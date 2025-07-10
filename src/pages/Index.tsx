import { Button } from '@/components/ui/button';
import { Play, Heart, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const videos = [
  {
    id: 1,
    title: 'Liquid Compilation v003',
    duration: '2:45',
    likes: 12400,
    comments: 348,
    thumbnail: '/api/placeholder/400/600'
  },
  {
    id: 2,
    title: 'Neotrix Compilation with Liquid',
    duration: '4:12',
    likes: 8750,
    comments: 192,
    thumbnail: '/api/placeholder/400/600'
  },
  {
    id: 3,
    title: 'Neotrix Showreel',
    duration: '3:28',
    likes: 15200,
    comments: 427,
    thumbnail: '/api/placeholder/400/600'
  }
];

const Index = () => {
  const navigate = useNavigate();

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-500 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-green-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-orange-300/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Glass Morphism Container */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="group cursor-pointer"
              onClick={() => navigate('/reels')}
            >
              {/* Glass Card */}
              <div className="relative bg-white/30 backdrop-blur-xl rounded-3xl p-6 border border-white/40 shadow-2xl hover:bg-white/40 hover:border-white/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                {/* Video Thumbnail */}
                <div className="relative aspect-[9/16] rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-purple-500/30 via-pink-400/20 to-blue-500/30">
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-8 h-8 text-black ml-1" />
                    </div>
                  </div>
                  
                  {/* Duration Badge */}
                  <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm rounded-lg px-2 py-1">
                    <span className="text-black text-sm font-medium">{video.duration}</span>
                  </div>

                  {/* Gradient Placeholder */}
                  <div className="w-full h-full bg-gradient-to-br from-purple-400/40 via-pink-300/30 to-blue-400/40 flex items-center justify-center">
                    <div className="text-center text-black/70">
                      <Play className="w-12 h-12 mx-auto mb-2 opacity-70" />
                      <p className="text-sm font-medium opacity-80">Video {index + 1}</p>
                    </div>
                  </div>
                </div>

                {/* Video Info */}
                <div className="space-y-3">
                  <h3 className="text-black font-bold text-lg leading-tight line-clamp-2 group-hover:text-purple-800 transition-colors duration-300">
                    {video.title}
                  </h3>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-black/80">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-medium">{formatNumber(video.likes)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">{formatNumber(video.comments)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Watch Button */}
                  <Button 
                    className="w-full bg-white/50 hover:bg-white/70 text-black border border-white/60 hover:border-white/80 backdrop-blur-sm rounded-xl transition-all duration-300 font-semibold hover:shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/reels');
                    }}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Watch Now
                  </Button>
                </div>

                {/* Glass Reflection Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Glass Navigation */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white/40 backdrop-blur-xl rounded-2xl px-6 py-3 border border-white/50 shadow-xl">
            <p className="text-black font-medium text-sm">Tap any video to start watching</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
