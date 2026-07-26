import type { Article, ArticleLink, ArticleMedia, RelatedWork } from "@/content/articles";
import { isSafeHttpUrl } from "@/lib/url";

export const normalizeArticleSlug = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90);

export const getArticleIdentity = (article: Pick<Article, "id" | "slug">) =>
  article.id?.trim() || normalizeArticleSlug(article.slug);

export const mergeRelatedWork = (saved: RelatedWork[] | undefined, resolved: RelatedWork[]) => {
  const seen = new Set<string>();
  return [...(saved || []), ...resolved].filter((work) => {
    const key = `${work.label.trim().toLowerCase()}|${work.query.trim().toLowerCase()}`;
    if (!work.label.trim() || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const hasDuplicateArticleSlug = (articles: Article[]) => {
  const slugs = articles.map((article) => normalizeArticleSlug(article.slug)).filter(Boolean);
  return new Set(slugs).size !== slugs.length;
};

export const getPublishedArticles = (articles: Article[]) => articles.filter((article) => article.isPublished !== false);

export const sanitizeArticleLinks = (links: ArticleLink[] | undefined) =>
  (links || []).filter((link) => link.label.trim() && isSafeHttpUrl(link.url.trim())).map((link) => ({
    label: link.label.trim(),
    url: link.url.trim(),
  }));

export const isValidArticleMedia = (media: ArticleMedia) =>
  isSafeHttpUrl(media.url.trim()) && (media.type === "image" || media.type === "video");
