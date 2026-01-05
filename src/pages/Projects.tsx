import { ProjectsBrowser } from '@/components/ProjectsBrowser';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';

export const Projects = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-r from-blue-500/25 to-cyan-400/25 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/25 to-indigo-400/25 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-gradient-to-r from-cyan-400/15 to-blue-400/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>
      
      <Header />
      
      <div className="container mx-auto px-6 pt-24 pb-8">
        <ProjectsBrowser />
        
        {/* Bottom Message */}
        <div className="text-center py-12 mt-8 border-t border-white/10">
          <p className="text-white/70 text-lg md:text-xl font-medium mb-2">
            Many more projects we can't show you yet
          </p>
          <p className="text-white/50 text-sm md:text-base">
            Contact us if you are interested and we can show you the rest
          </p>
          <Button
            variant="ghost"
            onClick={() => navigate('/contact')}
            className="mt-4 text-white hover:bg-white/10"
          >
            Get in Touch
          </Button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};