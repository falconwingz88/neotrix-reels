import { ArrowLeft, ArrowUpRight, FileText, Mail, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal } from "@/components/Motion";
import { Seo } from "@/components/Seo";

const requirements = [
  { icon: FileText, title: "CV / Resume", copy: "A concise PDF with relevant experience, education, tools, and the kind of work you want to do." },
  { icon: Video, title: "Showreel / Portfolio", copy: "Lead with your strongest work. Tell us clearly what you owned on collaborative pieces." },
  { icon: Mail, title: "A short note", copy: "Name the role, what interests you about Neotrix, and where you want your craft to grow." },
];

const Hiring = () => (
  <>
    <Seo title="Apply to Neotrix" description="Application guidance for creative and production roles at Neotrix." path="/hiring" />
    <section className="page-wrap pb-24 pt-32 sm:pt-40 lg:pb-36">
      <Link to="/join-us" className="group inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/45 hover:text-white"><ArrowLeft className="size-3 transition-transform group-hover:-translate-x-1" /> Back to careers</Link>
      <Reveal><p className="eyebrow mt-16">Applications / Read first</p><h1 className="mt-5 max-w-[10ch] text-[clamp(4.5rem,11vw,11rem)] font-medium leading-[.82] tracking-[-0.072em]">Show us how you think.</h1></Reveal>
      <div className="mt-16 grid gap-10 border-t border-white/10 pt-10 lg:grid-cols-[.6fr_1.4fr]"><p className="eyebrow">What to send</p><div className="divide-y divide-white/10 border-y border-white/10">{requirements.map((item, index) => <Reveal key={item.title} className="grid gap-5 py-8 sm:grid-cols-[3rem_.7fr_1fr] sm:py-10"><span className="font-mono text-[9px] text-[#B8FF35]">0{index + 1}</span><h2 className="flex items-center gap-3 text-2xl tracking-[-0.035em]"><item.icon className="size-4 text-[#7DEBFF]" />{item.title}</h2><p className="leading-relaxed text-white/50">{item.copy}</p></Reveal>)}</div></div>
      <div className="mt-20 rounded-[1.75rem] bg-[#F4F0E8] p-7 text-black sm:p-12"><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/45">Application inbox</p><a href="mailto:Hiring@neotrix.asia?subject=Application%20to%20Neotrix" className="group mt-6 flex items-end justify-between gap-5"><span className="break-all text-[clamp(2.3rem,7vw,7rem)] font-medium leading-[.9] tracking-[-0.06em]">Hiring@neotrix.asia</span><ArrowUpRight className="mb-1 size-8 shrink-0 transition-transform group-hover:rotate-45 sm:mb-3 sm:size-12" /></a></div>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">{["Best work first", "Show your role", "Keep it under 3 minutes"].map((tip, index) => <div key={tip} className="rounded-[1.25rem] border border-white/10 p-5"><span className="font-mono text-[9px] text-white/25">TIP 0{index + 1}</span><p className="mt-8 text-lg">{tip}</p></div>)}</div>
    </section>
  </>
);

export default Hiring;
