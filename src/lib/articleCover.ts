import type { Article } from "@/content/articles";
import type { CustomProject } from "@/contexts/ProjectsContext";
import { optimizedProjectPoster, publicProjects } from "@/lib/projects";
import { getYouTubeThumbnail } from "@/lib/youtube";

const normalize = (value: string) => value.trim().toLocaleLowerCase();

// Verified against the public project archive on 2026-07-27. These projects
// have real 16:9 stills (not YouTube's 120x90 fallback placeholder).
const VERIFIED_LANDSCAPE_PROJECT_IDS = new Set([
  "a6a17e98-d3be-4092-a2b1-98980690740c",
  "7c6c4695-cb63-48b0-b20a-bc03944124ea",
  "9bc9c04f-5afa-4a19-8a13-f26463fd6c92",
  "76fb616e-9f9e-4e6d-bf1e-6c3d6b25a496",
  "302b7728-7514-4abd-a61c-ab5cb3edac42",
  "b27dc49e-bf27-4554-85c1-5dae598f247c",
  "dc45bb25-6dd0-41f4-811c-c25cf1e3123f",
  "61a67cd9-e97a-49d0-9f73-2ca26faed985",
  "de17b67f-2053-496b-a876-dbd8d2be6ee7",
  "9caff5c2-abb6-4fe6-a19e-bb79201711e5",
  "ddce43cd-be36-4199-890f-8a4906754ec8",
  "88e3bb29-f230-41b4-9fb9-02a8c88d00e1",
  "2e174057-0e9f-4598-a236-14419d1ba6c0",
  "77cd38c0-97ca-4f7c-b183-ebe8c63c3ca7",
  "f9fefe99-1a7e-483a-86c0-d347130cac8d",
  "82496874-da14-4bd5-9dcf-6402f0976bf0",
  "f9005e73-dc87-492b-b125-e366c7e1c66e",
  "efe9bba3-d420-4347-9fa1-a5a4fe2be9a9",
  "1df9add7-1564-4df6-8582-620a5b104005",
  "16fed1ba-5301-4e7f-88df-a4a69b6a4f5e",
  "e39f11d8-24e4-4058-a70d-06ecf2695df1",
  "158c5a2a-0d77-44d2-93fc-1e102ebcbdf3",
  "656026db-db7d-4504-abf2-df63815932f9",
  "d8df530a-dcc1-4946-9788-596f366810b0",
  "576e32b0-2a9d-47d3-ae64-358cace937e0",
  "d0040f49-b54d-446b-bbf2-f63e9989c334",
  "b16cf0a3-8a00-4090-804b-9be0f9cc81e8",
  "5c55de92-bda4-4b31-8b79-ea8b639bfb0c",
  "bf7532f7-a00a-4da0-a926-48ea830f291a",
  "8c367d6b-d142-4af1-a78d-c03a77a5c60d",
  "b454f44a-dfb8-4c05-a5d4-eec1e96ba462",
  "4ec6a463-beb9-465c-b527-f844eef535d9",
  "80a15890-5a69-4830-9aec-8271c7a580e2",
  "71dbd58a-17d8-4a19-92c7-606bc603b0d9",
  "23ad454d-e1f1-4484-bcf3-d4022f38edb1",
  "3cea464d-8d1e-4f5e-980a-776cacced3f8",
  "e259e512-e7cc-4a73-b8c4-3e45af94fe58",
  "8018337a-c89b-4480-a66f-d682895ef250",
  "4a15eefe-db96-4515-a4c9-f9df1d8ad2d6",
  "4b3e6f13-bb36-4b46-be6c-ac14f03ce4a2",
]);

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
  const landscapeProjects = visibleProjects.filter((project) => VERIFIED_LANDSCAPE_PROJECT_IDS.has(project.id));
  const otherProjects = visibleProjects.filter((project) => !VERIFIED_LANDSCAPE_PROJECT_IDS.has(project.id));
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
    const project = takeProject(linkedProjects.filter((candidate) => VERIFIED_LANDSCAPE_PROJECT_IDS.has(candidate.id)))
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
