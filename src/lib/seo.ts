import { cache } from "react";
import { employmentTypes, hasContent, parseJobLocation, type Job } from "@/lib/jobs";
import {
  HUB,
  LOCATIONS_HUB,
  placePath,
  plainName,
  trailFor,
  type Place,
} from "@/lib/locations";

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

// Public contact details — keep in sync with the /contact page. Used in
// Organization structured data, which feeds Google's knowledge panel; a phone
// number that disagrees with the one on the site weakens that signal.
export const ORG_PHONE = "+91-7595963707";
export const ORG_EMAIL = "admin@aksharum.com";

// Topics the organisation is an authority on (Organization.knowsAbout).
const KNOWS_ABOUT = [
  "School ERP",
  "School management software",
  "Student information systems",
  "School fee management",
  "Student attendance management",
  "Online examinations",
  "Report cards",
  "School transport management",
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
  const email = emailLink?.url.replace(/^mailto:/i, "") || ORG_EMAIL;
  const logo = site?.logoUrl ? absoluteUrl(site.logoUrl) : DEFAULT_OG_IMAGE;

  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: site?.siteName || SITE_NAME,
    url: `${SITE_URL}/`,
    logo,
    description: DEFAULT_DESCRIPTION,
    slogan: SITE_TAGLINE,
    knowsAbout: KNOWS_ABOUT,
    areaServed: { "@type": "Country", name: "India" },
    ...(sameAs.length ? { sameAs } : {}),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: ORG_PHONE,
      email,
      contactType: "sales",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "18:00",
      },
    },
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

/** BreadcrumbList for any depth of trail (site paths, made absolute). */
function trailNode(trail: { name: string; path: string }[], id?: string): Json {
  return {
    "@type": "BreadcrumbList",
    ...(id ? { "@id": id } : {}),
    itemListElement: trail.map((step, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: step.name,
      item: absoluteUrl(step.path),
    })),
  };
}

function faqEntities(faqs: { q: string; a: string }[]): Json[] {
  return faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  }));
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

/** Posts bylined with the brand are by the Organization, not a person. */
function authorNode(author: string, site: SiteInfo | null): Json {
  const brand = (site?.siteName || SITE_NAME).toLowerCase();
  const name = author.trim();
  if (!name || name.toLowerCase() === brand || name.toLowerCase() === SITE_NAME.toLowerCase()) {
    // Named inline as well as by @id: Google's article guidelines want
    // author.name present on the author itself.
    return { "@type": "Organization", "@id": ORG_ID, name: site?.siteName || SITE_NAME, url: `${SITE_URL}/` };
  }
  return { "@type": "Person", name };
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
          author: authorNode(p.author, site),
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
        author: authorNode(post.author, site),
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

// ── Location pages (/school-erp/...) ────────────────────────────────────────

/** schema.org Place for where a location page's service is offered. */
function areaNode(place: Place): Json {
  const country = { "@type": "Country", name: place.country };
  if (place.kind === "country") return country;
  const state = { "@type": "State", name: place.region, containedInPlace: country };
  if (place.kind === "state") return { ...state, name: place.name };
  return {
    "@type": "City",
    name: plainName(place),
    ...(place.alias ? { alternateName: place.alias } : {}),
    containedInPlace: state,
  };
}

/**
 * @graph for one location page: the page itself (an FAQPage, so its visible
 * Q&A is machine-readable), the school ERP service it describes with the
 * area it serves, and the Home › School ERP › State › City trail.
 */
export function buildPlaceJsonLd(args: { place: Place; site: SiteInfo | null }): Json {
  const { place, site } = args;
  const url = absoluteUrl(placePath(place.slug));

  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationNode(site),
      websiteNode(site),
      {
        "@type": "FAQPage",
        "@id": `${url}#webpage`,
        url,
        name: place.title,
        description: place.description,
        inLanguage: "en-IN",
        isPartOf: { "@id": SITE_ID },
        about: { "@id": `${url}#service` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        mainEntity: faqEntities(place.faqs),
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: `School ERP software in ${plainName(place)}`,
        serviceType: "School ERP software",
        description: place.description,
        url,
        provider: { "@id": ORG_ID },
        areaServed: areaNode(place),
        audience: { "@type": "EducationalAudience", educationalRole: "administrator" },
      },
      trailNode(trailFor(place), `${url}#breadcrumb`),
    ],
  };
}

/** @graph for the /school-erp hub: FAQ page + the list of location pages. */
export function buildHubJsonLd(args: { places: Place[]; site: SiteInfo | null }): Json {
  const { places, site } = args;
  const url = absoluteUrl(LOCATIONS_HUB);

  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationNode(site),
      websiteNode(site),
      {
        "@type": "FAQPage",
        "@id": `${url}#webpage`,
        url,
        name: HUB.title,
        description: HUB.description,
        inLanguage: "en-IN",
        isPartOf: { "@id": SITE_ID },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        mainEntity: faqEntities(HUB.faqs),
      },
      {
        "@type": "ItemList",
        "@id": `${url}#locations`,
        name: "School ERP software by location",
        itemListElement: places.map((place, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `School ERP software in ${plainName(place)}`,
          url: absoluteUrl(placePath(place.slug)),
        })),
      },
      trailNode(
        [
          { name: "Home", path: "/" },
          { name: "School ERP", path: LOCATIONS_HUB },
        ],
        `${url}#breadcrumb`,
      ),
    ],
  };
}

// ── Job pages (/career/...) ─────────────────────────────────────────────────

/**
 * @graph for an open role: a JobPosting that makes it eligible for Google's
 * job search experience, plus Home › Careers › Role. Only call this for OPEN
 * roles — Google requires expired postings to drop the markup.
 */
export function buildJobPostingJsonLd(args: { job: Job; site: SiteInfo | null }): Json {
  const { job, site } = args;
  const url = absoluteUrl(job.path);
  const where = parseJobLocation(job.location);
  const types = employmentTypes(job.type, job.title);
  const name = site?.siteName || SITE_NAME;
  const description = hasContent(job.description)
    ? job.description
    : `<p>${job.title} (${job.type || "Full-time"}, ${job.location || "India"}) in our ${
        job.department ? `${job.department} team` : "team"
      } at ${name}, the team building a modern school ERP.</p>`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationNode(site),
      {
        "@type": "JobPosting",
        "@id": `${url}#job`,
        url,
        title: job.title,
        description,
        datePosted: job.createdAt,
        identifier: { "@type": "PropertyValue", name, value: job.id },
        hiringOrganization: {
          "@type": "Organization",
          "@id": ORG_ID,
          name,
          sameAs: `${SITE_URL}/`,
          logo: site?.logoUrl ? absoluteUrl(site.logoUrl) : DEFAULT_OG_IMAGE,
        },
        employmentType: types.length === 1 ? types[0] : types,
        industry: "Education Technology",
        directApply: true,
        ...(job.openings > 1 ? { totalJobOpenings: job.openings } : {}),
        ...(where.addresses.length
          ? {
              jobLocation: where.addresses.map((a) => ({
                "@type": "Place",
                address: {
                  "@type": "PostalAddress",
                  ...(a.locality ? { addressLocality: a.locality } : {}),
                  ...(a.region ? { addressRegion: a.region } : {}),
                  addressCountry: a.countryCode,
                },
              })),
            }
          : {}),
        ...(where.remote
          ? {
              jobLocationType: "TELECOMMUTE",
              applicantLocationRequirements: where.countries.map((c) => ({
                "@type": "Country",
                name: c,
              })),
            }
          : {}),
      },
      trailNode([
        { name: "Home", path: "/" },
        { name: "Careers", path: "/career" },
        { name: job.title, path: job.path },
      ]),
    ],
  };
}
