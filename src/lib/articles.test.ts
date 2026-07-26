import { describe, expect, it } from "vitest";
import type { Article } from "@/content/articles";
import { getArticleIdentity, getPublishedArticles, hasDuplicateArticleSlug, isValidArticleMedia, normalizeArticleSlug, sanitizeArticleLinks } from "@/lib/articles";

const article = (slug: string, isPublished = true): Article => ({
  slug,
  title: slug,
  shortTitle: slug,
  description: "Description",
  dek: "Dek",
  category: "Guide",
  publishedAt: "2026-07-26",
  modifiedAt: "2026-07-26",
  readingTime: "5 min read",
  accent: "cyan",
  keywords: [],
  takeaway: "Takeaway",
  sections: [],
  faqs: [],
  isPublished,
});

describe("article management helpers", () => {
  it("normalizes slugs and catches duplicate URLs", () => {
    expect(normalizeArticleSlug(" AI + 3D / Production ")).toBe("ai-3d-production");
    expect(hasDuplicateArticleSlug([article("AI Guide"), article("ai-guide")] )).toBe(true);
    expect(getArticleIdentity(article("AI Guide"))).toBe("ai-guide");
    expect(getArticleIdentity({ ...article("AI Guide"), id: "stable-article-id" })).toBe("stable-article-id");
  });

  it("keeps drafts out of the public collection", () => {
    expect(getPublishedArticles([article("live"), article("draft", false)]).map((item) => item.slug)).toEqual(["live"]);
  });

  it("only keeps labeled secure links and valid media", () => {
    expect(sanitizeArticleLinks([
      { label: "Source", url: "https://example.com/source" },
      { label: "", url: "https://example.com/empty" },
      { label: "Unsafe", url: "javascript:alert(1)" },
    ])).toEqual([{ label: "Source", url: "https://example.com/source" }]);
    expect(isValidArticleMedia({ type: "image", url: "https://cdn.example.com/hero.jpg" })).toBe(true);
    expect(isValidArticleMedia({ type: "image", url: "javascript:alert(1)" })).toBe(false);
  });
});
