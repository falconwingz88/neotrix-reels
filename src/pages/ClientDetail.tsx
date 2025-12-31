import { useParams, useNavigate } from "react-router-dom";
import { useContacts } from "@/contexts/ContactsContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, User, Video, FileText, Clock } from "lucide-react";
import { format } from "date-fns";

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { contacts } = useContacts();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const contact = contacts.find((c) => c.id === id);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin-login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  if (!contact) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-white">Client Not Found</h1>
          <p className="text-white/60">This client data may have been deleted.</p>
          <Button onClick={() => navigate("/admin")} className="bg-white/10 hover:bg-white/20 text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const projectStatusLabel =
    contact.projectStatus === "have_project"
      ? "Has a project in mind"
      : contact.projectStatus === "not_sure"
        ? "Not sure yet"
        : contact.projectStatus === "discuss"
          ? "Just wants to discuss"
          : contact.projectStatus;

  const leadNumber = `LEAD-${contact.id.slice(-6).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin")}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <span className="text-xs font-mono text-white/40 bg-white/10 px-2 py-1 rounded">{leadNumber}</span>
          </div>
        </div>

        {/* Client Card */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8 space-y-6">
          {/* Name & Role */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">{contact.name}</h1>
            <div className="flex items-center gap-2 text-white/60">
              <User className="w-4 h-4" />
              <span>{contact.role}</span>
            </div>
          </div>

          {/* Location & Time */}
          <div className="flex flex-wrap gap-4 text-sm text-white/50">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{contact.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Submitted {format(new Date(contact.submittedAt), "PPP 'at' p")}</span>
            </div>
          </div>

          <hr className="border-white/10" />

          {/* Project Status */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider">Project Status</h2>
            <p className="text-white text-lg">{projectStatusLabel}</p>
            {contact.hasDeck !== null && (
              <div className="text-white/70">
                <FileText className="w-4 h-4 inline mr-2" />
                {contact.hasDeck ? "Has deck/storyboard" : "No deck/storyboard yet"}
              </div>
            )}
            {contact.deckLink && (
              <a
                href={contact.deckLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline block break-all"
              >
                {contact.deckLink}
              </a>
            )}
          </div>

          {/* Video Details */}
          {(contact.videoVersions || contact.videoDuration) && (
            <>
              <hr className="border-white/10" />
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider">Video Details</h2>
                <div className="flex items-center gap-2 text-white">
                  <Video className="w-4 h-4 text-white/60" />
                  <span>
                    {contact.videoVersions} version(s) • {contact.videoDuration}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Timeline */}
          {(contact.deliveryDate || contact.startDate) && (
            <>
              <hr className="border-white/10" />
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider">Timeline</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contact.deliveryDate && (
                    <div className="bg-white/5 rounded-xl p-4 space-y-1">
                      <div className="text-xs text-white/40 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Delivery Needed By
                      </div>
                      <div className="text-white font-medium">{format(new Date(contact.deliveryDate), "PPP")}</div>
                    </div>
                  )}
                  {contact.startDate && (
                    <div className="bg-white/5 rounded-xl p-4 space-y-1">
                      <div className="text-xs text-white/40 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Can Start From
                      </div>
                      <div className="text-white font-medium">{format(new Date(contact.startDate), "PPP")}</div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
