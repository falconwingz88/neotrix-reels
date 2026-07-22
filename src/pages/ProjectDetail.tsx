import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Share2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Reveal } from "@/components/Motion";
import { Seo } from "@/components/Seo";
import { YouTubeFacade } from "@/components/YouTubeFacade";
import { projectFromRow, type CustomProject, type ProjectRow, useProjects } from "@/contexts/ProjectsContext";
import { projectPoster, publicProjects } from "@/lib/projects";
import { getYouTubeThumbnail } from "@/lib/youtube";
import { supabase } from "@/integrations/supabase/client";

const displayDate = (value?: string) => {
  if (!value) return "Not listed";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(date);
};

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { customProjects, loading, error, refetch } = useProjects();
  const [shared, setShared] = useState(false);
  const [sharedProject, setSharedProject] = useState<CustomProject | null>(null);
  const [sharedLoading, setSharedLoading] = useState(false);
  const projects = useMemo(() => publicProjects(customProjects), [customProjects]);
  const index = projects.findIndex((item) => item.id === id);
  const publicProject = index >= 0 ? projects[index] : undefined;
  const project = publicProject || sharedProject || undefined;
  const previous = index > 0 ? projects[index - 1] : projects[projects.length - 1];
  const next = index >= 0 && index < projects.length - 1 ? projects[index + 1] : projects[0];

  useEffect(() => {
    let cancelled = false;
    setSharedProject(null);

    if (loading || publicProject || !id) {
      setSharedLoading(false);
      return () => {
        cancelled = true;
      };
    }

    setSharedLoading(true);
    void supabase.rpc("get_shared_project", { _project_id: id }).then(({ data, error: sharedError }) => {
      if (cancelled) return;
      if (sharedError) console.error("Error loading shared project:", sharedError);
      const row = ((data || []) as ProjectRow[])[0];
      setSharedProject(row ? projectFromRow(row) : null);
      setSharedLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [id, loading, publicProject]);

  const share = async () => {
    if (!project) return;
    try {
      if (navigator.share) await navigator.share({ title: project.title, url: window.location.href });
      else await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      window.setTimeout(() => setShared(false), 1800);
    } catch {
      // User-cancelled shares should not surface as an error.
    }
  };

  if (loading || sharedLoading) return <div className="page-wrap min-h-screen pb-24 pt-36"><div className="aspect-video animate-pulse rounded-[2rem] bg-white/6" /></div>;
  if (error) return (
    <section className="page-wrap flex min-h-[75vh] items-center pt-28">
      <div><p className="eyebrow">Project unavailable</p><h1 className="mt-4 text-5xl tracking-[-0.05em]">The case study did not load.</h1><button onClick={() => void refetch()} className="mt-7 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black">Try again</button></div>
    </section>
  );
  if (!project) return (
    <section className="page-wrap flex min-h-[75vh] items-center pt-28">
      <div><p className="eyebrow">404 / Project</p><h1 className="mt-4 text-6xl tracking-[-0.06em]">This frame is not public.</h1><Link to="/projects" className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm"><ArrowLeft className="size-4" /> Return to work</Link></div>
    </section>
  );

  const poster = projectPoster(project);
  const description = project.description || "A commercial moving-image project created by Neotrix.";

  return (
    <>
      <Seo
        title={project.title + " — Project"}
        description={description.slice(0, 155)}
        path={"/projects/" + project.id}
        image={poster.startsWith("http") ? poster : "https://motion.neotrix.asia" + poster}
        type="video.other"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: project.title,
          description,
          thumbnailUrl: poster,
          uploadDate: project.deliveryDate || project.createdAt,
          contentUrl: project.links[0],
          creator: { "@type": "Organization", name: "Neotrix" },
        }}
      />
      <article className="pb-24 pt-28 sm:pt-36 lg:pb-36">
        <header className="page-wrap">
          <div className="mb-8 flex items-center justify-between">
            <Link to="/projects" className="group flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/45 hover:text-white"><ArrowLeft className="size-3 transition-transform group-hover:-translate-x-1" /> Back to archive</Link>
            <button onClick={() => void share()} className="flex items-center gap-2 rounded-full border border-white/13 px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.13em] text-white/65 hover:border-white/35 hover:text-white">
              {shared ? <Check className="size-3.5 text-[#B8FF35]" /> : <Share2 className="size-3.5" />}{shared ? "Copied" : "Share"}
            </button>
          </div>
          <Reveal>
            <div className="grid gap-8 lg:grid-cols-[1.5fr_.55fr] lg:items-end">
              <div>
                <p className="eyebrow">{project.client || "Neotrix"} / {project.year || "Undated"}</p>
                <h1 className="mt-5 max-w-[13ch] text-[clamp(4rem,10vw,10rem)] font-medium leading-[.84] tracking-[-0.07em]">{project.title}</h1>
              </div>
              <div className="flex flex-wrap gap-2 lg:pb-3">
                {Array.from(new Set(project.tags)).map((tag) => <span key={tag} className="rounded-full border border-white/15 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.13em] text-white/55">{tag}</span>)}
              </div>
            </div>
          </Reveal>
        </header>

        <section className="page-wrap mt-12 sm:mt-16">
          <Reveal>
            <YouTubeFacade url={project.links[0] || ""} poster={poster} title={project.title} hero className="rounded-[1.3rem] sm:rounded-[2.2rem]" />
          </Reveal>
        </section>

        {project.links.length > 1 && (
          <section className="page-wrap border-b border-white/10 py-12 sm:py-16">
            <div className="mb-7 flex items-end justify-between">
              <div>
                <p className="eyebrow">More from the project</p>
                <h2 className="mt-2 text-2xl font-medium tracking-[-0.035em] sm:text-4xl">Additional videos</h2>
              </div>
              <span className="font-mono text-[9px] text-white/40">{String(project.links.length - 1).padStart(2, "0")}</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {project.links.slice(1).map((link, itemIndex) => (
                <Reveal key={link} delay={itemIndex * 0.04}>
                  <YouTubeFacade url={link} poster={getYouTubeThumbnail(link)} title={`${project.title} — Video ${itemIndex + 2}`} className="rounded-[1rem] sm:rounded-[1.3rem]" />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        <section className="page-wrap grid gap-8 py-14 sm:py-20 lg:grid-cols-[.38fr_1fr]">
          <Reveal>
            <p className="eyebrow">Project caption</p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="max-w-3xl text-base leading-relaxed text-white/70 sm:text-lg">{description}</p>
            <dl className="mt-9 grid gap-x-8 gap-y-6 border-t border-white/10 pt-7 sm:grid-cols-2">
              {[
                ["Client", project.client || "Neotrix"],
                ["Year", String(project.year || "—")],
                ["Production", project.credits || "Neotrix"],
                ["Project window", displayDate(project.projectStartDate) + " — " + displayDate(project.deliveryDate)],
              ].map(([term, value]) => (
                <div key={term}>
                  <dt className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/35">{term}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-white/68">{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </section>

        <nav aria-label="Project pagination" className="page-wrap grid gap-px py-20 sm:grid-cols-2 sm:py-28">
          {previous && <Link to={"/projects/" + previous.id} className="group border-y border-white/10 py-8 sm:border-r sm:pr-8"><p className="eyebrow">Previous</p><div className="mt-4 flex items-center justify-between gap-4"><span className="text-2xl tracking-[-0.035em] sm:text-4xl">{previous.title}</span><ArrowLeft className="size-5 transition-transform group-hover:-translate-x-2" /></div></Link>}
          {next && <Link to={"/projects/" + next.id} className="group border-b border-white/10 py-8 sm:border-y sm:pl-8 sm:text-right"><p className="eyebrow">Next</p><div className="mt-4 flex items-center justify-between gap-4 sm:flex-row-reverse"><span className="text-2xl tracking-[-0.035em] sm:text-4xl">{next.title}</span><ArrowRight className="size-5 transition-transform group-hover:translate-x-2" /></div></Link>}
        </nav>

        <section className="page-wrap">
          <Link to="/contact" className="group flex items-center justify-between rounded-[1.5rem] bg-[#7DEBFF] p-6 text-black sm:p-10">
            <div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/45">Your project could be next</p><p className="mt-3 text-[clamp(2.5rem,6vw,6.5rem)] font-medium leading-[.9] tracking-[-0.06em]">Start a project.</p></div>
            <ArrowUpRight className="size-7 transition-transform group-hover:rotate-45 sm:size-12" />
          </Link>
        </section>
      </article>
    </>
  );
};

export default ProjectDetail;
