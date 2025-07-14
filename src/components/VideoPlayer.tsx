import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, MoreVertical, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Utility function to detect and convert YouTube URLs
const getYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

const isYouTubeUrl = (url: string): boolean => {
  return getYouTubeVideoId(url) !== null;
};

const getYouTubeEmbedUrl = (url: string): string => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return url;
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&hd=1&vq=hd2160&quality=hd2160&fmt=37&maxres=1`;
};

interface VideoPlayerProps {
  src: string;
  title: string;
  author: string;
  isActive: boolean;
}

export const VideoPlayer = ({ src, title, author, isActive }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [duration, setDuration] = useState(0);
  
  const isYouTube = isYouTubeUrl(src);
  const embedUrl = isYouTube ? getYouTubeEmbedUrl(src) : src;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const progress = (video.currentTime / video.duration) * 100;
      setProgress(progress);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    if (isYouTube) {
      // For YouTube videos, we rely on autoplay in the embed URL
      setIsPlaying(isActive);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    if (isActive && !isPlaying) {
      video.play();
      setIsPlaying(true);
    } else if (!isActive && isPlaying) {
      video.pause();
      setIsPlaying(false);
    }
  }, [isActive, isPlaying, isYouTube]);

  const togglePlay = () => {
    if (isYouTube) {
      // For YouTube videos, toggle the state only
      setIsPlaying(!isPlaying);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (isYouTube) {
      // For YouTube videos, toggle the state only
      setIsMuted(!isMuted);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullscreen = () => {
    const element = isYouTube ? iframeRef.current?.parentElement : videoRef.current?.parentElement;
    if (!element) return;

    if (!document.fullscreenElement) {
      element.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl">
      {/* Video Element or YouTube Iframe - constrained to 16:9 aspect ratio */}
      <div className="absolute inset-0 flex items-center justify-center">
        {isYouTube ? (
          <div className="w-full aspect-video max-h-full flex items-center justify-center">
            <iframe
              ref={iframeRef}
              src={embedUrl}
              className="w-full h-full rounded-2xl border-0"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ 
                backgroundColor: 'transparent',
                mixBlendMode: 'normal'
              }}
              onClick={togglePlay}
            />
          </div>
        ) : (
          <video
            ref={videoRef}
            src={src}
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover rounded-2xl"
            onClick={togglePlay}
          />
        )}
      </div>

      {/* Subtle overlay for better text readability, only when needed */}
      {(isPlaying || !isYouTube) && (
        <div className={`absolute inset-0 bg-gradient-reels pointer-events-none transition-opacity duration-300 rounded-2xl ${
          isPlaying ? 'opacity-20' : 'opacity-40'
        }`} />
      )}

      {/* Play/Pause Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="w-20 h-20 rounded-full bg-black/30 backdrop-blur-sm border-2 border-white/20 hover:bg-black/50 transition-all duration-300"
            onClick={togglePlay}
          >
            <Play className="w-8 h-8 text-white ml-1" />
          </Button>
        </div>
      )}

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 rounded-b-2xl">
        <div 
          className="h-full bg-gradient-primary transition-all duration-100 rounded-b-2xl"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls and Info */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
        {/* Left Side - Video Info */}
        <div className="flex-1 max-w-[60%]">
          <div className="space-y-2">
            <h3 className="text-white font-semibold text-lg leading-tight line-clamp-2">
              {title}
            </h3>
            <p className="text-white/80 text-sm">@{author}</p>
          </div>
        </div>

        {/* Right Side - Action Buttons */}
        <div className="flex flex-col items-center space-y-4">
          {/* Fullscreen Button */}
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 hover:bg-black/50 transition-all duration-300"
            onClick={toggleFullscreen}
          >
            <Maximize className="w-5 h-5 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
};
