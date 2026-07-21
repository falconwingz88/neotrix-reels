import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { ProjectsBrowser } from "@/components/ProjectsBrowser";
import { Seo } from "@/components/Seo";

export const Projects = () => (
  <>
    <Seo title="Selected Work" description="Explore Neotrix commercial 3D animation, VFX, character, product-film, liquid, and beauty projects." path="/projects" />
    <section className="page-wrap pb-24 pt-32 sm:pt-40 lg:pb-36">
      <ProjectsBrowser />
    </section>
    <section className="border-t border-white/10 bg-[#101214]">
      <Link to="/contact" className="page-wrap group flex items-center justify-between gap-8 py-16 sm:py-24">
        <div><p className="eyebrow">There is more under NDA</p><p className="mt-4 text-[clamp(2.5rem,7vw,7rem)] font-medium leading-[.9] tracking-[-0.06em]">Ask to see the rest.</p></div>
        <span className="grid size-16 shrink-0 place-items-center rounded-full border border-white/18 transition-colors group-hover:border-[#B8FF35] group-hover:bg-[#B8FF35] group-hover:text-black sm:size-24"><ArrowUpRight className="size-6 sm:size-8" /></span>
      </Link>
    </section>
  </>
);
