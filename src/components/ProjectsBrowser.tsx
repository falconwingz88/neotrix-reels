import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { Filter, Search, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { ProjectCard } from "@/components/ProjectCard";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useProjects } from "@/contexts/ProjectsContext";
import { deriveProjectFacets, filterProjects, filtersFromSearchParams, filtersToSearchParams, resolveResourceState, type ProjectFilters } from "@/lib/projects";

// Retained for the legacy admin modal contract.
export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  tags: string[];
  year: number;
  client: string;
  primaryVideoUrl: string;
  allVideos: string[];
  deliveryFiles: string[];
  fileLink?: string;
  deliveryDate?: string;
  createdAt: string;
}

const FilterControls = ({ filters, setFilters, tags, years, vertical = false }: {
  filters: ProjectFilters;
  setFilters: (filters: ProjectFilters) => void;
  tags: string[];
  years: number[];
  vertical?: boolean;
}) => (
  <div className={vertical ? "space-y-7" : "space-y-8"}>
    <div>
      <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.18em] text-white/40">Discipline</p>
      <div className={vertical ? "grid gap-1.5" : "flex flex-wrap gap-2"}>
        {tags.map((tag) => {
          const active = filters.tags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => setFilters({ ...filters, tags: active ? filters.tags.filter((item) => item !== tag) : [...filters.tags, tag] })}
              aria-pressed={active}
              className={`${vertical ? "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left" : "rounded-full px-3 py-2"} border font-mono text-[9px] uppercase tracking-[0.12em] transition-colors ${active ? "border-[#B8FF35] bg-[#B8FF35] text-black" : "border-white/10 text-white/55 hover:border-white/35 hover:bg-white/[.04] hover:text-white"}`}
            >
              <span>{tag}</span>{vertical && <span className="text-[8px] opacity-55">{active ? "ON" : "+"}</span>}
            </button>
          );
        })}
      </div>
    </div>
    <div>
      <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.18em] text-white/40">Year</p>
      <div className={vertical ? "grid grid-cols-2 gap-1.5" : "flex flex-wrap gap-2"}>
        {years.map((year) => {
          const active = filters.year === year;
          return (
            <button
              key={year}
              type="button"
              onClick={() => setFilters({ ...filters, year: active ? null : year })}
              aria-pressed={active}
              className={`${vertical ? "rounded-lg py-2.5" : "rounded-full px-3 py-2"} border font-mono text-[9px] transition-colors ${active ? "border-[#7DEBFF] bg-[#7DEBFF] text-black" : "border-white/10 text-white/55 hover:border-white/35 hover:bg-white/[.04] hover:text-white"}`}
            >
              {year}
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

export const ProjectsBrowser = () => {
  const { customProjects, loading, error, refetch } = useProjects();
  const [params, setParams] = useSearchParams();
  const [cursorVisible, setCursorVisible] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const lastPointer = useRef({ x: -100, y: -100, insideWindow: false });
  const reduced = useReducedMotion();
  const filters = useMemo(() => filtersFromSearchParams(params), [params]);
  const facets = useMemo(() => deriveProjectFacets(customProjects), [customProjects]);
  const projects = useMemo(() => filterProjects(customProjects, filters), [customProjects, filters]);
  const state = resolveResourceState(loading, error, projects);
  const activeCount = filters.tags.length + (filters.year ? 1 : 0) + (filters.query ? 1 : 0);
  const setFilters = (next: ProjectFilters) => setParams(filtersToSearchParams(next), { replace: true });
  const clear = () => setFilters({ query: "", tags: [], year: null });

  useEffect(() => {
    if (reduced || !window.matchMedia("(pointer:fine)").matches) {
      setCursorVisible(false);
      return;
    }

    let scrollFrame = 0;
    const syncCursor = (x: number, y: number) => {
      cursorX.set(x - 30);
      cursorY.set(y - 30);
      const element = document.elementFromPoint(x, y);
      setCursorVisible(Boolean(element?.closest("[data-project-link]")));
    };
    const handlePointerMove = (event: globalThis.PointerEvent) => {
      lastPointer.current = { x: event.clientX, y: event.clientY, insideWindow: true };
      syncCursor(event.clientX, event.clientY);
    };
    const handleScroll = () => {
      if (!lastPointer.current.insideWindow) return;
      window.cancelAnimationFrame(scrollFrame);
      scrollFrame = window.requestAnimationFrame(() => {
        syncCursor(lastPointer.current.x, lastPointer.current.y);
      });
    };
    const handlePointerOut = (event: globalThis.PointerEvent) => {
      if (event.relatedTarget) return;
      lastPointer.current.insideWindow = false;
      setCursorVisible(false);
    };
    const hideCursor = () => setCursorVisible(false);

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerout", handlePointerOut);
    window.addEventListener("scroll", handleScroll, { passive: true, capture: true });
    window.addEventListener("blur", hideCursor);
    return () => {
      window.cancelAnimationFrame(scrollFrame);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerout", handlePointerOut);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("blur", hideCursor);
    };
  }, [cursorX, cursorY, reduced]);

  return (
    <>
      <div className="grid gap-7 border-b border-white/10 pb-7 lg:grid-cols-[1fr_.9fr] lg:items-end">
        <div>
          <p className="eyebrow">Work archive / 2020-Now</p>
          <h1 className="mt-4 text-[clamp(3.2rem,8vw,7.8rem)] font-medium leading-[.84] tracking-[-0.068em]">All work.<br /><span className="text-white/30">No filler.</span></h1>
        </div>
        <div className="lg:pb-2">
          <p className="max-w-lg text-base leading-relaxed text-white/55">Commercial worlds, character stories, product obsessions, and the occasional impossible liquid.</p>
          <div className="relative mt-5">
            <Search className="pointer-events-none absolute left-0 top-1/2 size-4 -translate-y-1/2 text-white/35" />
            <input
              value={filters.query}
              onChange={(event) => setFilters({ ...filters, query: event.target.value })}
              placeholder="Search title, client, or detail"
              aria-label="Search projects"
              className="h-13 w-full border-b border-white/18 bg-transparent py-4 pl-7 pr-9 text-base text-white outline-none placeholder:text-white/28 focus:border-[#7DEBFF]"
            />
            {filters.query && <button type="button" onClick={() => setFilters({ ...filters, query: "" })} className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-white/40 hover:text-white" aria-label="Clear search"><X className="size-4" /></button>}
          </div>
        </div>
      </div>

      <div className="sticky top-[4.8rem] z-40 -mx-5 flex items-center justify-between border-b border-white/10 bg-[#0A0B0C]/92 px-5 py-3.5 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:hidden">
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/45">Archive filters</span>
        <Sheet>
          <SheetTrigger asChild>
            <button className="flex items-center gap-2 rounded-full border border-white/14 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em]">
              <Filter className="size-3.5" /> Filters {activeCount > 0 && `(${activeCount})`}
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[82vh] overflow-y-auto rounded-t-[2rem] border-white/12 bg-[#111315] px-5 pb-10 text-white">
            <SheetHeader className="mb-8 text-left"><SheetTitle className="text-3xl text-white">Filter the archive</SheetTitle></SheetHeader>
            {activeCount > 0 && <button onClick={clear} className="mb-7 font-mono text-[9px] uppercase tracking-[0.14em] text-[#B8FF35] hover:text-white">Clear all filters</button>}
            <FilterControls filters={filters} setFilters={setFilters} tags={facets.tags} years={facets.years} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="relative grid gap-7 py-8 lg:grid-cols-[12rem_1fr] lg:gap-6 lg:py-10">
        <aside className="hidden lg:block" aria-label="Project filters">
          <div className="sticky top-28">
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/55">Filters</p>
              {activeCount > 0 && <button onClick={clear} className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#B8FF35] hover:text-white">Clear {activeCount}</button>}
            </div>
            <FilterControls vertical filters={filters} setFilters={setFilters} tags={facets.tags} years={facets.years} />
          </div>
        </aside>

        <div>
          {state === "loading" && <div className="grid grid-cols-2 gap-x-3 gap-y-7 md:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 12 }).map((_, index) => <div key={index} className="aspect-video animate-pulse rounded-xl bg-white/6" />)}</div>}
          {state === "error" && (
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-8">
              <p className="text-lg">The archive did not load.</p><p className="mt-2 text-sm text-white/50">{error}</p>
              <button onClick={() => void refetch()} className="mt-6 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black">Try again</button>
            </div>
          )}
          {state === "empty" && (
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 px-6 py-20 text-center">
              <p className="text-3xl tracking-[-0.04em]">Nothing matches that cut.</p>
              <button onClick={clear} className="mt-6 rounded-full border border-white/15 px-5 py-3 text-sm text-white/70 hover:text-white">Reset filters</button>
            </div>
          )}
          {state === "ready" && (
            <motion.div layout className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-4 sm:gap-y-9 md:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} compact priority />)}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      <motion.div
        aria-hidden
        style={{ x: cursorX, y: cursorY }}
        animate={{ opacity: cursorVisible ? 1 : 0, scale: cursorVisible ? 1 : 0.7 }}
        transition={{ duration: 0.16, ease: "easeOut" }}
        className="pointer-events-none fixed left-0 top-0 z-[85] hidden size-[60px] place-items-center rounded-full bg-[#B8FF35] font-mono text-[8px] uppercase tracking-[0.14em] text-black lg:grid"
      >
        View
      </motion.div>
    </>
  );
};
