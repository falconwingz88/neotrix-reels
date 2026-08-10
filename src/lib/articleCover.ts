import type { Article } from "@/content/articles";

/**
 * Article covers are intentionally independent from the public project archive.
 * These original editorial images are generated for the journal and selected by
 * topic so a project still can never become an article thumbnail fallback.
 */
export const EDITORIAL_ARTICLE_COVERS = {
  production: "/article-covers/editorial-production.png",
  product: "/article-covers/editorial-product.png",
  hybrid: "/article-covers/editorial-hybrid.png",
  ai: "/article-covers/editorial-ai.png",
  vfx: "/article-covers/editorial-vfx.png",
  virtual: "/article-covers/editorial-virtual.png",
  technology: "/article-covers/editorial-technology.png",
  strategy: "/article-covers/editorial-strategy.png",
} as const;

export type EditorialArticleCoverKey = keyof typeof EDITORIAL_ARTICLE_COVERS;

const normalize = (value: string) => value.trim().toLocaleLowerCase();

const articleSearchText = (article: Article) => normalize([
  article.slug,
  article.title,
  article.shortTitle,
  article.category,
  ...article.keywords,
  ...(article.relatedWork || []).flatMap((work) => [work.label, work.query]),
].filter(Boolean).join(" "));

export const getEditorialArticleCoverKey = (article: Article): EditorialArticleCoverKey => {
  const text = articleSearchText(article);
  if (/virtual production|virtual studio|volumetric|led wall|in-camera/i.test(text)) return "virtual";
  if (/vfx|composit|background replacement|visual effect|matte|rotoscop|tracking/i.test(text)) return "vfx";
  if (/ai|generative|machine learning|synthetic|prompt|veo|runway|cosmos/i.test(text)) return "ai";
  if (/telecom|technology|connectivity|network|5g|digital service|interface/i.test(text)) return "technology";
  if (/hybrid|live action|live-action|photoreal|camera shoot/i.test(text)) return "hybrid";
  if (/product|packaging|device|beverage|material|commercial film/i.test(text)) return "product";
  if (/strategy|choose|brief|studio selection|planning|budget|production guide/i.test(text)) return "strategy";
  return "production";
};

export const getEditorialArticleCover = (article: Article) =>
  EDITORIAL_ARTICLE_COVERS[getEditorialArticleCoverKey(article)];

export const resolveArticleCovers = (articles: Article[], _projects?: unknown[], _width?: number) => {
  const covers = new Map<string, string>();
  articles.forEach((article) => covers.set(article.id || article.slug, getEditorialArticleCover(article)));
  return covers;
};

export const resolveArticleCover = (article: Article) => getEditorialArticleCover(article);
