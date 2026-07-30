import type { MetadataRoute } from "next";
import { canonicalPath, SITE_URL } from "@/lib/seo";

const API = process.env.API_URL ?? "http://localhost:4000/api";

interface PublicPage {
  slug: string;
  updatedAt: string;
}

// Relative importance per page — guides crawl budget, not rankings.
const PRIORITY: Record<string, number> = {
  home: 1.0,
  features: 0.9,
  services: 0.9,
  demo: 0.8,
  contact: 0.8,
  about: 0.7,
  career: 0.6,
  privacy: 0.3,
  terms: 0.3,
  "terms-conditions": 0.3,
};

async function fetchPublicPages(): Promise<PublicPage[]> {
  try {
    const res = await fetch(`${API}/pages/public`, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as PublicPage[];
  } catch {
    return [];
  }
}

// Served at /sitemap.xml — built from the DB's indexable pages.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await fetchPublicPages();

  const entries: MetadataRoute.Sitemap = pages.map((p) => ({
    url: `${SITE_URL}${canonicalPath(p.slug)}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: p.slug === "home" ? "daily" : "weekly",
    priority: PRIORITY[p.slug] ?? 0.5,
  }));

  // Never emit an empty sitemap if the API is unreachable at build time.
  if (entries.length === 0) {
    entries.push({
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    });
  }

  return entries;
}
