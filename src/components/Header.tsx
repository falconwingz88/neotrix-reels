import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Home, User, Menu } from 'lucide-react';
import { useState } from 'react';

const neotrixLogo = '/lovable-uploads/e25231ff-24d7-47d0-b8da-ebd1979c96de.png';

export const Header = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left side - Home only */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="group flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-110 px-3 py-2 h-auto min-w-10"
            onClick={() => navigate('/')}
          >
            <Home className="w-5 h-5 text-white flex-shrink-0" />
            <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden w-0 group-hover:w-auto group-hover:ml-1">
              Home
            </span>
          </Button>
        </div>

        {/* Center - Logo (optional, can be shown on scroll) */}
        <div className="hidden md:flex items-center">
          <img src={neotrixLogo} alt="Neotrix Logo" className="h-8 w-auto object-contain opacity-0" />
        </div>

        {/* Right side - Navigation */}
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
            onClick={() => navigate('/admin-login')}
          >
            <User className="w-4 h-4 text-white/60" />
          </Button>
          <Button
            variant="ghost"
            className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 px-4 py-2 text-white font-medium"
            onClick={() => navigate('/projects')}
          >
            Works
          </Button>
          <Button
            variant="ghost"
            className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 px-4 py-2 text-white font-medium"
            onClick={() => navigate('/about-us')}
          >
            Contact Us
          </Button>
          <Button
            variant="ghost"
            className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 px-4 py-2 text-white font-medium"
            onClick={() => navigate('/contact')}
          >
            Book Now
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-4 h-4 text-white" />
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
                navigate('/about-us');
                setMobileMenuOpen(false);
              }}
            >
              Contact Us
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
              className="w-full justify-start rounded-lg bg-white/5 hover:bg-white/10 text-white/60 font-medium"
              onClick={() => {
                navigate('/admin-login');
                setMobileMenuOpen(false);
              }}
            >
              <User className="w-4 h-4 mr-2" />
              Admin
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};