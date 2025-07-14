import { VideoPlayer } from '@/components/VideoPlayer';
import { ProjectsBrowser } from '@/components/ProjectsBrowser';
import { ClientLogos } from '@/components/ClientLogos';
import { Footer } from '@/components/Footer';

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
    title: 'Liquid Reels',
    author: 'neotrix.asia'
  },
  {
    id: '3',
    src: 'https://youtu.be/dDYHSj54Wn0',
    title: 'Animation Reels',
    author: 'neotrix.asia'
  }
];

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Aurora Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-800 to-blue-900 bg-[length:400%_400%] animate-aurora" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-800/50 via-purple-700/50 to-pink-800/50 bg-[length:600%_600%] animate-aurora-slow" />
      <div className="absolute inset-0 bg-gradient-to-bl from-indigo-900/30 via-pink-900/30 to-purple-900/30 bg-[length:800%_800%] animate-gradient" />
      
      {/* Enhanced Background Effects with Aurora Animation */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Background Circles */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/25 to-pink-400/25 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/25 to-indigo-400/25 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-gradient-to-r from-pink-400/15 to-purple-400/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '3s' }} />
        
        {/* Aurora Wisps */}
        <div className="absolute top-1/4 left-1/4 w-60 h-60 bg-gradient-to-r from-purple-400/10 to-transparent rounded-full blur-3xl animate-wisp-float" />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-l from-pink-400/10 to-transparent rounded-full blur-3xl animate-wisp-float" style={{ animationDelay: '10s' }} />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-gradient-to-t from-blue-400/10 to-transparent rounded-full blur-3xl animate-wisp-float" style={{ animationDelay: '5s' }} />
        
        {/* Floating Circle Shapes with 15% Blur (3px) */}
        {[...Array(15)].map((_, i) => {
          const baseSize = 60 + (i * 15);
          const left = Math.random() * 90;
          const top = Math.random() * 90;
          
          return (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-br from-purple-500/40 to-pink-500/40"
              style={{
                width: `${baseSize}px`,
                height: `${baseSize}px`,
                left: `${left}%`,
                top: `${top}%`,
                filter: 'blur(3px)',
                animation: `float-${i % 8} ${12 + (i * 1.5)}s ease-in-out infinite`
              }}
            />
          );
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
      <div className="relative z-10 min-h-screen flex flex-col py-8 p-6">
        {/* Main Hero Video - Neotrix Reels 2024 */}
        <div className="max-w-7xl mx-auto w-full mb-12">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6 animate-fade-in">
              <img 
                src="/lovable-uploads/2c994a0b-e3ea-40ee-8471-4d3a8349b612.png" 
                alt="Neotrix Logo" 
                className="h-40 w-auto"
              />
            </div>
            <p className="text-2xl text-white/90 font-medium animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Innovate. Animate. Elevate.
            </p>
          </div>
          <div className="aspect-video bg-white/15 backdrop-blur-sm rounded-3xl border border-white/30 overflow-hidden shadow-2xl hover:bg-white/20 transition-all duration-500 max-w-6xl mx-auto ring-2 ring-white/10">
            <VideoPlayer
              src={REELS[0].src}
              title={REELS[0].title}
              author={REELS[0].author}
              isActive={true}
            />
          </div>
        </div>

        {/* Secondary Videos */}
        <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full mb-12">
          <h2 className="text-3xl font-bold text-white text-center mb-6">More From Our Portfolio</h2>

          {/* Bottom Row - Two videos side by side (Constrained to 16:9) */}
          <div className="flex gap-6 max-w-6xl mx-auto w-full">
            {/* Liquid Reels */}
            <div className="flex-1 aspect-video bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden shadow-2xl hover:bg-white/15 transition-all duration-500">
              <VideoPlayer
                src={REELS[1].src}
                title={REELS[1].title}
                author={REELS[1].author}
                isActive={true}
              />
            </div>

            {/* Animation Reels */}
            <div className="flex-1 aspect-video bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden shadow-2xl hover:bg-white/15 transition-all duration-500">
              <VideoPlayer
                src={REELS[2].src}
                title={REELS[2].title}
                author={REELS[2].author}
                isActive={true}
              />
            </div>
          </div>
        </div>

        {/* Client Logos */}
        <div className="max-w-7xl mx-auto w-full py-8">
          <ClientLogos />
        </div>

        {/* Projects Browser */}
        <div className="max-w-7xl mx-auto w-full py-8">
          <ProjectsBrowser />
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Index;