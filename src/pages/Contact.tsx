import { useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Loader2, MessageCircle } from "lucide-react";
import { Seo } from "@/components/Seo";
import { useContacts } from "@/contexts/ContactsContext";
import { createInquirySubmissionGuard, hasContactErrors, normalizePhone, validateContactDetails, type ContactDetails, type ContactErrors } from "@/lib/inquiry";

const roles = ["Founder / Business Owner", "Marketing / Brand Team", "Agency / Studio", "Individual Creator", "Other"];
const statuses = [
  { value: "have_project", label: "I already have a project in mind" },
  { value: "not_sure", label: "I’m not sure yet" },
  { value: "discuss", label: "Just want to discuss first" },
];
const versions = ["1", "2", "3", "4", "5", ">5"];
const durations = ["15s", "30s", "45s", "60s", "90s", "120s", "Others"];

const SelectButton = ({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) => (
  <button type="button" onClick={onClick} aria-pressed={active} className={"flex w-full items-center justify-between rounded-[1rem] border px-4 py-4 text-left text-sm transition-colors sm:px-5 " + (active ? "border-[#B8FF35] bg-[#B8FF35] text-black" : "border-white/12 bg-white/[.025] text-white/65 hover:border-white/35 hover:text-white")}>
    {children}{active && <Check className="size-4 shrink-0" />}
  </button>
);

const FieldError = ({ children }: { children?: string }) => children ? <p className="mt-2 text-xs text-[#FF8C82]" role="alert">{children}</p> : null;

const Contact = () => {
  const { addContact } = useContacts();
  const submissionKey = useRef(crypto.randomUUID());
  const submissionGuard = useRef(createInquirySubmissionGuard());
  const [step, setStep] = useState(0);
  const [role, setRole] = useState("");
  const [otherRole, setOtherRole] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [hasDeck, setHasDeck] = useState<boolean | null>(null);
  const [deckLink, setDeckLink] = useState("");
  const [videoVersions, setVideoVersions] = useState("");
  const [videoDuration, setVideoDuration] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [details, setDetails] = useState<ContactDetails>({ name: "", company: "", email: "", phone: "" });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [savedContactId, setSavedContactId] = useState("");
  const finalRole = role === "Other" ? otherRole.trim() : role;
  const progress = Math.round((step / 6) * 100);
  const location = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown", []);

  const canContinue =
    step === 0 ||
    (step === 1 && Boolean(finalRole)) ||
    (step === 2 && Boolean(projectStatus) && (projectStatus !== "have_project" || (hasDeck !== null && (!hasDeck || Boolean(deckLink.trim()))))) ||
    (step === 3 && Boolean(videoVersions && videoDuration)) ||
    step === 4;

  const next = () => {
    if (!canContinue) return;
    if (step === 2 && projectStatus !== "have_project") setStep(4);
    else setStep((current) => Math.min(current + 1, 6));
  };

  const back = () => {
    if (step === 4 && projectStatus !== "have_project") setStep(2);
    else setStep((current) => Math.max(current - 1, 0));
  };

  const submit = async () => {
    if (submitting || savedContactId) return;
    const nextErrors = validateContactDetails(details);
    setErrors(nextErrors);
    if (hasContactErrors(nextErrors)) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const id = await submissionGuard.current.submit(submissionKey.current, () => addContact({
        ...details,
        phone: normalizePhone(details.phone),
        role: finalRole,
        projectStatus,
        hasDeck,
        deckLink,
        videoVersions,
        videoDuration,
        deliveryDate: deliveryDate || null,
        startDate: startDate || null,
        location,
        submissionKey: submissionKey.current,
      }, submissionKey.current));
      setSavedContactId(id);
      setStep(6);
    } catch (error) {
      console.error("Inquiry submission failed:", error);
      setSubmitError("Your inquiry was not saved. Check your connection and try again—your answers are still here.");
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    "Hi Neotrix, I’m " + details.name + (details.company ? " from " + details.company : "") + ". " +
    (projectStatus === "have_project" ? "I have a project in mind" : projectStatus === "not_sure" ? "I’d like to explore an idea" : "I’d like to discuss a possible project") +
    (videoVersions && videoDuration ? " for " + videoVersions + " version(s) at " + videoDuration + "." : "."),
  );
  const openWhatsApp = () => {
    if (!savedContactId) return;
    window.open("https://wa.me/6287797681961?text=" + whatsappMessage, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Seo title="Start a Project" description="Tell Neotrix about your commercial 3D animation, VFX, character, or product-film brief." path="/contact" />
      <section className="noise relative min-h-[100svh] overflow-hidden pb-20 pt-28 sm:pt-36">
        <div aria-hidden className="absolute -right-48 top-20 size-[36rem] rounded-full bg-[#7DEBFF]/10 blur-[140px]" />
        <div className="page-wrap relative z-10 grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
          <div className="lg:sticky lg:top-32">
            <p className="eyebrow">New inquiry / About 2 minutes</p>
            <h1 className="mt-6 max-w-[8ch] text-[clamp(4rem,8vw,8.4rem)] font-medium leading-[.84] tracking-[-0.07em]">Let’s build the right frame.</h1>
            <p className="mt-8 max-w-md text-base leading-relaxed text-white/50">A few questions help us understand the ambition, production shape, and timing before we speak.</p>
            <div className="mt-12 hidden border-t border-white/10 pt-4 font-mono text-[9px] uppercase tracking-[0.16em] text-white/32 lg:flex lg:justify-between"><span>Step {String(Math.min(step + 1, 7)).padStart(2, "0")} / 07</span><span>{progress}%</span></div>
          </div>

          <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#111315]/85 shadow-2xl backdrop-blur-xl sm:rounded-[2rem]">
            <div className="h-1 bg-white/5"><div className="h-full bg-gradient-to-r from-[#7DEBFF] to-[#B8FF35] transition-[width] duration-500" style={{ width: progress + "%" }} /></div>
            <div className="min-h-[34rem] p-6 sm:p-10 lg:p-12">
              {step === 0 && (
                <div className="flex min-h-[28rem] flex-col justify-between">
                  <div><span className="grid size-14 place-items-center rounded-full border border-white/12 font-mono text-xs text-[#B8FF35]">01</span><h2 className="mt-10 max-w-lg text-4xl font-medium leading-[1.02] tracking-[-0.05em] sm:text-6xl">Let’s understand what you’re trying to build.</h2><p className="mt-5 text-white/45">No long brief required. Rough ideas are welcome.</p></div>
                  <button onClick={next} className="mt-10 flex w-fit items-center gap-3 rounded-full bg-[#B8FF35] px-6 py-3.5 text-sm font-semibold text-black">Start now <ArrowRight className="size-4" /></button>
                </div>
              )}

              {step === 1 && (
                <div><p className="eyebrow">01 / You</p><h2 className="mt-4 text-3xl font-medium tracking-[-0.045em] sm:text-5xl">Which best describes you?</h2><div className="mt-8 grid gap-2 sm:grid-cols-2">{roles.map((item) => <SelectButton key={item} active={role === item} onClick={() => setRole(item)}>{item}</SelectButton>)}</div>{role === "Other" && <div className="mt-4"><label htmlFor="other-role" className="sr-only">Your role</label><input id="other-role" value={otherRole} onChange={(event) => setOtherRole(event.target.value)} placeholder="Tell us your role" className="w-full rounded-[1rem] border border-white/12 bg-transparent px-4 py-4 text-white placeholder:text-white/30 focus:border-[#7DEBFF]" /></div>}</div>
              )}

              {step === 2 && (
                <div><p className="eyebrow">02 / Project status</p><h2 className="mt-4 text-3xl font-medium tracking-[-0.045em] sm:text-5xl">Do you come here with a project already?</h2><div className="mt-8 grid gap-2">{statuses.map((item) => <SelectButton key={item.value} active={projectStatus === item.value} onClick={() => { setProjectStatus(item.value); if (item.value !== "have_project") { setHasDeck(null); setDeckLink(""); } }}>{item.label}</SelectButton>)}</div>{projectStatus === "have_project" && <div className="mt-8 border-t border-white/10 pt-7"><p className="mb-3 text-sm text-white/60">Do you have a deck / storyboard already?</p><div className="grid grid-cols-2 gap-2"><SelectButton active={hasDeck === true} onClick={() => setHasDeck(true)}>Yes</SelectButton><SelectButton active={hasDeck === false} onClick={() => { setHasDeck(false); setDeckLink(""); }}>Not yet</SelectButton></div>{hasDeck && <input value={deckLink} onChange={(event) => setDeckLink(event.target.value)} placeholder="Paste your deck or storyboard link" aria-label="Deck or storyboard link" className="mt-3 w-full rounded-[1rem] border border-white/12 bg-transparent px-4 py-4 text-white placeholder:text-white/30 focus:border-[#7DEBFF]" />}</div>}</div>
              )}

              {step === 3 && (
                <div><p className="eyebrow">03 / Format</p><h2 className="mt-4 text-3xl font-medium tracking-[-0.045em] sm:text-5xl">What are we making?</h2><div className="mt-8 grid gap-8 sm:grid-cols-2"><div><label htmlFor="versions" className="mb-3 block text-sm text-white/55">How many video versions are there?</label><select id="versions" value={videoVersions} onChange={(event) => setVideoVersions(event.target.value)} className="w-full rounded-[1rem] border border-white/12 bg-[#111315] px-4 py-4 text-white"><option value="">Select versions</option>{versions.map((item) => <option key={item} value={item}>{item}</option>)}</select></div><div><label htmlFor="duration" className="mb-3 block text-sm text-white/55">What’s the duration of the videos?</label><select id="duration" value={videoDuration} onChange={(event) => setVideoDuration(event.target.value)} className="w-full rounded-[1rem] border border-white/12 bg-[#111315] px-4 py-4 text-white"><option value="">Select duration</option>{durations.map((item) => <option key={item} value={item}>{item}</option>)}</select></div></div></div>
              )}

              {step === 4 && (
                <div><p className="eyebrow">04 / Timing</p><h2 className="mt-4 text-3xl font-medium tracking-[-0.045em] sm:text-5xl">When does this need to move?</h2><div className="mt-8 grid gap-6 sm:grid-cols-2"><div><label htmlFor="delivery-date" className="mb-3 block text-sm text-white/55">When do you need it delivered?</label><input id="delivery-date" type="date" value={deliveryDate} onChange={(event) => setDeliveryDate(event.target.value)} className="w-full rounded-[1rem] border border-white/12 bg-[#111315] px-4 py-4 text-white [color-scheme:dark]" /></div><div><label htmlFor="start-date" className="mb-3 block text-sm text-white/55">When can the project start?</label><input id="start-date" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="w-full rounded-[1rem] border border-white/12 bg-[#111315] px-4 py-4 text-white [color-scheme:dark]" /></div></div><button onClick={() => setStep(5)} className="mt-6 font-mono text-[9px] uppercase tracking-[0.16em] text-white/38 hover:text-white">I don’t know yet — skip timing</button></div>
              )}

              {step === 5 && (
                <div><p className="eyebrow">05 / Contact details</p><h2 className="mt-4 text-3xl font-medium tracking-[-0.045em] sm:text-5xl">Where should we reach you?</h2><div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <div><label htmlFor="contact-name" className="mb-2 block text-xs text-white/50">Name *</label><input id="contact-name" autoComplete="name" value={details.name} onChange={(event) => setDetails({ ...details, name: event.target.value })} className="w-full rounded-[1rem] border border-white/12 bg-transparent px-4 py-4 text-white focus:border-[#7DEBFF]" /><FieldError>{errors.name}</FieldError></div>
                  <div><label htmlFor="company" className="mb-2 block text-xs text-white/50">Company</label><input id="company" autoComplete="organization" value={details.company} onChange={(event) => setDetails({ ...details, company: event.target.value })} className="w-full rounded-[1rem] border border-white/12 bg-transparent px-4 py-4 text-white focus:border-[#7DEBFF]" /><FieldError>{errors.company}</FieldError></div>
                  <div><label htmlFor="email" className="mb-2 block text-xs text-white/50">Email</label><input id="email" type="email" autoComplete="email" value={details.email} onChange={(event) => setDetails({ ...details, email: event.target.value })} className="w-full rounded-[1rem] border border-white/12 bg-transparent px-4 py-4 text-white focus:border-[#7DEBFF]" /><FieldError>{errors.email}</FieldError></div>
                  <div><label htmlFor="phone" className="mb-2 block text-xs text-white/50">WhatsApp / Phone</label><input id="phone" type="tel" autoComplete="tel" value={details.phone} onChange={(event) => setDetails({ ...details, phone: event.target.value })} className="w-full rounded-[1rem] border border-white/12 bg-transparent px-4 py-4 text-white focus:border-[#7DEBFF]" /><FieldError>{errors.phone}</FieldError></div>
                </div><FieldError>{errors.contact}</FieldError>{submitError && <div className="mt-5 rounded-xl border border-[#FF8C82]/30 bg-[#FF8C82]/8 p-4 text-sm leading-relaxed text-[#FFB4AD]" role="alert">{submitError}</div>}</div>
              )}

              {step === 6 && (
                <div className="flex min-h-[28rem] flex-col justify-between"><div><span className="grid size-14 place-items-center rounded-full bg-[#B8FF35] text-black"><Check className="size-5" /></span><p className="eyebrow mt-10">Inquiry saved</p><h2 className="mt-4 max-w-xl text-4xl font-medium leading-[1.02] tracking-[-0.05em] sm:text-6xl">Your idea is in the room.</h2><p className="mt-5 max-w-md leading-relaxed text-white/50">We have your details and will follow up through the channel you provided. If you want to keep the momentum, continue on WhatsApp.</p></div><button onClick={openWhatsApp} disabled={!savedContactId} className="mt-10 flex w-fit items-center gap-3 rounded-full bg-[#B8FF35] px-6 py-3.5 text-sm font-semibold text-black disabled:opacity-40"><MessageCircle className="size-4" /> Continue on WhatsApp <ArrowUpRight className="size-4" /></button></div>
              )}

              {step > 0 && step < 6 && (
                <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-6">
                  <button type="button" onClick={back} className="flex items-center gap-2 text-sm text-white/45 hover:text-white"><ArrowLeft className="size-4" /> Back</button>
                  {step < 5 ? <button type="button" onClick={next} disabled={!canContinue} className="flex items-center gap-2 rounded-full bg-[#F4F0E8] px-5 py-3 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-30">Continue <ArrowRight className="size-4" /></button> : <button type="button" onClick={() => void submit()} disabled={submitting} className="flex items-center gap-2 rounded-full bg-[#B8FF35] px-5 py-3 text-sm font-semibold text-black disabled:opacity-50">{submitting ? <Loader2 className="size-4 animate-spin" /> : null}{submitting ? "Saving" : "Send inquiry"} {!submitting && <ArrowRight className="size-4" />}</button>}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
