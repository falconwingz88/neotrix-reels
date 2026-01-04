import { ProjectsBrowser } from '@/components/ProjectsBrowser';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';

export const Projects = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-blue-900">
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