import type { Article, ArticleLink, ArticleMedia } from "@/content/articles";
import { isSafeHttpUrl } from "@/lib/url";

export const normalizeArticleSlug = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90);

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
