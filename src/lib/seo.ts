import { cache } from "react";

// ── Site identity ─────────────────────────────────────────────────────────
// Canonical production origin. The site also answers on www.aksharum.com,
// aksharum.in and www.aksharum.in — those 301-redirect here (see
// next.config.ts) so all SEO signals consolidate on this one URL.
// Override per environment with NEXT_PUBLIC_SITE_URL (e.g. a staging domain).
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://aksharum.com"
).replace(/\/+$/, "");

export const SITE_NAME = "Aksharum";
export const SITE_TAGLINE = "The Modern School ERP";

export const DEFAULT_TITLE = `${SITE_NAME} — ${SITE_TAGLINE} & School Management Software`;

export const DEFAULT_DESCRIPTION =
  "Aksharum is a modern school ERP and school management software that unifies admissions, attendance, fees, exams, timetables and parent communication in one secure platform.";

export const DEFAULT_KEYWORDS = [
  "school ERP",
  "school management software",
  "school management system",
  "student information system",
  "school administration software",
  "education ERP",
  "online school software",
];

// Key modules — surfaced as SoftwareApplication.featureList for rich results.
export const FEATURE_LIST = [
  "Admissions & enquiries",
  "Student information system",
  "Attendance management",
  "Online fee collection",
  "Examinations & report cards",
  "Timetable scheduling",
  "Transport management",
  "Library management",
  "HR & payroll",
  "Parent-teacher communication",
];

// Served by the dynamic route handler at app/og-image/route.tsx.
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image`;
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

// Brand palette (from the legacy stylesheets) — used by the OG card,
// web manifest theme and browser theme-color.
export const BRAND_COLOR = "#6650c4";
export const BRAND_ACCENT = "#a88cff";
export const BRAND_BG = "#0f0a1c";
export const BRAND_BG_MID = "#251552";

// Login and error pages: crawlable but never indexed.
export const NOINDEX_SLUGS = new Set(["auth", "404", "403"]);

// ── Helpers ────────────────────────────────────────────────────────────────

/** Route path for a page slug ("home" -> "/", others -> "/slug"). */
export function canonicalPath(slug: string): string {
  return slug === "home" ? "/" : `/${slug}`;
}

/** Absolute URL on the canonical origin. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** "About — Aksharum" -> "About" (drops the brand suffix for breadcrumbs). */
export function pageLabel(title: string): string {
  return title.split(/\s[—–|·-]\s/)[0].trim() || title.trim();
}

// ── Public site info (Organization structured data) ─────────────────────────

const API = process.env.API_URL ?? "http://localhost:4000/api";

export interface SiteInfo {
  siteName: string;
  logoUrl: string | null;
  social: { label: string; url: string }[];
}

export const getSiteInfo = cache(async (): Promise<SiteInfo | null> => {
  try {
    const res = await fetch(`${API}/layout/site-info`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as SiteInfo;
  } catch {
    return null;
  }
});

// ── JSON-LD structured data ─────────────────────────────────────────────────

type Json = Record<string, unknown>;

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;
const SOFTWARE_ID = `${SITE_URL}/#software`;

function organizationNode(site: SiteInfo | null): Json {
  const sameAs = (site?.social ?? [])
    .map((s) => s.url)
    .filter((u) => /^https?:\/\//i.test(u));
  const emailLink = (site?.social ?? []).find((s) =>
    s.url.toLowerCase().startsWith("mailto:"),
  );
  const email = emailLink?.url.replace(/^mailto:/i, "");
  const logo = site?.logoUrl ? absoluteUrl(site.logoUrl) : DEFAULT_OG_IMAGE;

  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: site?.siteName || SITE_NAME,
    url: `${SITE_URL}/`,
    logo,
    description: DEFAULT_DESCRIPTION,
    ...(sameAs.length ? { sameAs } : {}),
    ...(email
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            email,
            contactType: "customer support",
            areaServed: "IN",
            availableLanguage: ["English", "Hindi"],
          },
        }
      : {}),
  };
}

function websiteNode(site: SiteInfo | null): Json {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: `${SITE_URL}/`,
    name: site?.siteName || SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

function softwareNode(site: SiteInfo | null): Json {
  return {
    "@type": "SoftwareApplication",
    "@id": SOFTWARE_ID,
    name: `${site?.siteName || SITE_NAME} School ERP`,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "School Management Software",
    operatingSystem: "Web-based",
    description: DEFAULT_DESCRIPTION,
    url: `${SITE_URL}/`,
    image: DEFAULT_OG_IMAGE,
    publisher: { "@id": ORG_ID },
    featureList: FEATURE_LIST,
  };
}

function breadcrumbNode(name: string, canonical: string): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name,
        item: canonical,
      },
    ],
  };
}

// ── Blog structured data ────────────────────────────────────────────────────

const BLOG_ID = `${SITE_URL}/blogs#blog`;

interface BlogSeoPost {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  tags: string[];
  publishedAt: string | null;
  updatedAt: string;
}

function blogBreadcrumb(post?: BlogSeoPost): Json {
  const trail: Json[] = [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blogs` },
  ];
  if (post) {
    trail.push({
      "@type": "ListItem",
      position: 3,
      name: post.title,
      item: `${SITE_URL}/blogs/${post.slug}`,
    });
  }
  return { "@type": "BreadcrumbList", itemListElement: trail };
}

/** @graph for /blogs — a Blog node listing its posts, plus a breadcrumb. */
export function buildBlogListJsonLd(args: {
  posts: BlogSeoPost[];
  site: SiteInfo | null;
}): Json {
  const { posts, site } = args;
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationNode(site),
      {
        "@type": "Blog",
        "@id": BLOG_ID,
        url: `${SITE_URL}/blogs`,
        name: `${site?.siteName || SITE_NAME} Blog`,
        description: DEFAULT_DESCRIPTION,
        publisher: { "@id": ORG_ID },
        inLanguage: "en",
        blogPost: posts.map((p) => ({
          "@type": "BlogPosting",
          "@id": `${SITE_URL}/blogs/${p.slug}#post`,
          headline: p.title,
          url: `${SITE_URL}/blogs/${p.slug}`,
          ...(p.excerpt ? { description: p.excerpt } : {}),
          datePublished: p.publishedAt ?? undefined,
          dateModified: p.updatedAt,
          author: { "@type": "Person", name: p.author },
        })),
      },
      blogBreadcrumb(),
    ],
  };
}

/** @graph for a single post — BlogPosting with author, dates and cover. */
export function buildBlogPostJsonLd(args: {
  post: BlogSeoPost;
  image: string;
  wordCount: number;
  site: SiteInfo | null;
}): Json {
  const { post, image, wordCount, site } = args;
  const url = `${SITE_URL}/blogs/${post.slug}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationNode(site),
      {
        "@type": "BlogPosting",
        "@id": `${url}#post`,
        headline: post.title,
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        ...(post.excerpt ? { description: post.excerpt } : {}),
        image: [image],
        datePublished: post.publishedAt ?? undefined,
        dateModified: post.updatedAt,
        author: { "@type": "Person", name: post.author },
        publisher: { "@id": ORG_ID },
        isPartOf: { "@id": BLOG_ID },
        ...(post.tags.length ? { keywords: post.tags.join(", ") } : {}),
        wordCount,
        inLanguage: "en",
      },
      blogBreadcrumb(post),
    ],
  };
}

/**
 * schema.org @graph for a page. Home carries the site/product identity;
 * inner pages add a breadcrumb trail. Login/error pages get nothing.
 */
export function buildJsonLd(args: {
  slug: string;
  title: string;
  canonical: string;
  site: SiteInfo | null;
}): Json | null {
  const { slug, title, canonical, site } = args;
  if (NOINDEX_SLUGS.has(slug)) return null;

  const graph: Json[] = [organizationNode(site), websiteNode(site)];
  if (slug === "home") {
    graph.push(softwareNode(site));
  } else {
    graph.push(breadcrumbNode(pageLabel(title), canonical));
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
