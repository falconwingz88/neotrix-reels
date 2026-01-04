import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectsBrowser } from '@/components/ProjectsBrowser';
import { useNavigate } from 'react-router-dom';

export const Projects = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-blue-900">
      <div className="container mx-auto px-6 py-8">
        {/* Navigation Buttons */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => window.open('https://neotrix.asia', '_blank')}
            className="text-white hover:bg-white/10 flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Home
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/10 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
        
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
    </div>
  );
};