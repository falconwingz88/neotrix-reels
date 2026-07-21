import { useEffect } from "react";

const SITE_URL = "https://motion.neotrix.asia";
const DEFAULT_IMAGE = SITE_URL + "/og.png";

type SeoProps = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "video.other";
  structuredData?: Record<string, unknown>;
};

const upsertMeta = (selector: string, attribute: "name" | "property", key: string, content: string) => {
  let node = document.head.querySelector<HTMLMetaElement>(selector);
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute(attribute, key);
    document.head.appendChild(node);
  }
  node.content = content;
};

export const Seo = ({ title, description, path = "/", image = DEFAULT_IMAGE, type = "website", structuredData }: SeoProps) => {
  useEffect(() => {
    const fullTitle = title.includes("Neotrix") ? title : title + " — Neotrix";
    const canonical = SITE_URL + (path === "/" ? "/" : path);
    document.title = fullTitle;
    upsertMeta('meta[name="description"]', "name", "description", description);
    upsertMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    upsertMeta('meta[property="og:description"]', "property", "og:description", description);
    upsertMeta('meta[property="og:url"]', "property", "og:url", canonical);
    upsertMeta('meta[property="og:type"]', "property", "og:type", type);
    upsertMeta('meta[property="og:image"]', "property", "og:image", image);
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", image);
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;
    const id = "route-structured-data";
    document.getElementById(id)?.remove();
    if (structuredData) {
      const script = document.createElement("script");
      script.id = id;
      script.type = "application/ld+json";
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }, [description, image, path, structuredData, title, type]);
  return null;
};
