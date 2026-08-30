import { cache } from "react";

const API = process.env.API_URL ?? "http://localhost:4000/api";

export interface SeoFlags {
  sitemap: boolean;
  robots: boolean;
  llms: boolean;
}

// When the backend can't be reached the honest answer is "unknown", so we use
// the same off-by-default the backend does. Serving a sitemap built from a
// failed fetch would be worse than serving none: it would list only the few
// URLs that survived the failure, and telling Google the site is one page long
// does more damage than a temporary 404.
const FALLBACK: SeoFlags = { sitemap: false, robots: false, llms: false };

/**
 * Which SEO files this environment serves, toggled from the admin panel
 * (Settings → SEO files). The flags live in the database, and local, staging
 * and production each have their own — so switching a file off locally has
 * no effect on production. All three start off until someone turns them on.
 */
export async function fetchSeoFlags(): Promise<SeoFlags> {
  try {
    const res = await fetch(`${API}/settings/seo`, { cache: "no-store" });
    if (!res.ok) return FALLBACK;
    const data = (await res.json()) as Partial<SeoFlags>;
    return {
      sitemap: data.sitemap ?? false,
      robots: data.robots ?? false,
      llms: data.llms ?? false,
    };
  } catch {
    return FALLBACK;
  }
}

/**
 * Request-deduplicated version for route handlers. Middleware runs outside
 * React, so it calls fetchSeoFlags() directly instead.
 */
export const getSeoFlags = cache(fetchSeoFlags);

/**
 * Last-resort body for a disabled file.
 *
 * In normal operation nobody sees this: the proxy (src/proxy.ts) intercepts
 * these three paths first and rewrites them to the site's own 404 page. This
 * stays as the authoritative guard, so the file still cannot leak if the
 * proxy's matcher is ever changed — next/navigation's notFound() is no use
 * here, as a route handler has no React tree and returns an empty body.
 */
export function notFound(): Response {
  return new Response("Not found", {
    status: 404,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
