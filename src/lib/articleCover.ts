import type { Article } from "@/content/articles";
import type { CustomProject } from "@/contexts/ProjectsContext";
import { optimizedProjectPoster, publicProjects } from "@/lib/projects";

const normalize = (value: string) => value.trim().toLocaleLowerCase();

// Verified against the public project archive on 2026-07-27. These projects
// have real 16:9 stills (not YouTube's 120x90 fallback placeholder).
const VERIFIED_LANDSCAPE_PROJECT_POSTERS = new Map([
  ["a6a17e98-d3be-4092-a2b1-98980690740c", "https://i.ytimg.com/vi/KPDXhVbCucM/maxresdefault.jpg"],
  ["7c6c4695-cb63-48b0-b20a-bc03944124ea", "https://i.ytimg.com/vi/_ig_oFs5JhU/maxresdefault.jpg"],
  ["9bc9c04f-5afa-4a19-8a13-f26463fd6c92", "https://i.ytimg.com/vi/8ZnkKQ_qSVs/maxresdefault.jpg"],
  ["76fb616e-9f9e-4e6d-bf1e-6c3d6b25a496", "https://i.ytimg.com/vi/1WAHm5SAbug/maxresdefault.jpg"],
  ["302b7728-7514-4abd-a61c-ab5cb3edac42", "https://img.youtube.com/vi/qiocwuA_q6o/maxresdefault.jpg"],
  ["b27dc49e-bf27-4554-85c1-5dae598f247c", "https://i.ytimg.com/vi/3n_6NuWvvb8/maxresdefault.jpg"],
  ["dc45bb25-6dd0-41f4-811c-c25cf1e3123f", "https://i.ytimg.com/vi/vYOt2WfiZpM/maxresdefault.jpg"],
  ["61a67cd9-e97a-49d0-9f73-2ca26faed985", "https://i.ytimg.com/vi/oMSz56zS2uk/maxresdefault.jpg"],
  ["de17b67f-2053-496b-a876-dbd8d2be6ee7", "https://i.ytimg.com/vi/40Junq-XZFI/maxresdefault.jpg"],
  ["9caff5c2-abb6-4fe6-a19e-bb79201711e5", "https://i.ytimg.com/vi/7tCSKIO1Qkc/maxresdefault.jpg"],
  ["ddce43cd-be36-4199-890f-8a4906754ec8", "https://i.ytimg.com/vi/OT4MzLnsx1o/maxresdefault.jpg"],
  ["88e3bb29-f230-41b4-9fb9-02a8c88d00e1", "https://i.ytimg.com/vi/WtgzmsI8mjY/maxresdefault.jpg"],
  ["2e174057-0e9f-4598-a236-14419d1ba6c0", "https://i.ytimg.com/vi/x7gmGrbucIU/maxresdefault.jpg"],
  ["77cd38c0-97ca-4f7c-b183-ebe8c63c3ca7", "https://i.ytimg.com/vi/os941LA67aE/maxresdefault.jpg"],
  ["f9fefe99-1a7e-483a-86c0-d347130cac8d", "https://i.ytimg.com/vi/h-5XO6HVvO8/maxresdefault.jpg"],
  ["82496874-da14-4bd5-9dcf-6402f0976bf0", "https://i.ytimg.com/vi/m-uXYfhOVBs/maxresdefault.jpg"],
  ["f9005e73-dc87-492b-b125-e366c7e1c66e", "https://img.youtube.com/vi/u5EGZwDrad4/maxresdefault.jpg"],
  ["efe9bba3-d420-4347-9fa1-a5a4fe2be9a9", "https://i.ytimg.com/vi/fe_LzsL1x-I/maxresdefault.jpg"],
  ["1df9add7-1564-4df6-8582-620a5b104005", "https://i.ytimg.com/vi/VWRsTt-DQj4/maxresdefault.jpg"],
  ["16fed1ba-5301-4e7f-88df-a4a69b6a4f5e", "https://i.ytimg.com/vi/NwxZjls-OAs/maxresdefault.jpg"],
  ["e39f11d8-24e4-4058-a70d-06ecf2695df1", "https://i.ytimg.com/vi/wp0NKJ2acag/maxresdefault.jpg"],
  ["158c5a2a-0d77-44d2-93fc-1e102ebcbdf3", "/assets/wuling-air-ev-Bkkp7oWV.jpg"],
  ["656026db-db7d-4504-abf2-df63815932f9", "https://i.ytimg.com/vi/6oFW53N5xxE/maxresdefault.jpg"],
  ["d8df530a-dcc1-4946-9788-596f366810b0", "https://i.ytimg.com/vi/Jwg5GqfkDwM/maxresdefault.jpg"],
  ["576e32b0-2a9d-47d3-ae64-358cace937e0", "https://i.ytimg.com/vi/-7_nktP0pG4/maxresdefault.jpg"],
  ["d0040f49-b54d-446b-bbf2-f63e9989c334", "https://i.ytimg.com/vi/239w3mLbR78/maxresdefault.jpg"],
  ["b16cf0a3-8a00-4090-804b-9be0f9cc81e8", "https://i.ytimg.com/vi/z6ZCKRqdh_M/maxresdefault.jpg"],
  ["5c55de92-bda4-4b31-8b79-ea8b639bfb0c", "https://i.ytimg.com/vi/tGuKYNwy0Q4/maxresdefault.jpg"],
  ["bf7532f7-a00a-4da0-a926-48ea830f291a", "/assets/rejoice-3in1-B5KpwYlE.jpg"],
  ["8c367d6b-d142-4af1-a78d-c03a77a5c60d", "https://img.youtube.com/vi/gKuh2Lnjv6g/maxresdefault.jpg"],
  ["b454f44a-dfb8-4c05-a5d4-eec1e96ba462", "https://i.ytimg.com/vi/cbZtI3EIVDc/maxresdefault.jpg"],
  ["4ec6a463-beb9-465c-b527-f844eef535d9", "https://i.ytimg.com/vi/ZyRs2eIR4Mo/maxresdefault.jpg"],
  ["80a15890-5a69-4830-9aec-8271c7a580e2", "https://i.ytimg.com/vi/K-iAQj4PPjY/maxresdefault.jpg"],
  ["71dbd58a-17d8-4a19-92c7-606bc603b0d9", "/assets/lazada-ramadan-sale-BaGO6liZ.jpg"],
  ["23ad454d-e1f1-4484-bcf3-d4022f38edb1", "https://i.ytimg.com/vi/EvFb7pJa8e0/maxresdefault.jpg"],
  ["3cea464d-8d1e-4f5e-980a-776cacced3f8", "https://i.ytimg.com/vi/HbaDfSrCBp4/maxresdefault.jpg"],
  ["e259e512-e7cc-4a73-b8c4-3e45af94fe58", "https://i.ytimg.com/vi/McrguiqkgcI/maxresdefault.jpg"],
  ["8018337a-c89b-4480-a66f-d682895ef250", "https://i.ytimg.com/vi/x4H45vuo-4Y/maxresdefault.jpg"],
  ["4a15eefe-db96-4515-a4c9-f9df1d8ad2d6", "https://i.ytimg.com/vi/L8ZT3BxSN8s/maxresdefault.jpg"],
  ["4b3e6f13-bb36-4b46-be6c-ac14f03ce4a2", "https://i.ytimg.com/vi/5YbuwyzvdEo/maxresdefault.jpg"],
]);

const projectSearchText = (project: CustomProject) => normalize([
  project.title,
  project.client,
  project.description,
  ...project.tags,
].filter(Boolean).join(" "));

const getLandscapeProjectPoster = (project: CustomProject, width: number) => {
  return VERIFIED_LANDSCAPE_PROJECT_POSTERS.get(project.id) || optimizedProjectPoster(project, width);
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
  const landscapeProjects = visibleProjects.filter((project) => VERIFIED_LANDSCAPE_PROJECT_POSTERS.has(project.id));
  const otherProjects = visibleProjects.filter((project) => !VERIFIED_LANDSCAPE_PROJECT_POSTERS.has(project.id));
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
    const project = takeProject(linkedProjects.filter((candidate) => VERIFIED_LANDSCAPE_PROJECT_POSTERS.has(candidate.id)))
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
