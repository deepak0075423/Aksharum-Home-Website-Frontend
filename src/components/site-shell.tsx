import { cache, type ReactNode } from "react";
import LegacyScripts from "./legacy-scripts";

const API = process.env.API_URL ?? "http://localhost:4000/api";

// The legacy pages load these from their <head>; React-rendered routes have
// to reproduce the same set so the shared header/footer behave identically
// (drawer, theme toggle, scroll states).
const FONTS =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600;1,700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap";

const SHELL_SCRIPTS = [
  "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js",
  "/js/site-common.js",
];

// The legacy stylesheets are self-contained per page: each one carries the
// shared nav, drawer and footer rules alongside its own. one.css is the
// smallest of them (it dresses the home page), so React routes load it for
// the chrome — without it the header's inline SVGs render unsized — then
// layer their own stylesheet on top.
const CHROME_STYLES = ["/css/one.css", "/css/liquid-glass.css"];

interface Shell {
  headerHtml: string;
  footerHtml: string;
  faviconUrl: string | null;
}

/**
 * Header/footer for a non-CMS route, composed by the API with the current
 * branding and the nav link for `route` marked active.
 */
export const getShell = cache(async (route: string): Promise<Shell> => {
  try {
    const res = await fetch(
      `${API}/layout/shell/${encodeURIComponent(route)}`,
      { cache: "no-store" },
    );
    if (!res.ok) return { headerHtml: "", footerHtml: "", faviconUrl: null };
    return (await res.json()) as Shell;
  } catch {
    return { headerHtml: "", footerHtml: "", faviconUrl: null };
  }
});

/**
 * Wraps React page content in the site's shared header/footer and legacy
 * stylesheets — the counterpart to CmsPageRenderer for routes whose body
 * is React rather than stored HTML.
 */
export function SiteShell({
  shell,
  stylesheets = ["/css/blog.css"],
  children,
}: {
  shell: Shell;
  stylesheets?: string[];
  children: ReactNode;
}) {
  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="fonts" />
      {CHROME_STYLES.map((href) => (
        <link key={href} rel="stylesheet" href={href} precedence="legacy" />
      ))}
      {/* A separate precedence, not "legacy": the route group's not-found
          boundary renders the CMS 404 page, which registers career.css under
          "legacy" too and would otherwise sort after these. React emits
          precedence groups in first-seen order, so "page" always lands last. */}
      {stylesheets.map((href) => (
        <link key={href} rel="stylesheet" href={href} precedence="page" />
      ))}
      {/* display:contents keeps the legacy `body > *` selectors working */}
      <div
        style={{ display: "contents" }}
        dangerouslySetInnerHTML={{ __html: shell.headerHtml }}
      />
      {/* one.css makes body a flex column so the footer sinks to the bottom;
          this wrapper is the growing middle row. */}
      <main className="bl-main">{children}</main>
      <div
        style={{ display: "contents" }}
        dangerouslySetInnerHTML={{ __html: shell.footerHtml }}
      />
      <LegacyScripts scripts={SHELL_SCRIPTS} />
    </>
  );
}
