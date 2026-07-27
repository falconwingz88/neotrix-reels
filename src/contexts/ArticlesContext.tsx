import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { articles as fallbackArticles, type Article } from "@/content/articles";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { normalizeArticleSlug } from "@/lib/articles";

const ARTICLES_SETTING_KEY = "articles_content";

type ArticlesContextValue = {
  articles: Article[];
  loading: boolean;
  error: string | null;
  managed: boolean;
  saveArticles: (articles: Article[]) => Promise<void>;
  refetch: () => Promise<void>;
};

const ArticlesContext = createContext<ArticlesContextValue | undefined>(undefined);

const parseArticles = (value: string | null | undefined): Article[] | null => {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return null;
    return parsed
      .filter((article): article is Article => Boolean(article && typeof article.slug === "string" && typeof article.title === "string"))
      .map((article) => {
        const titleSlug = normalizeArticleSlug(article.title);
        const storedSlug = normalizeArticleSlug(article.slug);
        const looksConcatenated = titleSlug.length > 0 && storedSlug.length > titleSlug.length && storedSlug.startsWith(titleSlug);
        return looksConcatenated ? { ...article, slug: titleSlug } : article;
      });
  } catch {
    return null;
  }
};

export const ArticlesProvider = ({ children }: { children: ReactNode }) => {
  const { isAdmin } = useAuth();
  const [articles, setArticles] = useState<Article[]>(fallbackArticles);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [managed, setManaged] = useState(false);

  const fetchArticles = useCallback(async () => {
    setError(null);
    const { data, error: fetchError } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", ARTICLES_SETTING_KEY)
      .maybeSingle();

    if (fetchError) {
      console.error("Error loading managed articles:", fetchError);
      setError("Managed articles are unavailable; showing the published fallback.");
      setArticles(fallbackArticles);
      setManaged(false);
    } else {
      const parsed = parseArticles(data?.value);
      setArticles(parsed || fallbackArticles);
      setManaged(Boolean(parsed));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchArticles();
    const channel = supabase
      .channel("articles-content-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_settings" }, (payload) => {
        const next = payload.new as { key?: string; value?: string } | undefined;
        if (next?.key === ARTICLES_SETTING_KEY) void fetchArticles();
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [fetchArticles]);

  const saveArticles = useCallback(async (nextArticles: Article[]) => {
    if (!isAdmin) throw new Error("Only verified admins can edit articles.");
    const normalized = nextArticles.map((article) => ({
      ...article,
      id: article.id || crypto.randomUUID(),
      modifiedAt: new Date().toISOString().slice(0, 10),
    }));
    const { error: saveError } = await supabase
      .from("site_settings")
      .upsert(
        {
          key: ARTICLES_SETTING_KEY,
          value: JSON.stringify(normalized),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" },
      );
    if (saveError) throw saveError;
    setArticles(normalized);
    setManaged(true);
  }, [isAdmin]);

  const value = useMemo(() => ({ articles, loading, error, managed, saveArticles, refetch: fetchArticles }), [articles, loading, error, managed, saveArticles, fetchArticles]);
  return <ArticlesContext.Provider value={value}>{children}</ArticlesContext.Provider>;
};

export const useArticles = () => {
  const context = useContext(ArticlesContext);
  if (!context) throw new Error("useArticles must be used within an ArticlesProvider");
  return context;
};
