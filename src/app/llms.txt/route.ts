import { getBlogs } from "@/lib/blogs";
import { fileRoutesNotInCms, getPublicPages, type PublicPage } from "@/lib/pages";
import { getSeoFlags, notFound } from "@/lib/seo-flags";
import {
  canonicalPath,
  DEFAULT_DESCRIPTION,
  FEATURE_LIST,
  getSiteInfo,
  pageLabel,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from "@/lib/seo";

// Same reasoning as the sitemap: build per request so pages published from the
// admin panel appear without a redeploy.
export const dynamic = "force-dynamic";

/** Collapse whitespace and drop the newlines that would break a list item. */
function oneLine(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/** "About — Aksharum" -> "About"; falls back to the slug for untitled pages. */
function labelFor(page: PublicPage): string {
  // The homepage title is the brand name, which reads as a duplicate here.
  if (page.slug === "home") return "Home";
  const label = page.title ? pageLabel(page.title) : "";
  if (label) return label;
  return page.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** "- [Label](url): description" — the line format llms.txt expects. */
function link(label: string, url: string, description?: string): string {
  const note = description ? `: ${oneLine(description)}` : "";
  return `- [${label}](${url})${note}`;
}

/**
 * Served at /llms.txt — a curated, plain-text map of the site for LLMs and
 * AI crawlers, per the llmstxt.org convention. Content comes from the same
 * places the sitemap uses, so the two never drift apart.
 */
export async function GET(): Promise<Response> {
  const flags = await getSeoFlags();
  if (!flags.llms) return notFound();

  const [pages, posts, site] = await Promise.all([
    getPublicPages(),
    getBlogs(),
    getSiteInfo(),
  ]);

  const name = site?.siteName || SITE_NAME;
  const home = pages.find((p) => p.slug === "home");
  const summary = oneLine(home?.metaDescription || DEFAULT_DESCRIPTION);

  const lines: string[] = [
    `# ${name}`,
    "",
    `> ${summary}`,
    "",
    `${name} — ${SITE_TAGLINE}. Key modules: ${FEATURE_LIST.join(", ")}.`,
    "",
  ];

  // Home first, then the rest alphabetically — the order a reader expects.
  const ordered = [
    ...pages.filter((p) => p.slug === "home"),
    ...pages
      .filter((p) => p.slug !== "home")
      .sort((a, b) => labelFor(a).localeCompare(labelFor(b))),
  ];

  if (ordered.length > 0) {
    lines.push("## Pages", "");
    for (const page of ordered) {
      lines.push(
        link(
          labelFor(page),
          `${SITE_URL}${canonicalPath(page.slug)}`,
          page.metaDescription,
        ),
      );
    }
    lines.push("");
  }

  if (posts.length > 0) {
    lines.push("## Blog", "");
    lines.push(link("Blog index", `${SITE_URL}/blogs`, "All published articles."));
    for (const post of posts) {
      lines.push(link(post.title, `${SITE_URL}/blogs/${post.slug}`, post.excerpt));
    }
    lines.push("");
  }

  // Pages that live in the codebase rather than the CMS. /blogs is already
  // covered above whenever there are posts, so skip it here.
  const extra = fileRoutesNotInCms(pages).filter(
    (route) => !(route === "/blogs" && posts.length > 0),
  );
  if (extra.length > 0) {
    lines.push("## Other", "");
    for (const route of extra) {
      const label = route
        .replace(/^\//, "")
        .replace(/[-/]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      lines.push(link(label, `${SITE_URL}${route}`));
    }
    lines.push("");
  }

  // Only list the sibling files that this environment actually serves.
  const optional: string[] = [];
  if (flags.sitemap) {
    optional.push(
      link("Sitemap", `${SITE_URL}/sitemap.xml`, "Machine-readable index of every URL."),
    );
  }
  if (flags.robots) {
    optional.push(link("Robots", `${SITE_URL}/robots.txt`, "Crawling rules."));
  }
  if (optional.length > 0) lines.push("## Optional", "", ...optional, "");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
