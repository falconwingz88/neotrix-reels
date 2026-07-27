import { useState, type SyntheticEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, FolderOpen } from "lucide-react";
import { Link } from "react-router-dom";
import type { CustomProject } from "@/contexts/ProjectsContext";
import { useAuth } from "@/contexts/AuthContext";
import { curatedCatalogPoster } from "@/lib/projectCatalogPosters";
import { getAdminProjectFileUrl } from "@/lib/projectFiles";
import { optimizedProjectPoster, projectVideoPoster } from "@/lib/projects";

interface ProjectCardProps {
  project: CustomProject;
  index?: number;
  featured?: boolean;
  compact?: boolean;
  priority?: boolean;
}

type PosterMode = "curated" | "stored" | "stored-raw" | "stored-preserved" | "video" | "video-hq" | "fallback";

const FALLBACK_POSTER = "/lovable-uploads/095c66ca-08f0-405a-a24e-5d161594a887.png";

export const ProjectCard = ({ project, index = 0, featured = false, compact = false, priority = false }: ProjectCardProps) => {
  const reduced = useReducedMotion();
  const { isAdmin } = useAuth();
  const adminFileUrl = getAdminProjectFileUrl(isAdmin, project.fileLink);
  const offset = index % 5 === 1 || index % 5 === 4;
  const curatedPoster = compact ? curatedCatalogPoster(project.id) : "";
  const [posterMode, setPosterMode] = useState<PosterMode>(curatedPoster ? "curated" : "stored");
  const [posterReady, setPosterReady] = useState(false);
  const rawStoredPoster = project.thumbnail?.trim() || "";
  const videoPoster = projectVideoPoster(project);
  const videoPosterHq = projectVideoPoster(project, "hqdefault");
  const usesStoredPoster = posterMode === "stored";
  const poster = posterMode === "curated"
    ? curatedPoster
    : posterMode === "video"
    ? videoPoster
    : posterMode === "video-hq"
      ? videoPosterHq
      : posterMode === "stored-raw" || posterMode === "stored-preserved"
        ? rawStoredPoster
      : posterMode === "fallback"
        ? FALLBACK_POSTER
        : optimizedProjectPoster(project, compact ? 720 : 900);

  const inspectThumbnail = (event: SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    const canUseLandscapeStill = compact
      && (posterMode === "stored" || posterMode === "stored-raw")
      && image.naturalHeight / image.naturalWidth > 0.85
      && videoPoster;

    if (canUseLandscapeStill) {
      setPosterReady(false);
      setPosterMode("video");
      return;
    }
    setPosterReady(true);
  };

  const recoverPoster = () => {
    setPosterReady(false);
    if (posterMode === "curated") {
      if (rawStoredPoster) {
        setPosterMode("stored-preserved");
        return;
      }
    }
    if (posterMode === "stored" && rawStoredPoster && rawStoredPoster !== poster) {
      setPosterMode("stored-raw");
      return;
    }
    if ((posterMode === "stored" || posterMode === "stored-raw") && videoPoster) {
      setPosterMode("video");
      return;
    }
    if ((posterMode === "stored" || posterMode === "stored-raw" || posterMode === "video") && videoPosterHq) {
      setPosterMode("video-hq");
      return;
    }
    if (posterMode === "video-hq" && rawStoredPoster) {
      setPosterMode("stored-preserved");
      return;
    }
    if (posterMode !== "fallback") {
      setPosterMode("fallback");
      return;
    }
    setPosterReady(true);
  };

  return (
    <motion.article
      layout
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduced ? 0 : 0.58, delay: Math.min(index, 5) * 0.045 }}
      className={compact ? "relative hover:z-30" : featured ? "" : offset ? "lg:mt-24" : ""}
    >
      <Link
        to={`/projects/${project.id}`}
        className="project-card group relative z-0 block focus-visible:z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8FF35] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0A0B0C]"
        data-project-link
      >
        <div className={`relative overflow-hidden bg-[#17191b] ${compact ? `aspect-video rounded-xl sm:rounded-2xl ${reduced ? "" : "transform-gpu transition-[transform,filter] duration-300 ease-out md:group-hover:z-40 md:group-hover:scale-[1.06] md:group-hover:drop-shadow-[0_18px_28px_rgba(0,0,0,0.5)]"}` : featured ? "aspect-[4/3] rounded-[1.75rem]" : "aspect-[4/3] rounded-[1.25rem] sm:rounded-[1.75rem]"}`}>
          {compact && (
            <img
              src={poster}
              alt=""
              aria-hidden
              loading="lazy"
              decoding="async"
              width="640"
              height="360"
              className="absolute inset-0 size-full scale-110 object-cover opacity-25 blur-2xl transition-[filter,opacity] duration-700 group-hover:opacity-40 group-hover:saturate-125"
            />
          )}
          <img
            src={poster}
            srcSet={usesStoredPoster ? `${optimizedProjectPoster(project, 480)} 480w, ${optimizedProjectPoster(project, 720)} 720w, ${optimizedProjectPoster(project, 1100)} 1100w` : undefined}
            sizes={compact ? "(min-width: 1280px) 20vw, (min-width: 768px) 29vw, 47vw" : featured ? "(min-width: 1024px) 32vw, (min-width: 768px) 48vw, 94vw" : "(min-width: 1024px) 45vw, 94vw"}
            alt={project.title}
            onLoad={inspectThumbnail}
            onError={recoverPoster}
            loading={priority && index < 4 ? "eager" : "lazy"}
            fetchPriority={priority && index < 2 ? "high" : "auto"}
            decoding="async"
            width="1200"
            height="900"
            className={`relative size-full transition-[opacity,filter,transform] duration-700 ease-out group-hover:brightness-105 group-hover:saturate-[1.08] ${compact ? "object-contain" : "object-cover group-hover:scale-[1.06]"} ${posterReady ? "opacity-100" : "opacity-0"}`}
          />
          <div className="absolute inset-0 z-[11] bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-45 transition-opacity duration-500 group-hover:opacity-65" />
          <div className={`absolute z-20 flex gap-1.5 font-mono uppercase tracking-[0.14em] ${compact ? "left-2.5 top-2.5 text-[7px] sm:left-3 sm:top-3 sm:text-[8px]" : "left-4 top-4 text-[8px] sm:left-5 sm:top-5 sm:text-[9px]"}`}>
            <span className={`rounded-full border border-white/20 bg-black/25 backdrop-blur-md ${compact ? "px-2 py-1" : "px-2.5 py-1.5"}`}>{project.year || "\u2014"}</span>
            {project.tags[0] && <span className={`rounded-full border border-white/20 bg-black/25 backdrop-blur-md ${compact ? "hidden px-2 py-1 sm:block" : "px-2.5 py-1.5"}`}>{project.tags[0]}</span>}
          </div>
          <span className={`pointer-events-none absolute z-20 grid translate-y-2 place-items-center rounded-full bg-[#B8FF35] text-black opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 ${compact ? "right-2.5 top-2.5 size-8 sm:right-3 sm:top-3 sm:size-9" : "right-4 top-4 size-11 sm:right-5 sm:top-5"}`}>
            <ArrowUpRight className={compact ? "size-3.5" : "size-4"} />
          </span>
          <div className={`absolute z-20 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 ${compact ? "bottom-3 left-3 right-3" : "bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5"}`}>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/65">View case</p>
          </div>
        </div>
        <div className={`flex items-start justify-between px-1 ${compact ? "gap-2 pt-2.5" : "gap-5 pt-4"}`}>
          <div>
            <h3 className={`${compact ? "text-sm leading-tight sm:text-base" : "text-xl sm:text-2xl"} font-medium tracking-[-0.025em] text-[#F4F0E8]`}>{project.title}</h3>
            <p className={`${compact ? "mt-1 text-[7px] sm:text-[8px]" : "mt-1 text-[9px]"} font-mono uppercase tracking-[0.14em] text-white/45`}>{project.client || "Neotrix"}</p>
          </div>
          <span className={`${compact ? "text-[7px] sm:text-[8px]" : "pt-1 text-[9px]"} shrink-0 font-mono text-white/55`}>{String(index + 1).padStart(2, "0")}</span>
        </div>
      </Link>
      {adminFileUrl && (
        <a
          href={adminFileUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open high-resolution files for ${project.title}`}
          title="Open high-resolution files"
          data-admin-file-link
          className={`group/folder absolute z-40 flex items-center justify-center border border-[#B8FF35]/35 bg-[#0A0B0C]/90 font-mono uppercase tracking-[0.12em] text-[#B8FF35] shadow-lg backdrop-blur-md transition-[background-color,color,border-color,transform] hover:scale-105 hover:border-[#B8FF35] hover:bg-[#B8FF35] hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8FF35] ${compact ? "right-2.5 top-12 size-8 rounded-full sm:right-3 sm:top-14 sm:size-9" : "right-4 top-[4.25rem] size-11 rounded-full sm:right-5 sm:top-[4.75rem]"}`}
        >
          <FolderOpen className={compact ? "size-3.5" : "size-4"} aria-hidden="true" />
        </a>
      )}
    </motion.article>
  );
};
