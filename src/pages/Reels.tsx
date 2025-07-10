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

// Using direct video URLs - replace these with your actual video URLs
const DEMO_REELS: Reel[] = [
  {
    id: '1',
    src: 'https://youtu.be/tlpjTqTaj_Y',
    title: 'Neotrix Reels 2024',
    author: 'neotrix_studio'
  },
  {
    id: '2',
    src: 'https://youtu.be/at7JQLqKE90',
    title: 'Liquid Compilation',
    author: 'neotrix_studio'
  }
];

const Reels = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'ArrowDown') {
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

  // Touch handlers for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrevious();
    }
  };

  // Mouse wheel navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [currentIndex]);

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
      <div
        ref={containerRef}
        className="relative w-full h-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex flex-col transition-transform duration-500 ease-out"
          style={{
            transform: `translateY(-${currentIndex * 100}vh)`,
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
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50">
        <div className="flex flex-col space-y-2">
          {DEMO_REELS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-1 h-8 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-gradient-primary shadow-glow'
                  : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Swipe Instruction (shown briefly) */}
      {currentIndex === 0 && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
            <p className="text-white/80 text-sm">Swipe up for next video</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reels;