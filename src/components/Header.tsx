import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Home, Menu } from 'lucide-react';
import { useState } from 'react';
import neotrixLogo from '@/assets/neotrix-logo-white.png';

export const Header = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="max-w-7xl mx-auto">
        {/* Desktop - Pill-shaped navigation bar */}
        <nav className="hidden md:flex items-center justify-between bg-white/10 backdrop-blur-md rounded-full border border-white/20 px-2 py-2">
          {/* Left side - Home */}
          <Button
            variant="ghost"
            className="group flex items-center gap-2 rounded-full hover:bg-white/20 transition-all duration-300 px-3 py-2 h-auto min-w-10"
            onClick={() => navigate('/')}
          >
            <Home className="w-5 h-5 text-white flex-shrink-0" />
            <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden w-0 group-hover:w-auto group-hover:ml-1">
              Home
            </span>
          </Button>

          {/* Center - Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <img 
              src={neotrixLogo} 
              alt="Neotrix Logo" 
              className="h-6 w-auto object-contain cursor-pointer"
              onClick={() => navigate('/')}
            />
          </div>

          {/* Right side - Navigation buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              className="rounded-full hover:bg-white/20 transition-all duration-300 px-4 py-2 text-white font-medium"
              onClick={() => navigate('/projects')}
            >
              Works
            </Button>
            <Button
              variant="ghost"
              className="rounded-full hover:bg-white/20 transition-all duration-300 px-4 py-2 text-white font-medium"
              onClick={() => navigate('/contact')}
            >
              Book Now
            </Button>
            <Button
              variant="ghost"
              className="rounded-full hover:bg-white/20 transition-all duration-300 px-4 py-2 text-white font-medium"
              onClick={() => navigate('/join-us')}
            >
              Join Us
            </Button>
            <Button
              variant="ghost"
              className="rounded-full hover:bg-white/20 transition-all duration-300 px-4 py-2 text-white font-medium"
              onClick={() => navigate('/about-us')}
            >
              Contact Us
            </Button>
            <Button
              variant="ghost"
              className="rounded-full hover:bg-white/20 transition-all duration-300 px-4 py-2 text-white/60 font-medium"
              onClick={() => navigate('/admin-login')}
            >
              Login
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center justify-between bg-white/10 backdrop-blur-md rounded-full border border-white/20 px-2 py-2">
          <Button
            variant="ghost"
            className="rounded-full hover:bg-white/20 transition-all duration-300 px-3 py-2 h-auto"
            onClick={() => navigate('/')}
          >
            <Home className="w-5 h-5 text-white" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full hover:bg-white/20 transition-all duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-5 h-5 text-white" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 mx-2">
          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              className="w-full justify-start rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium"
              onClick={() => {
                navigate('/projects');
                setMobileMenuOpen(false);
              }}
            >
              Works
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium"
              onClick={() => {
                navigate('/contact');
                setMobileMenuOpen(false);
              }}
            >
              Book Now
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium"
              onClick={() => {
                navigate('/join-us');
                setMobileMenuOpen(false);
              }}
            >
              Join Us
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium"
              onClick={() => {
                navigate('/about-us');
                setMobileMenuOpen(false);
              }}
            >
              Contact Us
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start rounded-lg bg-white/5 hover:bg-white/10 text-white/60 font-medium"
              onClick={() => {
                navigate('/admin-login');
                setMobileMenuOpen(false);
              }}
            >
              Login
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};