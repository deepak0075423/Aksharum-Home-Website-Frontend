const API = process.env.API_URL ?? "http://localhost:4000/api";

// The icon is admin-uploadable, so this proxies the current branding favicon
// rather than shipping a static file.
export const dynamic = "force-dynamic";

/**
 * Served at /favicon.ico.
 *
 * The favicon itself lives behind /api/layout/favicon, which robots.txt has to
 * keep mostly disallowed. Google looks for a root /favicon.ico before anything
 * else and will fall back to a generic globe when it finds nothing, so the icon
 * needs to exist here too — on the site's own origin, outside /api.
 */
export async function GET(): Promise<Response> {
  try {
    const res = await fetch(`${API}/layout/favicon`, { cache: "no-store" });
    if (!res.ok) return new Response(null, { status: 404 });

    return new Response(res.body, {
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "image/png",
        // Icons change rarely and crawlers re-fetch them on their own schedule.
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
