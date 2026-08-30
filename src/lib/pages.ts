import { cache } from "react";
import { STATIC_ROUTES } from "./generated-routes";
import { canonicalPath, NOINDEX_SLUGS } from "./seo";

const API = process.env.API_URL ?? "http://localhost:4000/api";

export interface PublicPage {
  slug: string;
  title: string;
  metaDescription: string;
  updatedAt: string;
}

/**
 * Every indexable page in the CMS. Fetched per request (never cached) so a
 * page published from the admin panel shows up in the sitemap and llms.txt
 * immediately, with no rebuild.
 */
export const getPublicPages = cache(async (): Promise<PublicPage[]> => {
  try {
    const res = await fetch(`${API}/pages/public`, { cache: "no-store" });
    if (!res.ok) return [];
    const rows = (await res.json()) as Partial<PublicPage>[];
    return rows
      .filter((r): r is PublicPage => typeof r.slug === "string")
      .map((r) => ({
        slug: r.slug,
        // Older backends returned slug + updatedAt only; fall back gracefully.
        title: r.title ?? "",
        metaDescription: r.metaDescription ?? "",
        updatedAt: r.updatedAt ?? new Date().toISOString(),
      }));
  } catch {
    return [];
  }
});

/**
 * Routes that exist as files under src/app rather than as CMS rows — the
 * generated list, minus anything the CMS already covers and minus the
 * noindex slugs. Keeps a hand-coded page from being silently unlisted.
 */
export function fileRoutesNotInCms(pages: PublicPage[]): string[] {
  const covered = new Set(pages.map((p) => canonicalPath(p.slug)));
  for (const slug of NOINDEX_SLUGS) covered.add(canonicalPath(slug));
  return STATIC_ROUTES.filter((route) => !covered.has(route));
}
