import { useMemo } from "react";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { ArticleCover } from "@/components/ArticleCover";
import { Reveal } from "@/components/Motion";
import { Seo } from "@/components/Seo";
import { formatArticleDate } from "@/content/articles";
import { useArticles } from "@/contexts/ArticlesContext";
import { useProjects } from "@/contexts/ProjectsContext";
import { resolveArticleCover } from "@/lib/articleCover";
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
      <div className="grid gap-5 lg:grid-cols-2">
        {loading && Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="min-h-[31rem] animate-pulse rounded-[1.6rem] border border-white/10 bg-white/[.04] sm:min-h-[35rem]" />
        ))}
        {!loading && visibleArticles.map((article, index) => {
          const coverImage = resolveArticleCover(article, customProjects, 900);
          return (
          <Reveal key={article.slug} delay={index * 0.08}>
            <Link
              to={`/articles/${article.slug}`}
              className="group relative flex min-h-[31rem] flex-col overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#111315] p-6 transition-colors hover:border-white/25 sm:min-h-[35rem] sm:p-8"
            >
              <div
                className={`absolute -right-20 -top-20 size-72 rounded-full blur-[90px] transition-transform duration-700 group-hover:scale-125 ${
                  article.accent === "cyan" ? "bg-[#7DEBFF]/16" : "bg-[#B8FF35]/14"
                }`}
              />
              {coverImage && (
                <ArticleCover
                  src={coverImage}
                  alt={`${article.shortTitle} project screenshot`}
                  loading={index < 2 ? "eager" : "lazy"}
                  width={900}
                  height={506}
                  className="mt-5 aspect-[16/9] rounded-[1.1rem] border border-white/10 transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                />
              )}
              <div className="relative flex items-center justify-between border-b border-white/10 pb-4 font-mono text-[9px] uppercase tracking-[0.17em] text-white/40">
                <span>{article.category}</span>
                <span>0{index + 1}</span>
              </div>
              <div className="relative mt-auto pt-24">
                <p className="mb-5 max-w-xl text-sm leading-relaxed text-white/46">{article.description}</p>
                <h2 className="max-w-[13ch] text-[clamp(2.2rem,4.5vw,4.7rem)] font-medium leading-[.94] tracking-[-0.055em]">
                  {article.shortTitle}
                </h2>
                <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4 font-mono text-[9px] uppercase tracking-[0.12em] text-white/38">
                    <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
                    <span className="flex items-center gap-1.5"><Clock3 className="size-3" />{article.readingTime}</span>
                  </div>
                  <span className={`grid size-12 place-items-center rounded-full text-black transition-transform duration-500 group-hover:rotate-45 ${
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
