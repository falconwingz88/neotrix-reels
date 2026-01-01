import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Edit2, Briefcase, Users, Zap, Target, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface JobOpening {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  responsibilities: string[];
  requirements: string[];
  traits: string[];
  sort_order: number | null;
  is_active: boolean;
}

const JoinUs = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobOpenings = async () => {
      const { data, error } = await supabase
        .from('job_openings')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (!error && data) {
        setJobOpenings(data as JobOpening[]);
      }
      setLoading(false);
    };

    fetchJobOpenings();
  }, []);

  const whyWorkHere = [
    { icon: Users, text: 'Small team, high impact' },
    { icon: Target, text: 'Real projects, real responsibility' },
    { icon: Zap, text: 'Strong focus on efficiency, clarity, and evolution' },
    { icon: Heart, text: 'No corporate noise, no ego culture' },
    { icon: Briefcase, text: 'A studio that is actively redefining how 3D production works' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-blue-900">
      <Header />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Join Us at Neotrix
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              If you like thinking, improving systems, and building something that actually works — you'll feel at home here.
            </p>
          </div>

          {/* Why Work Here Section */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
              Why Work at Neotrix
            </h2>
            <div className="grid gap-4">
              {whyWorkHere.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-white/90">{item.text}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <p className="text-white/80 text-lg italic">
                "This is not a 'factory studio.' We value thinking, problem-solving, and continuous improvement as much as final visuals."
              </p>
            </div>
          </section>

          {/* Job Openings Section */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Job Openings
              </h2>
{isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin?tab=jobs')}
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Manage Jobs
                </Button>
              )}
            </div>

            {loading ? (
              <div className="text-white/60 text-center py-8">Loading...</div>
            ) : jobOpenings.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center">
                <Briefcase className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/60">No job openings at the moment.</p>
                <p className="text-white/40 text-sm">Check back later for new opportunities.</p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-4">
                {jobOpenings.map((job) => (
                  <AccordionItem 
                    key={job.id} 
                    value={job.id}
                    className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 px-6 overflow-hidden"
                  >
                    <AccordionTrigger className="text-white hover:no-underline py-6">
                      <div className="flex items-center gap-3 text-left">
                        <Briefcase className="w-5 h-5 text-white/60 flex-shrink-0" />
                        <span className="text-lg font-semibold">{job.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <div className="space-y-6">
                        {/* Subtitle & Description */}
                        {job.subtitle && (
                          <h3 className="text-white/80 font-medium">{job.subtitle}</h3>
                        )}
                        {job.description && (
                          <p className="text-white/70 leading-relaxed">{job.description}</p>
                        )}

                        {/* What You'll Do */}
                        {job.responsibilities.length > 0 && (
                          <div>
                            <h4 className="text-white font-semibold mb-3">What You'll Do</h4>
                            <ul className="space-y-2">
                              {job.responsibilities.map((item, index) => (
                                <li key={index} className="flex items-start gap-2 text-white/70">
                                  <span className="text-white/40 mt-1">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* What You Must Understand */}
                        {job.requirements.length > 0 && (
                          <div>
                            <h4 className="text-white font-semibold mb-3">What You Must Understand</h4>
                            <ul className="space-y-2">
                              {job.requirements.map((item, index) => (
                                <li key={index} className="flex items-start gap-2 text-white/70">
                                  <span className="text-white/40 mt-1">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Who You Are */}
                        {job.traits.length > 0 && (
                          <div>
                            <h4 className="text-white font-semibold mb-3">Who You Are</h4>
                            <ul className="space-y-2">
                              {job.traits.map((item, index) => (
                                <li key={index} className="flex items-start gap-2 text-white/70">
                                  <span className="text-white/40 mt-1">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

{/* Apply Button */}
                        <div className="pt-4">
                          <Button
                            onClick={() => navigate('/hiring')}
                            className="bg-white text-black hover:bg-white/90"
                          >
                            Apply for this position
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JoinUs;
