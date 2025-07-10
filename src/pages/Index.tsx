import { Button } from '@/components/ui/button';
import { Play, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
        {/* Main Logo/Icon */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 mx-auto bg-gradient-primary rounded-2xl shadow-glow flex items-center justify-center mb-6 transform hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Neotrix Studio
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Experience stunning visual effects and creative showcases
          </p>
        </div>

        {/* Call to Action */}
        <div className="space-y-4">
          <Button
            onClick={() => navigate('/reels')}
            size="lg"
            className="bg-gradient-primary hover:opacity-90 text-white font-semibold py-4 px-8 rounded-full shadow-glow transform hover:scale-105 transition-all duration-300 group"
          >
            <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
            Watch Reels
          </Button>
          
          <p className="text-sm text-muted-foreground">
            Swipe or use arrow keys to navigate between videos
          </p>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 transition-colors duration-300">
            <div className="w-12 h-12 bg-primary/20 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Visual Effects</h3>
            <p className="text-sm text-muted-foreground">Stunning liquid and motion graphics</p>
          </div>

          <div className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 transition-colors duration-300">
            <div className="w-12 h-12 bg-primary/20 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <Play className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Compilations</h3>
            <p className="text-sm text-muted-foreground">Curated collections of best work</p>
          </div>

          <div className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 transition-colors duration-300">
            <div className="w-12 h-12 bg-primary/20 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Showreels</h3>
            <p className="text-sm text-muted-foreground">Professional portfolio showcases</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
