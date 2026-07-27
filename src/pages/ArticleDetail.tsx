import { ArrowLeft, ArrowUpRight, Clock3, Edit2, ExternalLink } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArticleCover } from "@/components/ArticleCover";
import { Reveal } from "@/components/Motion";
import { Seo } from "@/components/Seo";
import { formatArticleDate, type Article } from "@/content/articles";
import { useArticles } from "@/contexts/ArticlesContext";
import { useProjects } from "@/contexts/ProjectsContext";
import { YouTubeFacade } from "@/components/YouTubeFacade";
import { getYouTubeVideoId } from "@/lib/youtube";
import { getPublishedArticles, mergeRelatedWork } from "@/lib/articles";
import { resolveArticleCover } from "@/lib/articleCover";
import { optimizedProjectPoster, publicProjects } from "@/lib/projects";
import { useAuth } from "@/contexts/AuthContext";

const SITE_URL = "https://motion.neotrix.asia";

const createArticleSchema = (article: Article) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: article.title,
      description: article.description,
      datePublished: article.publishedAt,
      dateModified: article.modifiedAt,
      mainEntityOfPage: `${SITE_URL}/articles/${article.slug}`,
      inLanguage: "en",
      author: {
        "@type": "Organization",
        name: "Neotrix",
        url: SITE_URL,
      },
      publisher: {
        "@type": "Organization",
        name: "Neotrix",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/neotrix-favicon-blue.jpg`,
        },
      },
      about: article.keywords,
      keywords: article.keywords.join(", "),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Articles", item: `${SITE_URL}/articles` },
        { "@type": "ListItem", position: 3, name: article.shortTitle, item: `${SITE_URL}/articles/${article.slug}` },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: article.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ],
});

const ArticleDetail = () => {
  const { slug } = useParams();
  const { articles, loading } = useArticles();
  const { customProjects } = useProjects();
  const { isAdmin } = useAuth();
  const article = getPublishedArticles(articles).find((candidate) => candidate.slug === slug);
  if (loading) {
    return <div className="page-wrap min-h-screen pb-24 pt-40"><div className="h-24 w-3/4 animate-pulse rounded-2xl bg-white/[.06]" /></div>;
  }
  if (!article) return <Navigate to="/articles" replace />;

  const related = getPublishedArticles(articles).find((candidate) => candidate.slug !== article.slug);
  const visibleProjects = publicProjects(customProjects);
  const attachedProjects = article.relatedProjectIds
    ?.map((id) => visibleProjects.find((project) => project.id === id))
    .filter((project): project is NonNullable<typeof project> => Boolean(project))
    || [];
  const attachedWork = attachedProjects.map((project) => ({ label: project.title, query: project.title }));
  const relatedWork = mergeRelatedWork(article.relatedWork, attachedWork);
  const relatedProjectCards = relatedWork.map((work) => ({
    work,
    project: attachedProjects.find((project) => project.title === work.label)
      || visibleProjects.find((project) => project.title === work.label || project.title === work.query),
  }));
  const coverImage = resolveArticleCover(article, customProjects, 1400);
  const schema = createArticleSchema(article);

  return (
    <>
      <Seo
        title={article.title}
        description={article.description}
        path={`/articles/${article.slug}`}
        type="article"
        publishedTime={article.publishedAt}
        modifiedTime={article.modifiedAt}
        structuredData={schema}
      />

      <article>
        <header className="page-wrap pb-14 pt-32 sm:pt-40 lg:pb-20">
          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/articles"
                className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.17em] text-white/42 hover:text-[#7DEBFF]"
              >
                <ArrowLeft className="size-3.5" /> All articles
              </Link>
              {isAdmin && (
                <Link
                  to={`/admin?tab=articles&editArticle=${encodeURIComponent(article.id || article.slug)}`}
                  className="inline-flex items-center gap-2 rounded-full border border-[#B8FF35]/35 bg-[#B8FF35]/10 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.15em] text-[#B8FF35] transition-colors hover:border-[#B8FF35] hover:bg-[#B8FF35]/20"
                >
                  <Edit2 className="size-3.5" /> Edit article
                </Link>
              )}
            </div>
            <div className="mt-8 border-y border-white/10 py-5">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">
                <span className={article.accent === "cyan" ? "text-[#7DEBFF]" : "text-[#B8FF35]"}>{article.category}</span>
                <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
                <span className="flex items-center gap-1.5"><Clock3 className="size-3" />{article.readingTime}</span>
              </div>
            </div>
            <h1 className="mt-8 max-w-[15ch] text-[clamp(3.5rem,8vw,8.8rem)] font-medium leading-[.87] tracking-[-0.068em]">
              {article.title}
            </h1>
            <p className="mt-8 max-w-4xl text-[clamp(1.25rem,2.2vw,2rem)] leading-[1.28] tracking-[-0.022em] text-white/56">
              {article.dek}
            </p>
          </Reveal>
        </header>

        {coverImage && (
          <div className="page-wrap pb-14 lg:pb-20">
            <ArticleCover
              src={coverImage}
              alt={`${article.shortTitle} project screenshot`}
              loading="eager"
              width={1400}
              height={613}
              className="aspect-[16/7] rounded-[1.35rem] border border-white/10"
            />
          </div>
        )}

        <div className="page-wrap grid gap-12 pb-24 lg:grid-cols-[14rem_minmax(0,46rem)] lg:justify-center lg:gap-20 lg:pb-36">
          <aside className="hidden lg:block">
            <nav aria-label="Article contents" className="sticky top-28 border-l border-white/12 pl-5">
              <p className="mb-4 font-mono text-[8px] uppercase tracking-[0.18em] text-white/28">In this article</p>
              <div className="grid gap-3">
                {article.sections.map((section, index) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="group grid grid-cols-[1.5rem_1fr] gap-2 text-[11px] leading-snug text-white/38 hover:text-white"
                  >
                    <span className="font-mono text-[8px] text-white/20 group-hover:text-[#B8FF35]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{section.heading}</span>
                  </a>
                ))}
              </div>
            </nav>
          </aside>

          <div className="min-w-0">
            <Reveal>
              <div className={`mb-14 rounded-[1.35rem] border p-6 sm:p-8 ${
                article.accent === "cyan"
                  ? "border-[#7DEBFF]/25 bg-[#7DEBFF]/[.065]"
                  : "border-[#B8FF35]/25 bg-[#B8FF35]/[.06]"
              }`}>
                <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/35">The short answer</p>
                <p className="mt-4 text-xl leading-relaxed tracking-[-0.02em] text-white/82 sm:text-2xl">{article.takeaway}</p>
              </div>
            </Reveal>

            {article.media && article.media.length > 0 && (
              <div className="mb-14 grid gap-5">
                {article.media.map((media, index) => (
                  <figure key={media.url + index} className="overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#111315]">
                    {media.type === "video" && getYouTubeVideoId(media.url) ? (
                      <YouTubeFacade url={media.url} title={media.caption || article.title} />
                    ) : media.type === "video" ? (
                      <video className="aspect-video w-full bg-black object-cover" controls preload="metadata" src={media.url}>
                        Your browser does not support embedded video.
                      </video>
                    ) : (
                      <img src={media.url} alt={media.alt || media.caption || article.title} loading={index === 0 ? "eager" : "lazy"} decoding="async" className="max-h-[38rem] w-full object-contain object-center" />
                    )}
                    {media.caption && <figcaption className="px-5 py-3 font-mono text-[9px] uppercase tracking-[0.12em] text-white/40">{media.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            )}

            <div className="divide-y divide-white/10 border-t border-white/10">
              {article.sections.map((section, index) => (
                <section key={section.id} id={section.id} className="scroll-mt-28 py-12 sm:py-16">
                  <Reveal>
                    <div className="mb-7 flex items-start gap-4">
                      <span className={`mt-2 font-mono text-[9px] ${article.accent === "cyan" ? "text-[#7DEBFF]" : "text-[#B8FF35]"}`}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-medium leading-[1.02] tracking-[-0.045em]">{section.heading}</h2>
                    </div>
                    <div className="space-y-6 text-[1.05rem] leading-[1.78] text-white/62 sm:text-[1.12rem]">
                      {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                      {section.bullets && (
                        <ul className="grid gap-3 pt-2">
                          {section.bullets.map((bullet) => (
                            <li key={bullet} className="grid grid-cols-[.65rem_1fr] gap-3">
                              <span className={`mt-[.72rem] size-1.5 rounded-full ${article.accent === "cyan" ? "bg-[#7DEBFF]" : "bg-[#B8FF35]"}`} />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </Reveal>
                </section>
              ))}
            </div>

            <section className="border-t border-white/10 py-12 sm:py-16" aria-labelledby="article-faq-heading">
              <Reveal>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#7DEBFF]">Frequently asked</p>
                <h2 id="article-faq-heading" className="mt-4 text-4xl font-medium tracking-[-0.05em] sm:text-5xl">Clear answers.</h2>
                <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
                  {article.faqs.map((faq) => (
                    <details key={faq.question} className="group py-5">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-lg font-medium tracking-[-0.02em] marker:hidden">
                        {faq.question}
                        <span className="font-mono text-lg font-light text-[#B8FF35] transition-transform group-open:rotate-45">+</span>
                      </summary>
                      <p className="max-w-2xl pt-4 leading-relaxed text-white/56">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </Reveal>
            </section>

            {relatedWork.length > 0 && (
              <section className="border-t border-white/10 py-12 sm:py-16" aria-labelledby="related-work-heading">
                <Reveal>
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#7DEBFF]">From the Neotrix archive</p>
                  <div className="mt-4 flex items-end justify-between gap-6">
                    <h2 id="related-work-heading" className="text-4xl font-medium tracking-[-0.05em] sm:text-5xl">See it in motion.</h2>
                    <ArrowUpRight className="hidden size-6 text-[#B8FF35] sm:block" />
                  </div>
                  <div className="mt-7 grid gap-4 sm:grid-cols-2">
                    {relatedProjectCards.map(({ work, project }) => project ? (
                      <Link
                        key={project.id}
                        to={`/projects/${project.id}`}
                        className="group overflow-hidden rounded-[1.2rem] border border-white/12 bg-white/[.035] transition-colors hover:border-[#B8FF35]/70"
                      >
                        <div className="relative aspect-[16/9] overflow-hidden bg-[#111315]">
                          <ArticleCover
                            src={optimizedProjectPoster(project, 720)}
                            alt={`${project.title} project thumbnail`}
                            loading="lazy"
                            width={720}
                            height={405}
                            className="size-full transition-transform duration-700 group-hover:scale-[1.04]"
                          />
                          <ArrowUpRight className="absolute bottom-4 right-4 size-4 text-[#B8FF35] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                        <div className="flex items-end justify-between gap-4 p-4">
                          <div>
                            <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/38">{project.client || "Neotrix"}{project.year ? ` / ${project.year}` : ""}</p>
                            <h3 className="mt-2 text-lg font-medium tracking-[-0.025em] text-white/85 group-hover:text-[#B8FF35]">{project.title}</h3>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <Link
                        key={work.label}
                        to={work.query ? "/projects?query=" + encodeURIComponent(work.query) : "/projects"}
                        className="inline-flex items-center justify-between gap-2 rounded-[1.2rem] border border-white/15 px-4 py-4 font-mono text-[9px] uppercase tracking-[0.12em] text-white/65 hover:border-[#B8FF35] hover:text-[#B8FF35]"
                      >
                        {work.label} <ArrowUpRight className="size-3" />
                      </Link>
                    ))}
                  </div>
                </Reveal>
              </section>
            )}

            {article.externalLinks && article.externalLinks.length > 0 && (
              <section className="border-t border-white/10 py-12 sm:py-16" aria-labelledby="article-links-heading">
                <Reveal>
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#7DEBFF]">Further reading</p>
                  <h2 id="article-links-heading" className="mt-4 text-4xl font-medium tracking-[-0.05em] sm:text-5xl">Useful references.</h2>
                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    {article.externalLinks.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center justify-between gap-4 rounded-xl border border-white/12 bg-white/[.03] px-4 py-4 text-sm text-white/68 transition-colors hover:border-[#7DEBFF]/50 hover:text-white"
                      >
                        <span className="truncate">{link.label}</span>
                        <ExternalLink className="size-4 shrink-0 text-[#B8FF35] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </a>
                    ))}
                  </div>
                </Reveal>
              </section>
            )}
          </div>
        </div>
      </article>

      {related && (
        <section className="border-t border-white/10 bg-[#111315]">
          <Link to={`/articles/${related.slug}`} className="group page-wrap flex items-end justify-between gap-8 py-16 sm:py-24">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/35">Read next</p>
              <h2 className="mt-5 max-w-[16ch] text-[clamp(2.7rem,6vw,6rem)] font-medium leading-[.91] tracking-[-0.058em] group-hover:text-[#7DEBFF]">
                {related.shortTitle}
              </h2>
            </div>
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-[#F4F0E8] text-black transition-transform group-hover:rotate-45 sm:size-20">
              <ArrowUpRight className="size-5 sm:size-7" />
            </span>
          </Link>
        </section>
      )}

      <section className="bg-[#B8FF35] text-black">
        <div className="page-wrap flex flex-col gap-7 py-14 sm:flex-row sm:items-end sm:justify-between sm:py-20">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/45">Planning a commercial project?</p>
            <p className="mt-4 text-[clamp(2.5rem,6vw,6rem)] font-medium leading-[.9] tracking-[-0.06em]">Bring us the brief.</p>
          </div>
          <Link to="/contact" className="inline-flex w-fit items-center gap-3 rounded-full bg-black px-6 py-4 text-sm font-semibold text-white">
            Start a project <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
};

export default ArticleDetail;
