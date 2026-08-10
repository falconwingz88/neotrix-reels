import { useMemo } from "react";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { ArticleCover } from "@/components/ArticleCover";
import { Reveal } from "@/components/Motion";
import { Seo } from "@/components/Seo";
import { formatArticleDate } from "@/content/articles";
import { useArticles } from "@/contexts/ArticlesContext";
import { useProjects } from "@/contexts/ProjectsContext";
import { resolveArticleCovers } from "@/lib/articleCover";
import { getArticleTopicTags, getRelatedProjectsForArticle } from "@/lib/articleLinks";
import { getPublishedArticles } from "@/lib/articles";

const createArticleListSchema = (articles: { slug: string; title: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Articles — Neotrix",
  description: "Practical guides to commercial 3D animation, VFX, product films, and production.",
  url: "https://motion.neotrix.asia/articles",
  isPartOf: {
    "@type": "WebSite",
    name: "Neotrix",
    url: "https://motion.neotrix.asia",
  },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: articles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://motion.neotrix.asia/articles/${article.slug}`,
      name: article.title,
    })),
  },
});

const Articles = () => {
  const { articles, loading } = useArticles();
  const { customProjects } = useProjects();
  const visibleArticles = useMemo(() => getPublishedArticles(articles), [articles]);
  const articleCovers = useMemo(() => resolveArticleCovers(visibleArticles), [visibleArticles]);
  const articleListSchema = useMemo(() => createArticleListSchema(visibleArticles), [visibleArticles]);

  return (
    <>
      <Seo
        title="Articles on 3D Animation, VFX & Production"
        description="Practical guides from Neotrix on 3D animation, product films, VFX, and commercial production in Jakarta and beyond."
        path="/articles"
        structuredData={articleListSchema}
      />

      <section className="page-wrap pb-16 pt-32 sm:pt-40 lg:pb-24">
        <Reveal>
          <p className="eyebrow">Notes from the render room</p>
          <div className="mt-6 grid gap-8 border-b border-white/10 pb-12 lg:grid-cols-[1.3fr_.7fr] lg:items-end">
            <h1 className="max-w-[9ch] text-[clamp(4.2rem,10vw,10rem)] font-medium leading-[.84] tracking-[-0.07em]">
              Useful ideas,
              <span className="block text-white/28">clearly rendered.</span>
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-white/52 lg:pb-2">
              Practical thinking for producers, agencies, and brand teams planning commercial 3D animation, VFX, and product films.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="page-wrap pb-24 lg:pb-36">
        <div className="mb-7 flex items-center justify-between border-y border-white/10 py-4 font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">
          <span>Journal index</span>
          <span>{visibleArticles.length} published notes</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading && Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="min-h-[25rem] animate-pulse rounded-[1.25rem] border border-white/10 bg-white/[.04]" />
          ))}
          {!loading && visibleArticles.map((article, index) => {
            const coverImage = articleCovers.get(article.id || article.slug);
            const relatedProjects = getRelatedProjectsForArticle(article, customProjects, 3);
            const topicTags = getArticleTopicTags(article, 3);
            return (
              <Reveal key={article.slug} delay={index * 0.04}>
                <Link
                  to={`/articles/${article.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#111315] transition-colors hover:border-white/25"
                >
                  <div
                    className={`absolute -right-20 -top-20 size-72 rounded-full blur-[90px] transition-transform duration-700 group-hover:scale-125 ${
                      article.accent === "cyan" ? "bg-[#7DEBFF]/16" : "bg-[#B8FF35]/14"
                    }`}
                  />
                  <ArticleCover
                    src={coverImage || "/article-covers/editorial-production.png"}
                    alt={`Original editorial cover for ${article.shortTitle}`}
                    loading={index < 3 ? "eager" : "lazy"}
                    width={900}
                    height={506}
                    className="aspect-[16/9] border-b border-white/10 transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                  />
                  <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-3 font-mono text-[9px] uppercase tracking-[0.17em] text-white/40">
                    <span>{article.category}</span>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="relative flex flex-1 flex-col p-5 sm:p-6">
                    <p className="mb-4 line-clamp-3 max-w-xl text-sm leading-relaxed text-white/46">{article.description}</p>
                    <h2 className="max-w-[15ch] text-[clamp(1.8rem,3vw,3rem)] font-medium leading-[.96] tracking-[-0.05em]">
                      {article.shortTitle}
                    </h2>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {topicTags.map((tag) => <span key={tag} className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.1em] text-white/38">{tag}</span>)}
                      {relatedProjects.map((project) => <span key={project.id} className="rounded-full border border-[#B8FF35]/20 bg-[#B8FF35]/[.05] px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.1em] text-[#B8FF35]/70">{project.title}</span>)}
                    </div>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-7">
                      <div className="flex items-center gap-4 font-mono text-[9px] uppercase tracking-[0.12em] text-white/38">
                        <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
                        <span className="flex items-center gap-1.5"><Clock3 className="size-3" />{article.readingTime}</span>
                      </div>
                      <span className={`grid size-10 place-items-center rounded-full text-black transition-transform duration-500 group-hover:rotate-45 ${
                        article.accent === "cyan" ? "bg-[#7DEBFF]" : "bg-[#B8FF35]"
                      }`}>
                        <ArrowUpRight className="size-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <Link to="/contact" className="group block border-y border-white/10 bg-[#F4F0E8] px-5 py-16 text-black sm:px-10 sm:py-20">
        <div className="mx-auto flex max-w-[1480px] items-end justify-between gap-8">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/42">Have a brief in mind?</p>
            <p className="mt-4 text-[clamp(2.8rem,7vw,7rem)] font-medium leading-[.88] tracking-[-0.06em]">Let’s make it visible.</p>
          </div>
          <ArrowUpRight className="size-9 shrink-0 transition-transform group-hover:rotate-45 sm:size-14" />
        </div>
      </Link>
    </>
  );
};

export default Articles;
