import { describe, expect, it } from "vitest";
import type { CustomProject } from "@/contexts/ProjectsContext";
import { curatedCatalogPoster } from "./projectCatalogPosters";
import { featuredProjects, filterProjects, filtersFromSearchParams, filtersToSearchParams, projectPoster, projectVideoPoster, resolveResourceState } from "./projects";

const project = (partial: Partial<CustomProject>): CustomProject => ({
  id: "id",
  title: "Project",
  description: "",
  tags: [],
  links: [],
  credits: "",
  createdAt: "2026-01-01T00:00:00Z",
  ...partial,
});

const projects = [
  project({ id: "b", title: "Beauty Film", client: "Wardah", year: 2025, tags: ["Beauty"], sortOrder: 2 }),
  project({ id: "restricted", title: "Secret Film", year: 2026, tags: ["VFX"], sortOrder: 1, isRestricted: true }),
  project({ id: "a", title: "Character World", client: "Realfood", year: 2026, tags: ["VFX", "Character"], sortOrder: 3 }),
];

describe("project selection and filters", () => {
  it("never features restricted work and respects ordering", () => {
    expect(featuredProjects(projects).map((item) => item.id)).toEqual(["b", "a"]);
  });

  it("filters public work by query, all selected tags, and year", () => {
    expect(filterProjects(projects, { query: "realfood", tags: ["VFX", "Character"], year: 2026 }).map((item) => item.id)).toEqual(["a"]);
    expect(filterProjects(projects, { query: "secret", tags: [], year: null })).toEqual([]);
  });

  it("round-trips URL-synced filter state", () => {
    const filters = { query: "liquid world", tags: ["VFX", "Beauty"], year: 2025 };
    const params = filtersToSearchParams(filters);
    expect(params.toString()).toBe("q=liquid+world&tags=VFX%2CBeauty&year=2025");
    expect(filtersFromSearchParams(params)).toEqual(filters);
  });

  it("models loading, error, empty, and ready resource states", () => {
    expect(resolveResourceState(true, null, [])).toBe("loading");
    expect(resolveResourceState(false, "offline", [])).toBe("error");
    expect(resolveResourceState(false, null, [])).toBe("empty");
    expect(resolveResourceState(false, null, [projects[0]])).toBe("ready");
  });

  it("uses the first YouTube thumbnail even when it is not the first media link", () => {
    const links = ["https://drive.google.com/file/d/project-preview", "https://youtu.be/LP5ybY7O2zc"];
    expect(projectVideoPoster({ links })).toContain("LP5ybY7O2zc/maxresdefault.jpg");
    expect(projectPoster(project({ links }))).toContain("LP5ybY7O2zc/maxresdefault.jpg");
  });

  it("keeps dedicated extracted-frame thumbnails for the seven protected projects", () => {
    const protectedIds = [
      "158c5a2a-0d77-44d2-93fc-1e102ebcbdf3",
      "bf7532f7-a00a-4da0-a926-48ea830f291a",
      "71dbd58a-17d8-4a19-92c7-606bc603b0d9",
      "053786ab-4079-48d7-b5e5-3d86bd75aaf7",
      "775d8087-2904-4b45-9dee-c6f58d518d21",
      "690085d5-e4dd-4be1-ab99-5a30e9009030",
      "fecea45e-5b87-415a-88c1-f9b829982c19",
    ];

    expect(protectedIds.every((id) => Boolean(curatedCatalogPoster(id)))).toBe(true);
    expect(curatedCatalogPoster("another-project")).toBe("");
  });
});
