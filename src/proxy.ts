import { NextRequest, NextResponse } from "next/server";
import { fetchSeoFlags, type SeoFlags } from "@/lib/seo-flags";

// Slugs must match /^[a-z0-9][a-z0-9-]*$/ (see the backend's CreatePageDto),
// so a path starting with an underscore can never be a real CMS page. Rewriting
// to one therefore always lands on the catch-all's notFound() — which renders
// the admin-editable 404 page, with a genuine 404 status.
const NOT_FOUND_PATH = "/_seo-disabled";

// The crawler-facing files, each gated by its own switch in Settings → SEO files.
const GATED: Record<string, keyof SeoFlags> = {
  "/sitemap.xml": "sitemap",
  "/robots.txt": "robots",
  "/llms.txt": "llms",
};

// Gate /admin pages on the presence of the admin token cookie.
// Real authorization happens in the API (every admin call needs a valid JWT);
// this only keeps logged-out visitors from seeing the shell.
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // A switched-off SEO file should look exactly like a URL that was never
  // there: the site's own 404 page, at the address the visitor typed. The
  // route handlers return a bare 404 on their own, which is right for a
  // crawler but bleak for a person, so rewrite to the real page instead.
  const flag = GATED[pathname];
  if (flag) {
    const flags = await fetchSeoFlags();
    if (!flags[flag]) {
      const url = req.nextUrl.clone();
      url.pathname = NOT_FOUND_PATH;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  const token = req.cookies.get("aksharum_admin_token")?.value;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  if (pathname === "/admin/login" && token) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/admin",
    // Keep in sync with GATED above.
    "/sitemap.xml",
    "/robots.txt",
    "/llms.txt",
  ],
};
