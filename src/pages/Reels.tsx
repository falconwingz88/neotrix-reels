import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Motion";
import { Seo } from "@/components/Seo";
import { YouTubeFacade } from "@/components/YouTubeFacade";

const reels = [
  { title: "Neotrix Studio Reel", subtitle: "Full-spectrum 3D / VFX", url: "https://youtu.be/LP5ybY7O2zc", accent: "#B8FF35" },
];

const Reels = () => (
  <>
    <Seo title="Studio Reel" description="Watch the Neotrix studio reel: commercial 3D animation, VFX, character, and product-film work." path="/reels" />
    <section className="page-wrap pb-24 pt-32 sm:pt-40 lg:pb-36">
      <div className="grid gap-8 lg:grid-cols-[1.4fr_.6fr] lg:items-end">
        <div><p className="eyebrow">Moving-image index</p><h1 className="mt-5 text-[clamp(4.5rem,13vw,13rem)] font-medium leading-[.78] tracking-[-0.075em]">Reels<span className="text-[#B8FF35]">.</span></h1></div>
        <p className="max-w-md pb-3 text-lg leading-relaxed text-white/55">A fast route through the craft: character, VFX, product, lighting, and motion.</p>
      </div>
      <div className="mt-16 space-y-20 sm:mt-24 sm:space-y-28">
        {reels.map((reel, index) => (
          <Reveal key={reel.title}>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div><p className="font-mono text-[9px] uppercase tracking-[0.18em]" style={{ color: reel.accent }}>0{index + 1} / Reel</p><h2 className="mt-2 text-3xl font-medium tracking-[-0.04em] sm:text-5xl">{reel.title}</h2></div>
              <p className="hidden font-mono text-[9px] uppercase tracking-[0.15em] text-white/35 sm:block">{reel.subtitle}</p>
            </div>
            <YouTubeFacade url={reel.url} title={reel.title} hero={index === 0} autoplayWhenVisible={index === 0} className="rounded-[1.35rem] sm:rounded-[2.2rem]" />
          </Reveal>
        ))}
      </div>
    </section>
    <Link to="/contact" className="group flex items-center justify-between border-y border-black/10 bg-[#F4F0E8] px-5 py-16 text-black sm:px-10 sm:py-24">
      <span className="text-[clamp(2.8rem,8vw,8rem)] font-medium leading-none tracking-[-0.065em]">Bring us a brief.</span><ArrowUpRight className="size-8 transition-transform group-hover:rotate-45 sm:size-14" />
    </Link>
  </>
);

export default Reels;
