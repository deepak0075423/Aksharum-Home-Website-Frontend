import { getSeoFlags, notFound } from "@/lib/seo-flags";
import { SITE_URL } from "@/lib/seo";

// Reads the admin toggles, so it can't be prerendered at build time.
export const dynamic = "force-dynamic";

/**
 * Served at /robots.txt. A route handler rather than Next's robots.ts
 * convention so it can return a real 404 when switched off in the admin panel.
 */
export async function GET(): Promise<Response> {
  const flags = await getSeoFlags();
  if (!flags.robots) return notFound();

  const lines = [
    "User-Agent: *",
    "Allow: /",
    // Admin panel and the API proxy are never useful in search.
    "Disallow: /admin",
    "Disallow: /api/",
    "",
    `Host: ${SITE_URL}`,
  ];

  // Only advertise the sitemap while it is actually being served — pointing
  // crawlers at a 404 is worse than saying nothing.
  if (flags.sitemap) lines.push(`Sitemap: ${SITE_URL}/sitemap.xml`);

  return new Response(lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
