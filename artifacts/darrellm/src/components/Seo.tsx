import { useEffect } from "react";

export const SITE_URL = "https://darrell.synapex.co.zw";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph.jpg`;

type StructuredData = Record<string, unknown>;

type SeoProps = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  image?: string;
  noIndex?: boolean;
  structuredData?: StructuredData;
};

const setMeta = (selector: string, attributes: Record<string, string>, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => element!.setAttribute(key, value));
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

const Seo = ({
  title,
  description,
  path,
  type = "website",
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
  structuredData,
}: SeoProps) => {
  const structuredDataString = JSON.stringify(structuredData || {});

  useEffect(() => {
    const canonicalUrl = `${SITE_URL}${path === "/" ? "/" : path.replace(/\/$/, "")}`;
    document.title = title;
    document.documentElement.lang = "en";

    setMeta('meta[name="description"]', { name: "description" }, description);
    setMeta('meta[name="author"]', { name: "author" }, "Darrell Mucheri");
    setMeta('meta[name="robots"]', { name: "robots" }, noIndex ? "noindex, nofollow" : "index, follow");
    setMeta('meta[property="og:title"]', { property: "og:title" }, title);
    setMeta('meta[property="og:description"]', { property: "og:description" }, description);
    setMeta('meta[property="og:type"]', { property: "og:type" }, type);
    setMeta('meta[property="og:url"]', { property: "og:url" }, canonicalUrl);
    setMeta('meta[property="og:image"]', { property: "og:image" }, image);
    setMeta('meta[name="twitter:card"]', { name: "twitter:card" }, "summary_large_image");
    setMeta('meta[name="twitter:title"]', { name: "twitter:title" }, title);
    setMeta('meta[name="twitter:description"]', { name: "twitter:description" }, description);
    setMeta('meta[name="twitter:image"]', { name: "twitter:image" }, image);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    const existingStructuredData = document.head.querySelector<HTMLScriptElement>("#site-structured-data");
    if (structuredData && Object.keys(structuredData).length > 0) {
      const script = existingStructuredData || document.createElement("script");
      script.id = "site-structured-data";
      script.type = "application/ld+json";
      script.textContent = structuredDataString;
      if (!existingStructuredData) document.head.appendChild(script);
    } else {
      existingStructuredData?.remove();
    }
  }, [description, image, noIndex, path, structuredDataString, title, type]);

  return null;
};

export default Seo;