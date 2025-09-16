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
      </div>
    </div>
  );
};