import { VideoPlayer } from '@/components/VideoPlayer';

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
    <div className="min-h-screen bg-black">
      {/* Split Screen Layout */}
      <div className="flex h-screen">
        {/* Left Reel */}
        <div className="w-1/2 h-full">
          <VideoPlayer
            src={REELS[0].src}
            title={REELS[0].title}
            author={REELS[0].author}
            isActive={true}
          />
        </div>

        {/* Right Reel */}
        <div className="w-1/2 h-full">
          <VideoPlayer
            src={REELS[1].src}
            title={REELS[1].title}
            author={REELS[1].author}
            isActive={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
