import type { MetadataRoute } from "next";
import { getBlogs } from "@/lib/blogs";
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

// Served at /sitemap.xml — built from the DB's indexable pages and posts.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, posts] = await Promise.all([fetchPublicPages(), getBlogs()]);

  const entries: MetadataRoute.Sitemap = pages.map((p) => ({
    url: `${SITE_URL}${canonicalPath(p.slug)}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: p.slug === "home" ? "daily" : "weekly",
    priority: PRIORITY[p.slug] ?? 0.5,
  }));

  // The blog index, then each published post — newest first, so the most
  // recent content sits highest in the file.
  if (posts.length > 0) {
    entries.push({
      url: `${SITE_URL}/blogs`,
      lastModified: new Date(posts[0].updatedAt),
      changeFrequency: "weekly",
      priority: 0.7,
    });
    for (const post of posts) {
      entries.push({
        url: `${SITE_URL}/blogs/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

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
