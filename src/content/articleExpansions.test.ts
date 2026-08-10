import { describe, expect, it } from "vitest";
import { ARTICLE_CONTENT_EXPANSIONS, enrichArticleContent } from "@/content/articleExpansions";
import type { Article } from "@/content/articles";

const thinArticle = (slug: string): Article => ({
  slug,
  title: slug,
  shortTitle: slug,
  description: "A managed article.",
  dek: "A managed article.",
  category: "Guide",
  publishedAt: "2026-07-27",
  modifiedAt: "2026-07-27",
  readingTime: "2 min read",
  accent: "cyan",
  keywords: ["3D animation"],
  takeaway: "A short summary.",
  sections: [{ id: "summary", heading: "Summary", paragraphs: ["A summary."] }],
  faqs: [],
});

describe("managed article content expansions", () => {
  it("covers every previously thin published article", () => {
    expect(Object.keys(ARTICLE_CONTENT_EXPANSIONS)).toHaveLength(20);
    Object.values(ARTICLE_CONTENT_EXPANSIONS).forEach((expansion) => {
      expect(expansion.sections.length).toBeGreaterThanOrEqual(5);
      expect(expansion.faqs.length).toBeGreaterThanOrEqual(3);
      expect(expansion.takeaway.length).toBeGreaterThan(120);
    });
  });

  it("replaces a shallow managed shell with substantial content", () => {
    const enriched = enrichArticleContent(thinArticle("from-key-visual-to-campaign-world-extending-one-idea-across-deliverables"));
    expect(enriched.sections.length).toBe(5);
    expect(enriched.faqs.length).toBe(3);
    expect(enriched.sections.flatMap((item) => item.paragraphs.join(" ")).join(" ").length).toBeGreaterThan(1600);
  });

  it("does not overwrite already-rich managed content", () => {
    const rich = { ...thinArticle("from-key-visual-to-campaign-world-extending-one-idea-across-deliverables"), sections: Array.from({ length: 2 }, (_, index) => ({ id: String(index), heading: "Existing", paragraphs: ["Existing content."] })) };
    expect(enrichArticleContent(rich)).toBe(rich);
  });
});
