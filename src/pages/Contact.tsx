import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/Header";
import { ArrowLeft, ArrowRight, CalendarIcon, Check } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useContacts } from "@/contexts/ContactsContext";
const ROLES = ["Founder / Business Owner", "Marketing / Brand Team", "Agency / Studio", "Individual Creator", "Other"];
const PROJECT_STATUS = [{
  value: "have_project",
  label: "I already have a project in mind"
}, {
  value: "not_sure",
  label: "I'm not sure yet"
}, {
  value: "discuss",
  label: "Just want to discuss first"
}];
const VIDEO_VERSIONS = ["1", "2", "3", "4", "5", ">5"];
const VIDEO_DURATIONS = ["15s", "30s", "45s", "60s", "90s", "120s", "Others"];
export const Contact = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const {
    addContact
  } = useContacts();
  const [location, setLocation] = useState("Unknown");
  const [savedContactId, setSavedContactId] = useState<string | null>(null);

  // Form data
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [otherRole, setOtherRole] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [hasDeck, setHasDeck] = useState<boolean | null>(null);
  const [deckLink, setDeckLink] = useState("");
  const [videoVersions, setVideoVersions] = useState("");
  const [videoDuration, setVideoDuration] = useState("");
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>();
  const [startDate, setStartDate] = useState<Date | undefined>();

  // Get user location on mount
  useEffect(() => {
    fetch("https://ipapi.co/json/").then(res => res.json()).then(data => {
      if (data.city && data.country_name) {
        setLocation(`${data.city}, ${data.country_name}`);
      } else if (data.country_name) {
        setLocation(data.country_name);
      }
    }).catch(() => setLocation("Unknown"));
  }, []);
  const canProceedStep1 = role !== "" && (role !== "Other" || otherRole.trim() !== "");
  const canProceedStep2 = projectStatus !== "" && (projectStatus !== "have_project" || hasDeck !== null && (hasDeck === false || hasDeck === true && deckLink.trim() !== ""));
  const canProceedStep3 = videoVersions !== "" && videoDuration !== "";
  const canProceedStep4 = deliveryDate !== undefined || startDate !== undefined;
  const canProceedStep5 = name.trim() !== "";
  const saveContactSubmission = async (): Promise<string> => {
    const finalRole = role === "Other" ? otherRole : role;
    const contactId = Date.now().toString();
    try {
      await addContact({
        name,
        role: finalRole,
        projectStatus,
        hasDeck,
        deckLink,
        videoVersions,
        videoDuration,
        deliveryDate: deliveryDate ? deliveryDate.toISOString() : null,
        startDate: startDate ? startDate.toISOString() : null,
        location
      });
      setSavedContactId(contactId);
    } catch (error) {
      console.error('Failed to save contact:', error);
      // Still set the ID so the user can proceed to WhatsApp
      setSavedContactId(contactId);
    }
    return contactId;
  };
  const goToNextStep = async () => {
    if (currentStep < 6) {
      // Skip step 3 (video details) if user selected "not sure" or "discuss first"
      if (currentStep === 2 && (projectStatus === "not_sure" || projectStatus === "discuss")) {
        setCurrentStep(4); // Skip directly to timeline
      } else {
        // Save contact when going to final step (after name input - step 5)
        if (currentStep === 5) {
          await saveContactSubmission();
        }
        setCurrentStep(currentStep + 1);
      }
    }
  };
  const skipTimeline = () => {
    // Go to name step instead of thank you
    setCurrentStep(5);
  };
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      // If on step 4 and user skipped step 3, go back to step 2
      if (currentStep === 4 && (projectStatus === "not_sure" || projectStatus === "discuss")) {
        setCurrentStep(2);
      } else if (currentStep === 5 && (projectStatus === "not_sure" || projectStatus === "discuss")) {
        // If on name step and user skipped video details, check if they also skipped timeline
        setCurrentStep(4);
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };
  const generateWhatsAppMessage = () => {
    const finalRole = role === "Other" ? otherRole : role;
    
    // Build project description
    let projectDesc = "";
    if (projectStatus === "have_project") {
      projectDesc = "I already have a project in mind";
      if (hasDeck && deckLink) {
        projectDesc += ` and I have a deck ready`;
      }
    } else if (projectStatus === "not_sure") {
      projectDesc = "I'm not sure about my project yet, but I'd love to explore ideas with you";
    } else if (projectStatus === "discuss") {
      projectDesc = "I'd like to discuss possibilities first before diving into specifics";
    }

    // Build video details if provided
    let videoDetails = "";
    if (videoVersions && videoDuration) {
      videoDetails = `\n\nFor the video, I'm looking at ${videoVersions} version(s) with a duration of ${videoDuration}.`;
    }

    // Build timeline details
    let timelineDetails = "";
    if (deliveryDate || startDate) {
      const parts = [];
      if (deliveryDate) parts.push(`delivery by ${format(deliveryDate, "MMMM d, yyyy")}`);
      if (startDate) parts.push(`starting around ${format(startDate, "MMMM d, yyyy")}`);
      timelineDetails = `\n\nTimeline-wise, I'm thinking ${parts.join(" and ")}.`;
    }

    const message = `Hi! My name is ${name} and I'm a ${finalRole}. ${projectDesc}.${videoDetails}${timelineDetails}\n\nLooking forward to hearing from you!`;
    
    return encodeURIComponent(message);
  };
  const openWhatsApp = () => {
    if (!savedContactId) return;
    const message = generateWhatsAppMessage();
    const waLink = `https://wa.me/6287797681961?text=${message}`;

    // Create a temporary anchor to force the exact URL
    const a = document.createElement("a");
    a.href = waLink;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.click();
  };
  return <div className="min-h-screen bg-black relative overflow-auto">
      <Header />

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-r from-blue-500/25 to-cyan-400/25 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/25 to-indigo-400/25 rounded-full blur-2xl animate-pulse" style={{
        animationDelay: "2s"
      }} />
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-gradient-to-r from-cyan-400/15 to-blue-400/15 rounded-full blur-2xl animate-pulse" style={{
        animationDelay: "1s"
      }} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-xl">
          {/* Progress Indicator */}
          <div className="flex justify-center gap-2 mb-8">
            {[0, 1, 2, 3, 4, 5, 6].map(step => <div key={step} className={cn("w-2 h-2 rounded-full transition-all duration-300", currentStep >= step ? "bg-white w-8" : "bg-white/30")} />)}
          </div>

          {/* Form Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-2xl">
            {/* Step 0 - Introduction */}
            {currentStep === 0 && <div className="text-center space-y-6 animate-fade-in">
                <h1 className="text-2xl md:text-3xl font-bold text-white">Let's understand what you're trying to build</h1>
                <p className="text-white/70 text-lg">This will only take ~1 minutes.</p>
                <Button onClick={goToNextStep} className="mt-8 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105">
                  Start Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>}

            {/* Step 1 - Role Selection */}
            {currentStep === 1 && <div className="space-y-6 animate-fade-in">
                <div className="space-y-2">
                  <label className="text-white font-medium text-lg">Which best describes you?</label>
                  <div className="grid grid-cols-1 gap-2">
                    {ROLES.map(r => <Button key={r} variant="outline" onClick={() => setRole(r)} className={cn("justify-start text-left h-auto py-3 px-4 rounded-xl transition-all duration-300", role === r ? "bg-white/20 border-white/40 text-white" : "bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:text-white")}>
                        {role === r && <Check className="w-4 h-4 mr-2 flex-shrink-0" />}
                        {r}
                      </Button>)}
                  </div>

                  {role === "Other" && <Input value={otherRole} onChange={e => setOtherRole(e.target.value)} placeholder="Please specify..." className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl h-12" />}
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="ghost" onClick={goToPreviousStep} className="text-white/70 hover:text-white hover:bg-white/10 rounded-full">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back
                  </Button>
                  <Button onClick={goToNextStep} disabled={!canProceedStep1} className={cn("rounded-full px-6 transition-all duration-300", canProceedStep1 ? "bg-green-500 hover:bg-green-600 text-white" : "bg-white/20 text-white/50 cursor-not-allowed")}>
                    Next
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>}

            {/* Step 2 - Project Status */}
            {currentStep === 2 && <div className="space-y-6 animate-fade-in">
                <div className="space-y-2">
                  <label className="text-white font-medium text-lg">Do you come here with a project already?</label>
                  <div className="grid grid-cols-1 gap-2">
                    {PROJECT_STATUS.map(status => <Button key={status.value} variant="outline" onClick={() => {
                  setProjectStatus(status.value);
                  if (status.value !== "have_project") {
                    setHasDeck(null);
                    setDeckLink("");
                  }
                }} className={cn("justify-start text-left h-auto py-3 px-4 rounded-xl transition-all duration-300", projectStatus === status.value ? "bg-white/20 border-white/40 text-white" : "bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:text-white")}>
                        {projectStatus === status.value && <Check className="w-4 h-4 mr-2 flex-shrink-0" />}
                        {status.label}
                      </Button>)}
                  </div>
                </div>

                {projectStatus === "have_project" && <div className="space-y-4 animate-fade-in">
                    <label className="text-white font-medium">Do you have a deck / storyboard already?</label>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setHasDeck(true)} className={cn("flex-1 rounded-xl transition-all duration-300", hasDeck === true ? "bg-white/20 border-white/40 text-white" : "bg-white/5 border-white/20 text-white/70 hover:bg-white/10")}>
                        {hasDeck === true && <Check className="w-4 h-4 mr-2" />}
                        Yes
                      </Button>
                      <Button variant="outline" onClick={() => {
                  setHasDeck(false);
                  setDeckLink("");
                }} className={cn("flex-1 rounded-xl transition-all duration-300", hasDeck === false ? "bg-white/20 border-white/40 text-white" : "bg-white/5 border-white/20 text-white/70 hover:bg-white/10")}>
                        {hasDeck === false && <Check className="w-4 h-4 mr-2" />}
                        No
                      </Button>
                    </div>

                    {hasDeck === true && <Input value={deckLink} onChange={e => setDeckLink(e.target.value)} placeholder="Paste your deck/storyboard link here..." className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl h-12 animate-fade-in" />}
                  </div>}

                <div className="flex justify-between pt-4">
                  <Button variant="ghost" onClick={goToPreviousStep} className="text-white/70 hover:text-white hover:bg-white/10 rounded-full">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back
                  </Button>
                  <Button onClick={goToNextStep} disabled={!canProceedStep2} className={cn("rounded-full px-6 transition-all duration-300", canProceedStep2 ? "bg-green-500 hover:bg-green-600 text-white" : "bg-white/20 text-white/50 cursor-not-allowed")}>
                    Next
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>}

            {/* Step 3 - Video Details */}
            {currentStep === 3 && <div className="space-y-6 animate-fade-in">
                <div className="space-y-2">
                  <label className="text-white font-medium">How many video versions are there?</label>
                  <Select value={videoVersions} onValueChange={setVideoVersions}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-xl h-12">
                      <SelectValue placeholder="Select number of versions" />
                    </SelectTrigger>
                    <SelectContent>
                      {VIDEO_VERSIONS.map(v => <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-white font-medium">What's the duration of the videos?</label>
                  <Select value={videoDuration} onValueChange={setVideoDuration}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-xl h-12">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {VIDEO_DURATIONS.map(d => <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="ghost" onClick={goToPreviousStep} className="text-white/70 hover:text-white hover:bg-white/10 rounded-full">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back
                  </Button>
                  <Button onClick={goToNextStep} disabled={!canProceedStep3} className={cn("rounded-full px-6 transition-all duration-300", canProceedStep3 ? "bg-green-500 hover:bg-green-600 text-white" : "bg-white/20 text-white/50 cursor-not-allowed")}>
                    Next
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>}

            {/* Step 4 - Timeline */}
            {currentStep === 4 && <div className="space-y-6 animate-fade-in">
                <div className="space-y-2">
                  <label className="text-white font-medium">When do you need it to be delivered?</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal h-12 rounded-xl", "bg-white/10 border-white/20 hover:bg-white/20", !deliveryDate && "text-white/50")}>
                        <CalendarIcon className="mr-2 h-4 w-4 text-white" />
                        <span className="text-white">
                          {deliveryDate ? format(deliveryDate, "PPP") : "Pick a delivery date"}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-[#1a1a2e] border-white/20" align="start">
                      <Calendar mode="single" selected={deliveryDate} onSelect={setDeliveryDate} initialFocus className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-white font-medium">When can we start?</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal h-12 rounded-xl", "bg-white/10 border-white/20 hover:bg-white/20", !startDate && "text-white/50")}>
                        <CalendarIcon className="mr-2 h-4 w-4 text-white" />
                        <span className="text-white">{startDate ? format(startDate, "PPP") : "Pick a start date"}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-[#1a1a2e] border-white/20" align="start">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex flex-col gap-4 pt-4">
                  <div className="flex justify-between">
                    <Button variant="ghost" onClick={goToPreviousStep} className="text-white/70 hover:text-white hover:bg-white/10 rounded-full">
                      <ArrowLeft className="mr-2 w-4 h-4" />
                      Back
                    </Button>
                    <Button onClick={goToNextStep} disabled={!canProceedStep4} className={cn("rounded-full px-6 transition-all duration-300", canProceedStep4 ? "bg-green-500 hover:bg-green-600 text-white" : "bg-white/20 text-white/50 cursor-not-allowed")}>
                      Next
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                  <Button variant="ghost" onClick={skipTimeline} className="text-white/50 hover:text-white hover:bg-white/10 rounded-full text-sm">
                    No timelines yet
                  </Button>
                </div>
              </div>}

            {/* Step 5 - Name (Last step before thank you) */}
            {currentStep === 5 && <div className="space-y-6 animate-fade-in">
                <div className="space-y-2">
                  <label className="text-white font-medium text-lg">Almost there! Who should we call you?</label>
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl h-12" />
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="ghost" onClick={goToPreviousStep} className="text-white/70 hover:text-white hover:bg-white/10 rounded-full">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back
                  </Button>
                  <Button onClick={goToNextStep} disabled={!canProceedStep5} className={cn("rounded-full px-6 transition-all duration-300", canProceedStep5 ? "bg-green-500 hover:bg-green-600 text-white" : "bg-white/20 text-white/50 cursor-not-allowed")}>
                    Submit
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>}

            {/* Step 6 - Thank You */}
            {currentStep === 6 && <div className="text-center space-y-6 animate-fade-in">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Thank you, {name}!</h1>
                <p className="text-white/70 text-lg">Click the button below to contact our producer right now.</p>
                <Button onClick={openWhatsApp} className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 md:px-8 py-6 text-sm md:text-lg rounded-full transition-all duration-300 hover:scale-105 w-full md:w-auto">
                  <span className="truncate">Contact Producer on WhatsApp</span>
                  <ArrowRight className="ml-2 w-5 h-5 flex-shrink-0" />
                </Button>
                <Button variant="ghost" onClick={() => setCurrentStep(0)} className="text-white/50 hover:text-white hover:bg-white/10 rounded-full">
                  Start Over
                </Button>
              </div>}
          </div>
        </div>
      </div>
    </div>;
};
export default Contact;