import { describe, expect, it } from "vitest";
import type { Article } from "@/content/articles";
import type { CustomProject } from "@/contexts/ProjectsContext";
import { resolveArticleCover } from "@/lib/articleCover";

const article = (overrides: Partial<Article> = {}) => ({
  slug: "test-article",
  title: "Test article",
  shortTitle: "Test article",
  description: "A test article description.",
  dek: "A test article dek.",
  category: "Test",
  publishedAt: "2026-01-01",
  modifiedAt: "2026-01-01",
  readingTime: "5 min read",
  accent: "cyan" as const,
  keywords: ["3D animation"],
  takeaway: "A test takeaway.",
  sections: [],
  faqs: [],
  ...overrides,
});

const project = (overrides: Partial<CustomProject> = {}) => ({
  id: "project-1",
  title: "Project screenshot",
  description: "",
  tags: [],
  links: [],
  credits: "",
  thumbnail: "https://images.example/project-screenshot.jpg",
  createdAt: "2026-01-01",
  ...overrides,
});

describe("resolveArticleCover", () => {
  it("prefers an explicitly assigned article cover", () => {
    expect(resolveArticleCover(article({ coverImage: "https://images.example/article.jpg" }), [project()])).toBe("https://images.example/article.jpg");
  });

  it("uses the linked public project screenshot as the fallback cover", () => {
    expect(resolveArticleCover(article({ relatedProjectIds: ["project-1"] }), [project()])).toBe("https://images.example/project-screenshot.jpg");
  });

  it("stays empty while project imagery is unavailable", () => {
    expect(resolveArticleCover(article(), [])).toBe("");
  });
});
