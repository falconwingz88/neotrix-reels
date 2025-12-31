import { Header } from "@/components/Header";
import { Mail, Phone, MapPin, Linkedin } from "lucide-react";

const CO_FOUNDERS = [
  {
    name: "Fernaldy Wiranata (Aldy)",
    role: "Co-Founder / Studio Head",
    email: "aldy@neotrix.asia",
    phone: "+62 87797681961",
    linkedin: "https://linkedin.com/in/fernaldywiranata",
    image: "/lovable-uploads/f7a3e855-8b55-4227-9244-d89e78a3fc66.png"
  },
  {
    name: "Elvina Lie",
    role: "Co-Founder / Executive Producer",
    email: "elvina@neotrix.asia",
    phone: "+62 81234567890",
    linkedin: "https://linkedin.com/in/elvina-lie",
    image: "/lovable-uploads/f7a3e855-8b55-4227-9244-d89e78a3fc66.png"
  }
];

const OFFICE_ADDRESS = "Surya Utama Road 15, West Jakarta 11520, Indonesia";

export const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-blue-900 bg-[length:200%_200%] animate-gradient relative overflow-auto">
      <Header />

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/25 to-pink-400/25 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/25 to-indigo-400/25 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen px-4 py-24">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Get in touch with our team. We'd love to hear from you and discuss your next project.
            </p>
          </div>

          {/* Co-Founders Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-white text-center mb-8">Our Co-Founders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {CO_FOUNDERS.map((founder) => (
                <div
                  key={founder.name}
                  className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-2xl hover:bg-white/15 transition-all duration-300"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                      <span className="text-3xl font-bold text-white">
                        {founder.name.charAt(0)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{founder.name}</h3>
                    <p className="text-purple-300 text-sm mb-4">{founder.role}</p>
                    
                    <div className="space-y-2 w-full">
                      <a
                        href={`mailto:${founder.email}`}
                        className="flex items-center justify-center gap-2 text-white/70 hover:text-white transition-colors"
                      >
                        <Mail className="w-4 h-4 text-purple-400" />
                        <span className="text-sm">{founder.email}</span>
                      </a>
                      <a
                        href={`tel:${founder.phone}`}
                        className="flex items-center justify-center gap-2 text-white/70 hover:text-white transition-colors"
                      >
                        <Phone className="w-4 h-4 text-purple-400" />
                        <span className="text-sm">{founder.phone}</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Office Location Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-white text-center mb-8">Our Office</h2>
            
            {/* Address */}
            <div className="flex items-center justify-center gap-3 text-white/70 mb-6">
              <MapPin className="w-5 h-5 text-purple-400" />
              <span className="text-lg">{OFFICE_ADDRESS}</span>
            </div>

            {/* Google Maps Embed */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 overflow-hidden shadow-2xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.5!2d106.75!3d-6.17!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sNeotrix%20Asia!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
                title="Neotrix Asia Office Location"
              />
            </div>

            {/* Direct Link to Google Maps */}
            <div className="text-center mt-6">
              <a
                href="https://www.google.com/maps/search/Neotrix+Asia+Surya+Utama+Road+15+West+Jakarta"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
              >
                <MapPin className="w-4 h-4" />
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
