import type { Metadata } from "next";
import BlogList from "@/components/blog-list";
import { getShell, SiteShell } from "@/components/site-shell";
import { blogsHref, getBlogPage, getBlogTags } from "@/lib/blogs";
import {
  absoluteUrl,
  buildBlogListJsonLd,
  DEFAULT_OG_IMAGE,
  getSiteInfo,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_NAME,
} from "@/lib/seo";

// Uses `cache: "no-store"` fetches (fresh on publish) — render on demand so
// Next never pre-renders this as static and hits the static-to-dynamic 500.
export const dynamic = "force-dynamic";

const TITLE = `Blog — School ERP Insights & Guides | ${SITE_NAME}`;
const DESCRIPTION =
  "Practical guides, product updates and ideas on running a modern school — admissions, attendance, fees, exams and parent communication, from the Aksharum team.";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** First value only — ?tags=a&tags=b collapses to the first. */
function one(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

/** Normalises ?page/?tags/?q into the shape both the fetch and the UI use. */
function readFilters(params: Record<string, string | string[] | undefined>) {
  const page = Math.max(1, Number.parseInt(one(params.page), 10) || 1);
  const tags = one(params.tags)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 12);
  return { page, tags, query: one(params.q).trim() };
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { page, tags, query } = readFilters(await searchParams);

  // The API clamps an out-of-range page, and `getBlogPage` is memoised per
  // request — so this reuses the render's fetch and lets ?page=99 canonicalise
  // to the last real page instead of minting an endless set of URLs.
  const { page: current } = await getBlogPage(page, tags.join(","), query);

  // Page 2+ gets its own title and canonical so the archive doesn't read as
  // duplicate content; search and tag views stay out of the index entirely.
  const title = current > 1 ? `${TITLE} — Page ${current}` : TITLE;
  const canonical = blogsHref({ page: current });
  const noindex = tags.length > 0 || query.length > 0;

  return {
    title: { absolute: title },
    description: DESCRIPTION,
    keywords: [
      "school ERP blog",
      "school management tips",
      "education technology blog",
      "school administration guides",
    ],
    alternates: { canonical },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_IN",
      url: absoluteUrl(canonical),
      title,
      description: DESCRIPTION,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: DESCRIPTION,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page, tags, query } = readFilters(await searchParams);

  const [posts, allTags, shell, site] = await Promise.all([
    getBlogPage(page, tags.join(","), query),
    getBlogTags(),
    getShell("blogs"),
    getSiteInfo(),
  ]);

  // Describes what this page actually renders, not the whole archive.
  const jsonLd = buildBlogListJsonLd({ posts: posts.items, site });

  return (
    <SiteShell shell={shell}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <header className="bl-hero">
        <div className="bl-hero-inner">
          <div className="bl-ey">From the Aksharum team</div>
          <h1>
            Ideas for the
            <em>modern school</em>
          </h1>
          <p>{DESCRIPTION}</p>
        </div>
      </header>

      <BlogList page={posts} tags={allTags} active={tags} query={query} />
    </SiteShell>
  );
}
