import type { CustomProject } from "@/contexts/ProjectsContext";
import { getYouTubeThumbnail } from "@/lib/youtube";

export type ProjectFilters = { query: string; tags: string[]; year: number | null };

export const publicProjects = (projects: CustomProject[]) =>
  projects.filter((project) => project.isRestricted !== true);

export const featuredProjects = (projects: CustomProject[], limit = 6) =>
  publicProjects(projects)
    .slice()
    .sort((a, b) => (a.sortOrder ?? Number.MAX_SAFE_INTEGER) - (b.sortOrder ?? Number.MAX_SAFE_INTEGER))
    .slice(0, limit);

export const projectPoster = (project: CustomProject) =>
  project.thumbnail || getYouTubeThumbnail(project.links[0] || "") || "/lovable-uploads/095c66ca-08f0-405a-a24e-5d161594a887.png";

export const optimizedProjectPoster = (project: CustomProject, width: number, quality = 76) => {
  const poster = projectPoster(project);
  if (!poster.includes(".supabase.co/storage/v1/object/public/")) return poster;
  const transformed = poster.replace("/storage/v1/object/public/", "/storage/v1/render/image/public/");
  const separator = transformed.includes("?") ? "&" : "?";
  return `${transformed}${separator}width=${width}&quality=${quality}`;
};

export const deriveProjectFacets = (projects: CustomProject[]) => ({
  tags: Array.from(new Set(publicProjects(projects).flatMap((project) => project.tags))).filter(Boolean).sort(),
  years: Array.from(new Set(publicProjects(projects).map((project) => project.year).filter((year): year is number => Boolean(year)))).sort((a, b) => b - a),
});

export const filterProjects = (projects: CustomProject[], filters: ProjectFilters) => {
  const query = filters.query.trim().toLocaleLowerCase();
  return publicProjects(projects).filter((project) => {
    const haystack = [project.title, project.description, project.client, project.credits].filter(Boolean).join(" ").toLocaleLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    const matchesTags = filters.tags.length === 0 || filters.tags.every((tag) => project.tags.includes(tag));
    const matchesYear = filters.year === null || project.year === filters.year;
    return matchesQuery && matchesTags && matchesYear;
  });
};

export const filtersFromSearchParams = (params: URLSearchParams): ProjectFilters => {
  const parsedYear = Number.parseInt(params.get("year") || "", 10);
  return {
    query: params.get("q") || "",
    tags: (params.get("tags") || "").split(",").map((tag) => tag.trim()).filter(Boolean),
    year: Number.isFinite(parsedYear) ? parsedYear : null,
  };
};

export const filtersToSearchParams = (filters: ProjectFilters) => {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set("q", filters.query.trim());
  if (filters.tags.length) params.set("tags", filters.tags.join(","));
  if (filters.year !== null) params.set("year", String(filters.year));
  return params;
};

export const resolveResourceState = <T,>(loading: boolean, error: string | null, items: T[]) => {
  if (loading) return "loading" as const;
  if (error) return "error" as const;
  if (!items.length) return "empty" as const;
  return "ready" as const;
};
