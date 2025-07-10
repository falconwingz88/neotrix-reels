import { useState, useEffect, useRef } from 'react';
import { VideoPlayer } from '@/components/VideoPlayer';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Reel {
  id: string;
  src: string;
  title: string;
  author: string;
}

// Now supports both direct video URLs and YouTube URLs
const DEMO_REELS: Reel[] = [
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

const Reels = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < DEMO_REELS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };


  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all duration-300"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Button>
      </div>

      {/* Reels Title */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
        <h1 className="text-white font-bold text-lg tracking-wide">Reels</h1>
      </div>

      {/* Video Container */}
      <div ref={containerRef} className="relative w-full h-full">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * 100}vw)`,
          }}
        >
          {DEMO_REELS.map((reel, index) => (
            <div key={reel.id} className="w-full h-screen flex-shrink-0">
              <VideoPlayer
                src={reel.src}
                title={reel.title}
                author={reel.author}
                isActive={index === currentIndex}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex space-x-2">
          {DEMO_REELS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-8 h-1 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-gradient-primary shadow-glow'
                  : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reels;