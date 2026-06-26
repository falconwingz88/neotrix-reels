import { VideoPlayer } from "@/components/VideoPlayer";
import { ClientLogos } from "@/components/ClientLogos";
import { StatsCounter } from "@/components/StatsCounter";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowRight, Sparkles } from "lucide-react";
import { useProjects } from "@/contexts/ProjectsContext";



const REELS = [
  {
    id: "1",
    src: "https://youtu.be/LP5ybY7O2zc",
    title: "Neotrix Reels",
    author: "neotrix.asia",
  },
  {
    id: "2",
    src: "https://www.youtube.com/watch?v=at7JQLqKE90",
    title: "Liquid Reels",
    author: "neotrix.asia",
  },
  {
    id: "3",
    src: "https://youtu.be/WcAUX5glZWc",
    title: "Beauty Reels",
    author: "neotrix.asia",
  },
];

// Helper function to extract YouTube video ID and generate thumbnail
const getYouTubeVideoId = (url: string): string => {
  if (!url) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : "";
};

const getYouTubeThumbnail = (url: string): string => {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : "";
};

const Index = () => {
  const navigate = useNavigate();
  const { customProjects } = useProjects();

  // Get more projects for scrolling preview (18 projects for 6 rows of 3)
  const previewProjects = customProjects
    .map((cp) => ({
      id: cp.id,
      title: cp.title,
      thumbnail: cp.thumbnail || (cp.links[0] ? getYouTubeThumbnail(cp.links[0]) : ""),
      tags: cp.tags,
      year: cp.year || new Date(cp.createdAt).getFullYear(),
      client: cp.client || cp.credits || "Neotrix",
      deliveryDate: cp.deliveryDate,
      createdAt: cp.createdAt,
    }))
    .sort((a, b) => {
      const dateA = a.deliveryDate ? new Date(a.deliveryDate).getTime() : new Date(a.createdAt).getTime();
      const dateB = b.deliveryDate ? new Date(b.deliveryDate).getTime() : new Date(b.createdAt).getTime();
      return dateB - dateA;
    })
    .slice(0, 18);

  // Duplicate projects for seamless infinite scroll
  const duplicatedProjects = [...previewProjects, ...previewProjects];

  return (
    <div className="min-h-screen bg-black p-3 md:p-6 relative overflow-auto scrollbar-glassmorphism">
      {/* Header */}
      <Header />

      {/* Enhanced Background Effects with More Bouncing Circles and Reduced Blur */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Background Circles - Blue tones only */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-r from-blue-500/25 to-cyan-400/25 rounded-full blur-2xl animate-pulse" />
        <div
          className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/25 to-indigo-400/25 rounded-full blur-2xl animate-pulse"
          style={{
            animationDelay: "2s",
          }}
        />
        <div
          className="absolute top-1/3 left-1/3 w-72 h-72 bg-gradient-to-r from-cyan-400/15 to-blue-400/15 rounded-full blur-2xl animate-pulse"
          style={{
            animationDelay: "1s",
          }}
        />
        <div
          className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-2xl animate-pulse"
          style={{
            animationDelay: "3s",
          }}
        />

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

          return (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-br from-green-500/50 to-blue-600/50"
              style={{
                width: `${baseSize}px`,
                height: `${baseSize}px`,
                left: `${left}%`,
                top: `${top}%`,
                filter: "blur(25px)",
                animation: `float-${i % 8} ${12 + i * 1.5}s ease-in-out infinite`,
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

        @keyframes shimmer-sweep {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(250%) skewX(-20deg); }
        }
        @keyframes ring-pulse {
          0%, 100% { box-shadow: 0 0 0 0 hsl(var(--primary) / 0.35), 0 0 40px 0 hsl(var(--accent) / 0.15); }
          50% { box-shadow: 0 0 0 8px hsl(var(--primary) / 0), 0 0 60px 6px hsl(var(--accent) / 0.25); }
        }
        @keyframes chevron-nudge {
          0%, 100% { transform: translateX(0); opacity: 1; }
          50% { transform: translateX(6px); opacity: 0.85; }
        }
        @keyframes sparkle-spin {
          0%, 100% { transform: rotate(0deg) scale(1); opacity: 0.9; }
          50% { transform: rotate(180deg) scale(1.15); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .see-more-shimmer, .see-more-ring, .see-more-chevron, .see-more-sparkle { animation: none !important; }
        }
      `}</style>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col pt-20 md:pt-24 pb-4 md:pb-8">
        {/* Main Hero Video - Neotrix Reels 2024 */}
        <div className="max-w-7xl mx-auto w-full mb-8 md:mb-12">
          <div className="text-center mb-6 md:mb-8">
            <p
              className="text-lg md:text-2xl text-white/90 font-medium animate-fade-in px-4"
            >
              Innovate. Animate. Elevate.
            </p>
          </div>
          <div className="aspect-video bg-white/15 backdrop-blur-sm rounded-3xl border border-white/30 overflow-hidden shadow-2xl hover:bg-white/20 transition-all duration-500 max-w-7xl mx-auto ring-2 ring-white/10">
            <VideoPlayer src={REELS[0].src} title={REELS[0].title} author={REELS[0].author} isActive={true} unmutedDefault initialVolume={7} />
          </div>
        </div>

        {/* Projects Preview Section - Scrolling Panel */}
        <div className="max-w-7xl mx-auto w-full mb-8 md:mb-12">
          <h2 className="text-xl md:text-3xl font-bold text-white text-center mb-6 px-2">Other Projects</h2>

          <div
            className="see-more-ring group relative cursor-pointer bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden shadow-2xl transition-all duration-500 hover:border-white/40 hover:scale-[1.015] h-[300px] md:h-[400px]"
            style={{ animation: "ring-pulse 3.5s ease-in-out infinite" }}
            onClick={() => {
              navigate("/projects");
              window.scrollTo({ top: 0, behavior: "instant" });
            }}
          >
            {/* Scrolling Project Grid */}
            <div
              className="animate-scroll-vertical-slow transition-all duration-500 group-hover:brightness-125 group-hover:saturate-150"
              style={{ animationDuration: "100s" }}
            >
              <div className="grid grid-cols-3 gap-1 p-1">
                {duplicatedProjects.map((project, index) => (
                  <div key={`${project.id}-${index}`} className="aspect-video overflow-hidden">
                    <img
                      src={project.thumbnail || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400"}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400";
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Vignette - retracts on hover like curtains opening */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(0,0,0,0.7)_100%)] opacity-100 group-hover:opacity-30 transition-opacity duration-700" />

            {/* Edge gradient softeners */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

            {/* Soft animated gradient overlay - intensifies on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-85 transition-opacity duration-700 pointer-events-none mix-blend-screen"
              style={{
                background: "linear-gradient(120deg, hsl(280 100% 70% / 0.6), hsl(200 100% 65% / 0.6), hsl(160 90% 60% / 0.6), hsl(320 100% 70% / 0.6), hsl(280 100% 70% / 0.6))",
                backgroundSize: "300% 300%",
                animation: "gradient 12s ease infinite",
              }}
            />

            {/* Always-on shimmer sweep */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div
                className="see-more-shimmer absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                style={{ animation: "shimmer-sweep 6s ease-in-out infinite" }}
              />
            </div>

            {/* Projects counter chip */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white/90 text-xs md:text-sm font-medium">
              <Sparkles
                className="see-more-sparkle w-3.5 h-3.5 text-primary-glow"
                style={{ animation: "sparkle-spin 4s ease-in-out infinite" }}
              />
              {customProjects.length}+ projects inside
            </div>

            {/* Always visible overlay with text + CTA pill */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/10 transition-colors duration-500">
              <div className="text-center px-6">
                <h3 className="text-white text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg transition-transform duration-500 group-hover:-translate-y-1">
                  See More
                </h3>
                <p className="text-white/80 text-sm md:text-base mb-5 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  Explore the full portfolio
                </p>
                <div
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-sm md:text-base shadow-[0_0_30px_hsl(var(--primary)/0.5)] transition-all duration-500 group-hover:shadow-[0_0_50px_hsl(var(--primary)/0.8)] group-hover:scale-105"
                >
                  View All Projects
                  <ArrowRight
                    className="see-more-chevron w-4 h-4 md:w-5 md:h-5"
                    style={{ animation: "chevron-nudge 1.4s ease-in-out infinite" }}
                  />
                </div>
              </div>
            </div>
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
          <Button
            className="bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 rounded-full px-6 py-4 text-2xl md:text-3xl font-bold min-h-[60px] md:min-h-[80px]"
            onClick={() => navigate("/contact")}
          >
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
