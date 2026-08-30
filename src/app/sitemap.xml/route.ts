import { getBlogs } from "@/lib/blogs";
import { fileRoutesNotInCms, getPublicPages } from "@/lib/pages";
import { getSeoFlags, notFound } from "@/lib/seo-flags";
import { canonicalPath, SITE_URL } from "@/lib/seo";

// Built fresh on every request. Without this the route can be prerendered at
// build time and frozen — if the API happens to be unreachable during the
// build, the deployed sitemap silently ends up holding nothing but the
// homepage until someone rebuilds.
export const dynamic = "force-dynamic";

// Relative importance per page — guides crawl budget, not rankings.
const PRIORITY: Record<string, number> = {
  home: 1.0,
  features: 0.9,
  services: 0.9,
  demo: 0.8,
  contact: 0.8,
  about: 0.7,
  career: 0.6,
  blogs: 0.7,
  privacy: 0.3,
  terms: 0.3,
  "terms-conditions": 0.3,
};

/** Anything not named above is new; 0.5 is a sane middle default. */
function priorityFor(slug: string): number {
  return PRIORITY[slug] ?? 0.5;
}

interface UrlEntry {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: number;
}

/** The five characters that must be escaped inside sitemap XML. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toXml(entries: UrlEntry[]): string {
  const urls = entries
    .map(
      (e) =>
        `<url>\n<loc>${escapeXml(e.loc)}</loc>\n<lastmod>${e.lastmod}</lastmod>\n` +
        `<changefreq>${e.changefreq}</changefreq>\n<priority>${e.priority}</priority>\n</url>`,
    )
    .join("\n");
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  );
}

/**
 * Served at /sitemap.xml — merged from the CMS, the blog, and any page added
 * straight to the codebase. New content of all three kinds lands here on its
 * own; nothing needs to be registered by hand.
 *
 * Written as a route handler rather than Next's sitemap.ts convention so it
 * can return a real 404 when switched off in the admin panel.
 */
export async function GET(): Promise<Response> {
  const flags = await getSeoFlags();
  if (!flags.sitemap) return notFound();

  const [pages, posts] = await Promise.all([getPublicPages(), getBlogs()]);

  // Keyed by URL so a page reachable two ways is only ever listed once.
  const entries = new Map<string, UrlEntry>();
  const add = (entry: UrlEntry) => {
    if (!entries.has(entry.loc)) entries.set(entry.loc, entry);
  };

  for (const page of pages) {
    add({
      loc: `${SITE_URL}${canonicalPath(page.slug)}`,
      lastmod: new Date(page.updatedAt).toISOString(),
      changefreq: page.slug === "home" ? "daily" : "weekly",
      priority: priorityFor(page.slug),
    });
  }

  // The blog index, then each published post — newest first, so the most
  // recent content sits highest in the file.
  if (posts.length > 0) {
    add({
      loc: `${SITE_URL}/blogs`,
      lastmod: new Date(posts[0].updatedAt).toISOString(),
      changefreq: "weekly",
      priority: 0.7,
    });
    for (const post of posts) {
      add({
        loc: `${SITE_URL}/blogs/${post.slug}`,
        lastmod: new Date(post.updatedAt).toISOString(),
        changefreq: "monthly",
        priority: 0.6,
      });
    }
  }

  // File-based routes with no CMS row behind them (see scripts/generate-routes.mjs).
  for (const route of fileRoutesNotInCms(pages)) {
    add({
      loc: `${SITE_URL}${route}`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: priorityFor(route.replace(/^\//, "")),
    });
  }

  // Never emit an empty sitemap if the API is unreachable.
  if (entries.size === 0) {
    add({
      loc: `${SITE_URL}/`,
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      priority: 1,
    });
  }

  return new Response(toXml([...entries.values()]), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
