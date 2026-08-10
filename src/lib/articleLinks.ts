import { Link } from "react-router-dom";
import { createElement, Fragment, type ReactNode } from "react";
import type { Article } from "@/content/articles";
import type { CustomProject } from "@/contexts/ProjectsContext";
import { publicProjects } from "@/lib/projects";

const STOP_WORDS = new Set([
  "about", "after", "animation", "and", "are", "brand", "commercial", "from", "guide", "how", "into", "more",
  "production", "studio", "that", "the", "their", "this", "with", "work", "your",
]);

const normalize = (value: string) => value.trim().toLocaleLowerCase();

const tokens = (value: string) => normalize(value)
  .replace(/[^a-z0-9+]+/g, " ")
  .split(/\s+/)
  .filter((token) => token.length > 3 && !STOP_WORDS.has(token));

const articleText = (article: Article) => [
  article.title,
  article.shortTitle,
  article.category,
  ...article.keywords,
  ...(article.relatedWork || []).flatMap((work) => [work.label, work.query]),
].filter(Boolean).join(" ");

const keywordOverlap = (a: Article, b: Article) => {
  const aTerms = new Set(tokens(articleText(a)));
  return tokens(articleText(b)).filter((term) => aTerms.has(term));
};

export const getRelatedArticles = (article: Article, articles: Article[], limit = 3) => {
  const currentCategory = normalize(article.category);
  return articles
    .filter((candidate) => candidate.slug !== article.slug && candidate.isPublished !== false)
    .map((candidate) => {
      const overlap = keywordOverlap(article, candidate);
      const categoryMatch = currentCategory && normalize(candidate.category) === currentCategory ? 4 : 0;
      const titleMatch = tokens(candidate.title).filter((term) => tokens(article.title).includes(term)).length * 2;
      const score = categoryMatch + overlap.length + titleMatch;
      return { candidate, score };
    })
    .filter(({ score }) => score > 1)
    .sort((a, b) => b.score - a.score || b.candidate.publishedAt.localeCompare(a.candidate.publishedAt))
    .slice(0, limit)
    .map(({ candidate }) => candidate);
};

const projectText = (project: CustomProject) => normalize([
  project.title,
  project.client,
  project.description,
  project.credits,
  ...project.tags,
].filter(Boolean).join(" "));

export const getRelatedProjectsForArticle = (article: Article, projects: CustomProject[], limit = 4) => {
  const visible = publicProjects(projects);
  const manualIds = new Set(article.relatedProjectIds || []);
  const searchTerms = new Set(tokens(articleText(article)));
  const manual = visible.filter((project) => manualIds.has(project.id));
  const automatic = visible
    .filter((project) => !manualIds.has(project.id))
    .map((project) => {
      const haystack = projectText(project);
      const termScore = Array.from(searchTerms).filter((term) => haystack.includes(term)).length;
      const phraseScore = [article.title, article.category, ...(article.relatedWork || []).map((work) => work.label)]
        .filter((phrase) => phrase.length > 5 && haystack.includes(normalize(phrase))).length;
      return { project, score: termScore + phraseScore * 3 };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.project.title.localeCompare(b.project.title))
    .map(({ project }) => project);

  // Keep manually curated links first, then add the strongest keyword matches.
  // The fallback is intentionally conservative: it never turns an unrelated
  // project into a tag just to fill space.
  return [...manual, ...automatic].slice(0, limit);
};

export const getArticleTopicTags = (article: Article, limit = 5) => Array.from(new Set([
  article.category,
  ...article.keywords,
])).filter(Boolean).slice(0, limit);

export const renderArticleParagraphWithLinks = (paragraph: string, article: Article, articles: Article[]): ReactNode => {
  const related = getRelatedArticles(article, articles, 4);
  const match = related
    .flatMap((candidate) => [candidate.shortTitle, candidate.title, ...(candidate.keywords || [])])
    .filter((phrase) => phrase && phrase.length >= 7)
    .sort((a, b) => b.length - a.length)
    .map((phrase) => ({ phrase, index: paragraph.toLocaleLowerCase().indexOf(phrase.toLocaleLowerCase()) }))
    .find(({ index }) => index >= 0);

  if (!match) return paragraph;
  const before = paragraph.slice(0, match.index);
  const linkedText = paragraph.slice(match.index, match.index + match.phrase.length);
  const after = paragraph.slice(match.index + match.phrase.length);
  const target = related.find((candidate) => [candidate.shortTitle, candidate.title, ...(candidate.keywords || [])].some((phrase) => normalize(phrase) === normalize(match.phrase)));
  if (!target) return paragraph;

  return createElement(
    Fragment,
    null,
    before,
    createElement(Link, { to: `/articles/${target.slug}`, className: "article-inline-link" }, linkedText),
    after,
  );
};
