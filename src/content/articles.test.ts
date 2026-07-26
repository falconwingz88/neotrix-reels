import { describe, expect, it } from "vitest";
import { articles, getArticleBySlug } from "@/content/articles";

describe("article content", () => {
  it("provides seven unique, resolvable article slugs", () => {
    expect(articles).toHaveLength(7);
    expect(new Set(articles.map((article) => article.slug)).size).toBe(articles.length);
    articles.forEach((article) => expect(getArticleBySlug(article.slug)).toBe(article));
  });

  it("includes the content search and answer engines need", () => {
    articles.forEach((article) => {
      expect(article.title.length).toBeGreaterThan(30);
      expect(article.description.length).toBeGreaterThan(100);
      expect(article.description.length).toBeLessThanOrEqual(180);
      expect(article.keywords.length).toBeGreaterThanOrEqual(4);
      expect(article.sections.length).toBeGreaterThanOrEqual(7);
      expect(article.faqs.length).toBeGreaterThanOrEqual(3);
      expect(article.takeaway.length).toBeGreaterThan(80);
    });
  });
});
