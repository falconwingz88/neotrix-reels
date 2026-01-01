import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Mail, FileText, Video, ArrowLeft } from "lucide-react";

const Hiring = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Back Link */}
          <Link
            to="/join-us"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Job Openings
          </Link>

          {/* Header */}
          <section className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Apply to Neotrix
            </h1>
            <p className="text-xl text-muted-foreground">
              Ready to join our team? Here's how to apply.
            </p>
          </section>

          {/* Contact Section */}
          <section className="mb-12">
            <div className="bg-muted/30 border border-border rounded-lg p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Send your application to</h2>
                  <a
                    href="mailto:Hiring@neotrix.asia"
                    className="text-2xl font-bold text-primary hover:underline"
                  >
                    Hiring@neotrix.asia
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Requirements Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">
              What to Include in Your Application
            </h2>

            <div className="space-y-6">
              {/* CV */}
              <div className="flex gap-4 p-6 border border-border rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    CV / Resume
                  </h3>
                  <p className="text-muted-foreground">
                    Include your work experience, education, and relevant skills. 
                    PDF format preferred.
                  </p>
                </div>
              </div>

              {/* Showreel */}
              <div className="flex gap-4 p-6 border border-border rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Video className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Showreel / Portfolio
                  </h3>
                  <p className="text-muted-foreground">
                    Share your best work. This can be a video showreel, portfolio link, 
                    or relevant project samples that demonstrate your skills.
                  </p>
                </div>
              </div>

              {/* Position */}
              <div className="flex gap-4 p-6 border border-border rounded-lg bg-muted/20">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-muted-foreground">+</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Position You're Applying For
                  </h3>
                  <p className="text-muted-foreground">
                    Mention which role interests you in your email subject or body. 
                    If you're open to multiple roles, let us know.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Tips Section */}
          <section className="mb-12">
            <div className="border-l-4 border-primary pl-6 py-4">
              <h3 className="font-semibold mb-2">Tips for a Strong Application</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Keep your showreel under 2-3 minutes with your best work first</li>
                <li>• Be clear about your role in team projects</li>
                <li>• Show work relevant to the position you're applying for</li>
                <li>• Include any breakdowns if you have them</li>
              </ul>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <a href="mailto:Hiring@neotrix.asia">
              <Button size="lg" className="text-lg px-8">
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
