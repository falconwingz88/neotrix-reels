import type { Article } from "@/content/articles";
import type { CustomProject } from "@/contexts/ProjectsContext";
import { optimizedProjectPoster, publicProjects } from "@/lib/projects";
import { getYouTubeThumbnail } from "@/lib/youtube";

const normalize = (value: string) => value.trim().toLocaleLowerCase();

const projectSearchText = (project: CustomProject) => normalize([
  project.title,
  project.client,
  project.description,
  ...project.tags,
].filter(Boolean).join(" "));

const getProjectVideoUrl = (project: CustomProject) => project.links
  .map((link) => getYouTubeThumbnail(link))
  .find(Boolean) || "";

const getLandscapeProjectPoster = (project: CustomProject, width: number) => {
  // YouTube project stills are consistently 16:9. Prefer them over uploaded
  // posters because some older project posters are portrait screenshots.
  return getProjectVideoUrl(project) || optimizedProjectPoster(project, width);
};

const articleKey = (article: Article) => article.id || article.slug;

const articleSearchTerms = (article: Article) => [
  ...(article.relatedWork || []).flatMap((work) => [work.label, work.query]),
  ...article.keywords,
].map(normalize).filter((term) => term.length > 2);

/**
 * Assign a stable, non-repeating project still to every article. The public
 * article grid and detail page both use this map so an article never changes
 * covers depending on which route was opened first.
 */
export const resolveArticleCovers = (articles: Article[], projects: CustomProject[], width = 1200) => {
  const visibleProjects = publicProjects(projects);
  const landscapeProjects = visibleProjects.filter((project) => Boolean(getProjectVideoUrl(project)));
  const otherProjects = visibleProjects.filter((project) => !getProjectVideoUrl(project));
  const candidates = [...landscapeProjects, ...otherProjects];
  const usedProjectIds = new Set<string>();
  const usedImageUrls = new Set<string>();
  const covers = new Map<string, string>();

  const takeProject = (pool: CustomProject[]) => pool.find((project) => {
    const imageUrl = getLandscapeProjectPoster(project, width);
    return !usedProjectIds.has(project.id) && Boolean(imageUrl) && !usedImageUrls.has(imageUrl);
  });

  articles.forEach((article) => {
    const linkedProjects = (article.relatedProjectIds || [])
      .map((id) => visibleProjects.find((project) => project.id === id))
      .filter((project): project is CustomProject => Boolean(project));
    const terms = articleSearchTerms(article);
    const matchingLandscapeProjects = landscapeProjects.filter((project) => {
      const haystack = projectSearchText(project);
      return terms.some((term) => haystack.includes(term));
    });
    const matchingProjects = candidates.filter((project) => {
      const haystack = projectSearchText(project);
      return terms.some((term) => haystack.includes(term));
    });
    const project = takeProject(linkedProjects.filter((candidate) => Boolean(getProjectVideoUrl(candidate))))
      || takeProject(matchingLandscapeProjects)
      || takeProject(landscapeProjects)
      || takeProject(linkedProjects)
      || takeProject(matchingProjects)
      || takeProject(candidates);

    if (!project) return;
    const imageUrl = getLandscapeProjectPoster(project, width);
    if (!imageUrl) return;
    usedProjectIds.add(project.id);
    usedImageUrls.add(imageUrl);
    covers.set(articleKey(article), imageUrl);
  });

  return covers;
};

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
