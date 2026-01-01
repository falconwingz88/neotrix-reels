import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Mail, FileText, Video, ArrowLeft, Briefcase } from "lucide-react";

const Hiring = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-blue-900">
      <Header />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Back Link */}
          <Link
            to="/join-us"
            className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Job Openings
          </Link>

          {/* Header */}
          <section className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Apply to Neotrix
            </h1>
            <p className="text-xl text-white/70">
              Ready to join our team? Here's how to apply.
            </p>
          </section>

          {/* Contact Section */}
          <section className="mb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white/80">Send your application to</h2>
                  <a
                    href="mailto:Hiring@neotrix.asia"
                    className="text-2xl md:text-3xl font-bold text-white hover:text-purple-300 transition-colors"
                  >
                    Hiring@neotrix.asia
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Requirements Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">
              What to Include in Your Application
            </h2>

            <div className="space-y-4">
              {/* CV */}
              <div className="flex gap-4 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white mb-1">
                    CV / Resume
                  </h3>
                  <p className="text-white/70">
                    Include your work experience, education, and relevant skills. 
                    PDF format preferred.
                  </p>
                </div>
              </div>

              {/* Showreel */}
              <div className="flex gap-4 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white mb-1">
                    Showreel / Portfolio
                  </h3>
                  <p className="text-white/70">
                    Share your best work. This can be a video showreel, portfolio link, 
                    or relevant project samples that demonstrate your skills.
                  </p>
                </div>
              </div>

              {/* Position */}
              <div className="flex gap-4 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white mb-1">
                    Position You're Applying For
                  </h3>
                  <p className="text-white/70">
                    Mention which role interests you in your email subject or body. 
                    If you're open to multiple roles, let us know.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Tips Section */}
          <section className="mb-12">
            <div className="border-l-4 border-white/40 pl-6 py-4 bg-white/5 backdrop-blur-sm rounded-r-xl">
              <h3 className="font-semibold text-white mb-3">Tips for a Strong Application</h3>
              <ul className="space-y-2 text-white/70">
                <li className="flex items-start gap-2">
                  <span className="text-white/40">•</span>
                  <span>Keep your showreel under 2-3 minutes with your best work first</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white/40">•</span>
                  <span>Be clear about your role in team projects</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white/40">•</span>
                  <span>Show work relevant to the position you're applying for</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white/40">•</span>
                  <span>Include any breakdowns if you have them</span>
                </li>
              </ul>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <a href="mailto:Hiring@neotrix.asia">
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-white/90 text-lg px-8"
              >
                <Mail className="w-5 h-5 mr-2" />
                Send Application
              </Button>
            </a>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Hiring;
