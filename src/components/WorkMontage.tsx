import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { CustomProject } from "@/contexts/ProjectsContext";
import { optimizedProjectPoster } from "@/lib/projects";
import { getYouTubeThumbnail } from "@/lib/youtube";

const FALLBACK_POSTER = "/lovable-uploads/095c66ca-08f0-405a-a24e-5d161594a887.png";

const MontageFrame = ({ project }: { project: CustomProject }) => {
  const sources = useMemo(() => Array.from(new Set([
    getYouTubeThumbnail(project.links[0] || ""),
    getYouTubeThumbnail(project.links[0] || "", "hqdefault"),
    optimizedProjectPoster(project, 640),
    FALLBACK_POSTER,
  ].filter(Boolean))), [project]);
  const [sourceIndex, setSourceIndex] = useState(0);

  return (
    <div className="montage-frame relative aspect-video w-[43vw] shrink-0 overflow-hidden rounded-lg bg-[#17191b] sm:w-[30vw] sm:rounded-xl lg:w-[21vw]">
      <img
        src={sources[sourceIndex] || FALLBACK_POSTER}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        width="640"
        height="360"
        className="absolute inset-0 size-full scale-105 object-cover opacity-30 blur-xl"
      />
      <img
        src={sources[sourceIndex] || FALLBACK_POSTER}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        width="640"
        height="360"
        onError={() => setSourceIndex((current) => Math.min(current + 1, sources.length - 1))}
        className="relative size-full object-contain transition-[filter] duration-700 group-hover:brightness-105 group-hover:saturate-110"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-[#7DEBFF]/5" />
    </div>
  );
};

interface WorkMontageProps {
  projects: CustomProject[];
  total: number;
}

export const WorkMontage = ({ projects, total }: WorkMontageProps) => {
  const rows = [0, 1, 2].map((offset) => projects.filter((_, index) => index % 3 === offset).slice(0, 6));

  return (
    <Link
      to="/projects"
      aria-label="Explore the complete Neotrix project archive"
      className="group relative block overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#111315] py-3 sm:rounded-[2rem] sm:py-4"
    >
      <div aria-hidden="true" className="space-y-2.5 sm:space-y-3">
        {rows.map((row, rowIndex) => {
          const frames = row.length ? [...row, ...row] : [];
          return (
            <div key={rowIndex} className={`montage-track flex w-max gap-2.5 sm:gap-3 ${rowIndex % 2 ? "montage-track-reverse" : ""}`}>
              {frames.map((project, index) => <MontageFrame key={`${rowIndex}-${project.id}-${index}`} project={project} />)}
            </div>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(10,11,12,.48)_0%,rgba(10,11,12,.78)_68%,rgba(10,11,12,.96)_100%)]" />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
        <div className="flex max-w-[34rem] flex-col items-center rounded-[1.5rem] border border-white/12 bg-black/72 px-6 py-7 shadow-[0_24px_90px_rgba(0,0,0,.62)] backdrop-blur-xl sm:rounded-[2rem] sm:px-12 sm:py-10">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#7DEBFF]">A growing body of work</p>
          <p className="mt-3 text-[clamp(3.4rem,9vw,8rem)] font-medium leading-[.78] tracking-[-0.07em] text-[#F4F0E8]">
            {total}<span className="text-[#B8FF35]">+</span>
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/82 sm:text-base">Projects, experiments, characters, products, worlds—and counting.</p>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#F4F0E8] px-5 py-3 text-sm font-semibold text-black shadow-xl transition-transform duration-500 group-hover:scale-105">
            Enter the full archive <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
          </span>
        </div>
      </div>
    </Link>
  );
};
