import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ClientLogos, useClientLogos } from "@/components/ClientLogos";
import { Reveal } from "@/components/Motion";
import { WorkMontage } from "@/components/WorkMontage";
import { Seo } from "@/components/Seo";
import { StatsCounter } from "@/components/StatsCounter";
import { YouTubeFacade } from "@/components/YouTubeFacade";
import { useProjects } from "@/contexts/ProjectsContext";
import { publicProjects } from "@/lib/projects";

const REEL = "https://youtu.be/LP5ybY7O2zc";
const capabilities = ["3D Animation", "Visual Effects", "Character", "Product Film", "Liquid & Beauty", "Creative Technology"];

const Index = () => {
  const { customProjects, loading, error, refetch } = useProjects();
  const { logos, loading: logosLoading } = useClientLogos();
  const publicWork = publicProjects(customProjects);
  const projectCount = publicWork.length;
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, reduced ? 0 : 90]);

  return (
    <>
      <Seo
        title="Neotrix — Ideas, rendered unforgettable"
        description="Jakarta-based 3D animation, VFX, and product-film studio creating cinematic commercial work for brands worldwide."
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Neotrix",
          url: "https://motion.neotrix.asia",
          logo: "https://motion.neotrix.asia/og.png",
          email: "contact@neotrix.asia",
          address: { "@type": "PostalAddress", addressLocality: "Jakarta", addressCountry: "ID" },
          sameAs: ["https://instagram.com/neotrix.asia"],
        }}
      />

      <section className="noise relative overflow-hidden pb-8 pt-28 sm:pb-10 sm:pt-32">
        <div aria-hidden className="absolute -right-[12vw] top-[8vh] size-[44vw] min-h-80 min-w-80 rounded-full bg-[#7DEBFF]/13 blur-[130px]" />
        <div aria-hidden className="absolute -left-[8vw] bottom-[5vh] size-[34vw] min-h-64 min-w-64 rounded-full bg-[#B8FF35]/8 blur-[120px]" />
        <motion.div style={{ y: heroY }} className="page-wrap relative z-10">
          <div className="grid items-end gap-10 lg:grid-cols-[1.6fr_.7fr]">
            <div>
              <motion.p initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="eyebrow">
                Neotrix / Jakarta / 3D Production
              </motion.p>
              <h1 className="display-title mt-5 max-w-[12ch]">
                <span className="block">Ideas, rendered</span>
                <span className="block text-[#B8FF35]">unforgettable.</span>
              </h1>
            </div>
            <div className="pb-2 lg:pb-5">
              <p className="max-w-md text-lg leading-[1.35] text-[#F4F0E8]/66 sm:text-xl">
                A Jakarta-based commercial 3D animation, VFX, and product-film studio turning ambitious ideas into vivid moving worlds.
              </p>
            </div>
          </div>
          <div className="mt-9 flex items-end justify-between border-t border-white/10 pt-4 font-mono text-[9px] uppercase tracking-[0.16em] text-white/45 sm:mt-11">
            <span>Scroll to enter the work</span>
            <span className="flex items-center gap-2"><span className="pulse-line h-px w-12 bg-[#7DEBFF]" /><ArrowDown className="size-3" /></span>
          </div>
        </motion.div>
      </section>

      <section id="reel" className="page-wrap pb-10 pt-5 sm:pb-16 sm:pt-8">
        <Reveal>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="eyebrow">Studio reel / 2026</p>
              <h2 className="mt-3 text-3xl font-medium tracking-[-0.04em] sm:text-5xl">One minute. Every discipline.</h2>
            </div>
            <span className="hidden font-mono text-[9px] uppercase tracking-[0.16em] text-white/35 sm:block">Sound on for the full experience</span>
          </div>
          <YouTubeFacade url={REEL} title="Neotrix studio reel" hero autoplayWhenVisible className="rounded-[1.35rem] sm:rounded-[2.25rem]" />
        </Reveal>
      </section>

      <section className="overflow-hidden border-y border-white/10 py-5">
        <div className="ribbon-marquee flex w-max items-center">
          {[...capabilities, ...capabilities].map((item, index) => (
            <div key={item + index} className="flex items-center">
              <span className="px-5 text-[clamp(1.5rem,3vw,3.25rem)] font-medium tracking-[-0.04em]">{item}</span>
              <span className="text-[#B8FF35]">✦</span>
            </div>
          ))}
        </div>
      </section>

      <section className="page-wrap py-20 sm:py-28 lg:py-36">
        <div className="mb-12 grid gap-6 sm:mb-16 lg:grid-cols-[1fr_.75fr] lg:items-end">
          <Reveal>
            <p className="eyebrow">The archive / In motion</p>
            <h2 className="mt-4 max-w-4xl text-[clamp(3rem,7vw,7.4rem)] font-medium leading-[0.9] tracking-[-0.062em]">
              A lot of work.<br /><span className="text-white/35">One restless studio.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="lg:pb-2">
            <p className="max-w-lg text-base leading-relaxed text-white/54 sm:text-lg">
              No greatest hits and no narrow shortlist—just a glimpse into an expanding archive of moving images made across disciplines.
            </p>
          </Reveal>
        </div>

        {loading && (
          <div className="h-[32rem] animate-pulse rounded-[1.75rem] bg-white/6 sm:h-[40rem]" />
        )}
        {error && !loading && (
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8">
            <p className="text-white/65">{error}</p>
            <button onClick={() => void refetch()} className="mt-5 rounded-full bg-[#F4F0E8] px-5 py-3 text-sm font-semibold text-black">Try again</button>
          </div>
        )}
        {!loading && !error && (
          <WorkMontage projects={publicWork.slice(0, 18)} total={projectCount + 82} />
        )}
      </section>

      <ClientLogos logos={logos} />

      <section className="bg-[#101214]">
        <div className="page-wrap py-20 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
            <Reveal>
              <p className="eyebrow">The studio / Since 2019</p>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="text-[clamp(2.1rem,5vw,5.8rem)] font-medium leading-[.98] tracking-[-0.055em]">
                Built for ideas that need more than <span className="text-[#7DEBFF]">beautiful pixels.</span>
              </p>
              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                <p className="text-base leading-relaxed text-white/55">We unite direction, design, animation, VFX, lighting, and rendering in one agile team—giving bold commercial ideas a clear route from brief to final frame.</p>
                <Link to="/about-us" className="group flex items-start justify-between border-t border-white/14 pt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-white/65 hover:text-[#B8FF35]">
                  Meet Neotrix <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
        <StatsCounter projects={loading ? null : projectCount + 82} clients={logosLoading ? null : logos.length + 52} />
      </section>

      <section className="relative isolate overflow-hidden bg-[#B8FF35] px-5 py-24 text-black sm:px-8 sm:py-36 lg:px-10">
        <div aria-hidden className="absolute -right-24 -top-32 size-[34rem] rounded-full border-[90px] border-black/5" />
        <Reveal className="relative mx-auto max-w-[1480px]">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/70">Have a frame in mind?</p>
          <Link to="/contact" className="group mt-6 flex items-end justify-between gap-6">
            <h2 className="max-w-[11ch] text-[clamp(3.6rem,11vw,11rem)] font-medium leading-[.82] tracking-[-0.072em]">Let’s make it move.</h2>
            <span className="mb-2 grid size-16 shrink-0 place-items-center rounded-full bg-black text-[#B8FF35] transition-transform group-hover:rotate-45 sm:mb-5 sm:size-24"><ArrowUpRight className="size-6 sm:size-9" /></span>
          </Link>
        </Reveal>
      </section>
    </>
  );
};

export default Index;
