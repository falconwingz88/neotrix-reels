import type { Article } from "@/content/articles";
import type { CustomProject } from "@/contexts/ProjectsContext";
import { optimizedProjectPoster, publicProjects } from "@/lib/projects";

const normalize = (value: string) => value.trim().toLocaleLowerCase();

/**
 * Resolve one stable, landscape cover for an article. Managed cover images
 * always win; linked work is the visual fallback so older and new articles
 * never render an empty or inconsistent thumbnail frame.
 */
export const resolveArticleCover = (article: Article, projects: CustomProject[], width = 1200) => {
  const explicitCover = article.coverImage?.trim();
  if (explicitCover) return explicitCover;

  const visibleProjects = publicProjects(projects);
  const linkedProject = article.relatedProjectIds
    ?.map((id) => visibleProjects.find((project) => project.id === id))
    .find((project): project is CustomProject => Boolean(project));
  if (linkedProject) return optimizedProjectPoster(linkedProject, width);

  const searchTerms = [
    ...(article.relatedWork || []).flatMap((work) => [work.label, work.query]),
    ...article.keywords,
  ].map(normalize).filter((term) => term.length > 2);
  const matchedProject = visibleProjects.find((project) => {
    const haystack = normalize([project.title, project.client, project.description, ...project.tags].filter(Boolean).join(" "));
    return searchTerms.some((term) => haystack.includes(term));
  });

  const fallbackProject = matchedProject || visibleProjects[0];
  return fallbackProject ? optimizedProjectPoster(fallbackProject, width) : "";
};
