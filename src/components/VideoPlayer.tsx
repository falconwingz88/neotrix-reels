import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Heart, MessageCircle, Share, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  src: string;
  title: string;
  author: string;
  likes: number;
  comments: number;
  isActive: boolean;
}

export const VideoPlayer = ({ src, title, author, likes, comments, isActive }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);

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
    const video = videoRef.current;
    if (!video) return;

    if (isActive && !isPlaying) {
      video.play();
      setIsPlaying(true);
    } else if (!isActive && isPlaying) {
      video.pause();
      setIsPlaying(false);
    }
  }, [isActive, isPlaying]);

  const togglePlay = () => {
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
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        loop
        muted={isMuted}
        playsInline
        className="w-full h-full object-cover"
        onClick={togglePlay}
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-reels pointer-events-none" />

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
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div 
          className="h-full bg-gradient-primary transition-all duration-100"
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
          {/* Like Button */}
          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
              onClick={handleLike}
            >
              <Heart 
                className={`w-6 h-6 transition-colors duration-300 ${
                  isLiked ? 'text-red-500 fill-red-500' : 'text-white'
                }`} 
              />
            </Button>
            <span className="text-white text-xs mt-1 font-medium">
              {formatNumber(likes + (isLiked ? 1 : 0))}
            </span>
          </div>

          {/* Comment Button */}
          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </Button>
            <span className="text-white text-xs mt-1 font-medium">
              {formatNumber(comments)}
            </span>
          </div>

          {/* Share Button */}
          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
            >
              <Share className="w-6 h-6 text-white" />
            </Button>
          </div>

          {/* More Button */}
          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
            >
              <MoreVertical className="w-6 h-6 text-white" />
            </Button>
          </div>

          {/* Mute/Unmute Button */}
          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="w-6 h-6 text-white" />
              ) : (
                <Volume2 className="w-6 h-6 text-white" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};