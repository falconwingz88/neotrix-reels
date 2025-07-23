import { Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Footer = () => {
  return (
    <footer className="bg-white/5 backdrop-blur-xl border-t border-white/10 mt-16 w-full">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Neotrix</h3>
            <p className="text-white/70 leading-relaxed">
              3D animation Studio, uniquely blending artistry with cutting-edge Technology and AI.
            </p>
            <p className="text-white/60 italic text-sm mt-2">
              "Technology inspires creativity, Creativity challenges technology"
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-white/70">
                <Mail className="w-4 h-4 text-purple-400" />
                <span>contact@neotrix.asia</span>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <Phone className="w-4 h-4 text-purple-400" />
                <span>+62 87797681961</span>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span>Jl. Surya Utama No.15 Blok P, Kedoya Utara, Kec. Kb. Jeruk, Jakarta, Daerah Khusus Ibukota Jakarta 11520</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Services</h4>
            <div className="space-y-2">
              <p className="text-white/70">3D Animation</p>
              <p className="text-white/70">3D Motion Capture</p>
              <p className="text-white/70">Product Commercial</p>
              <p className="text-white/70">3D Lighting & Render</p>
            </div>
          </div>

          {/* Social & Follow */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Follow Us</h4>
            <Button
              variant="outline"
              size="lg"
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 rounded-full px-6 py-3 w-full"
              onClick={() => window.open('https://instagram.com/neotrix.asia', '_blank')}
            >
              <Instagram className="w-5 h-5 mr-2" />
              @neotrix.asia
            </Button>
            <p className="text-white/50 text-sm">
              Follow us for the latest and greatest from us
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-8 pt-6 text-center">
          <p className="text-white/50">
            © 2024 Neotrix. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
};