import { useEffect, useState } from "react";
import { ArrowUpRight, Briefcase, Edit2, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal } from "@/components/Motion";
import { Seo } from "@/components/Seo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface JobOpening {
  id: string; title: string; subtitle: string | null; description: string | null;
  responsibilities: string[] | null; requirements: string[] | null; traits: string[] | null;
  sort_order: number | null; is_active: boolean | null;
}

const JoinUs = () => {
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { isAdmin } = useAuth();
  useEffect(() => {
    let active = true;
    void supabase.from("job_openings").select("*").eq("is_active", true).order("sort_order").then(({ data, error: fetchError }) => {
      if (!active) return;
      setJobs((data || []) as JobOpening[]);
      setError(Boolean(fetchError));
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  return (
    <>
      <Seo title="Careers at Neotrix" description="Join Neotrix in Jakarta and help build ambitious 3D animation, VFX, and product-film work." path="/join-us" />
      <section className="page-wrap pb-24 pt-32 sm:pt-40 lg:pb-36">
        <Reveal><p className="eyebrow">Careers / Jakarta</p><h1 className="mt-6 max-w-[11ch] text-[clamp(4rem,10.5vw,10.5rem)] font-medium leading-[.84] tracking-[-0.072em]">Build strange, beautiful things.</h1></Reveal>
        <div className="mt-16 grid gap-10 border-t border-white/10 pt-10 lg:grid-cols-[.6fr_1.4fr]"><p className="eyebrow">Life at Neotrix</p><div><p className="max-w-4xl text-[clamp(2rem,4vw,4.5rem)] font-medium leading-[1.03] tracking-[-0.05em]">Small team. High ownership. Real projects. No ego theatre.</p><div className="mt-10 grid gap-3 sm:grid-cols-2">{["Clarity over chaos", "Craft over convention", "Systems that help artists", "Responsibility with trust"].map((item, index) => <div key={item} className="flex items-center gap-4 border-t border-white/10 py-4"><span className="font-mono text-[9px] text-[#B8FF35]">0{index + 1}</span><span className="text-white/65">{item}</span></div>)}</div></div></div>
      </section>
      <section className="border-y border-white/10 bg-[#101214] py-20 sm:py-28">
        <div className="page-wrap">
          <div className="mb-10 flex items-end justify-between"><div><p className="eyebrow">Open positions</p><h2 className="mt-3 text-5xl font-medium tracking-[-0.055em] sm:text-7xl">Come make the work.</h2></div>{isAdmin && <Link to="/admin?tab=jobs" className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs"><Edit2 className="size-3.5" /> Manage</Link>}</div>
          {loading && <div className="space-y-3">{[1, 2].map((item) => <div key={item} className="h-24 animate-pulse rounded-2xl bg-white/5" />)}</div>}
          {!loading && error && <div className="rounded-[1.5rem] border border-white/10 p-8"><p className="text-xl">Open roles are temporarily unavailable.</p><p className="mt-2 text-white/45">You can still send an open application below.</p></div>}
          {!loading && !error && jobs.length === 0 && <div className="rounded-[1.5rem] border border-white/10 p-8"><Briefcase className="size-5 text-white/40" /><p className="mt-5 text-2xl">No published roles today.</p><p className="mt-2 text-white/45">Great portfolios are always welcome.</p></div>}
          {!loading && !error && jobs.length > 0 && (
            <Accordion type="single" collapsible className="divide-y divide-white/10 border-y border-white/10">
              {jobs.map((job, index) => (
                <AccordionItem key={job.id} value={job.id} className="border-0">
                  <AccordionTrigger className="group py-7 text-left hover:no-underline sm:py-9"><div className="grid w-full grid-cols-[2rem_1fr] items-center gap-3 pr-4 sm:grid-cols-[4rem_1fr_auto]"><span className="font-mono text-[9px] text-[#B8FF35]">{String(index + 1).padStart(2, "0")}</span><span className="text-2xl font-medium tracking-[-0.035em] text-white sm:text-4xl">{job.title}</span><span className="hidden font-mono text-[9px] uppercase tracking-[0.14em] text-white/35 sm:block">{job.subtitle}</span></div></AccordionTrigger>
                  <AccordionContent className="pb-10 pl-8 sm:pl-16">
                    <div className="grid gap-9 lg:grid-cols-[1fr_1.2fr]"><p className="max-w-xl text-lg leading-relaxed text-white/58">{job.description}</p><div className="grid gap-8 sm:grid-cols-2">{[["What you’ll do", job.responsibilities], ["What you bring", job.requirements], ["Who you are", job.traits]].map(([title, items]) => Array.isArray(items) && items.length > 0 && <div key={String(title)}><h3 className="eyebrow">{title}</h3><ul className="mt-4 space-y-3">{items.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/55"><Plus className="mt-1 size-3 shrink-0 text-[#7DEBFF]" />{item}</li>)}</ul></div>)}</div></div>
                    <Link to="/hiring" className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#F4F0E8] px-5 py-3 text-sm font-semibold text-black">Apply for this role <ArrowUpRight className="size-3.5" /></Link>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </section>
      <section className="page-wrap py-20 sm:py-28"><Link to="/hiring" className="group flex items-center justify-between gap-8 rounded-[1.75rem] bg-[#7DEBFF] p-7 text-black sm:p-10"><div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/45">No exact role?</p><p className="mt-3 text-[clamp(2.5rem,6vw,6rem)] font-medium leading-[.9] tracking-[-0.06em]">Send an open application.</p></div><ArrowUpRight className="size-8 transition-transform group-hover:rotate-45 sm:size-12" /></Link></section>
    </>
  );
};

export default JoinUs;
