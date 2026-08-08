import type { Metadata } from "next";
import BlogList from "@/components/blog-list";
import { getShell, SiteShell } from "@/components/site-shell";
import { getBlogs, getBlogTags } from "@/lib/blogs";
import {
  absoluteUrl,
  buildBlogListJsonLd,
  DEFAULT_OG_IMAGE,
  getSiteInfo,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_NAME,
} from "@/lib/seo";

const TITLE = `Blog — School ERP Insights & Guides | ${SITE_NAME}`;
const DESCRIPTION =
  "Practical guides, product updates and ideas on running a modern school — admissions, attendance, fees, exams and parent communication, from the Aksharum team.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "school ERP blog",
    "school management tips",
    "education technology blog",
    "school administration guides",
  ],
  alternates: { canonical: "/blogs" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_IN",
    url: absoluteUrl("/blogs"),
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

export default async function BlogsPage() {
  const [posts, tags, shell, site] = await Promise.all([
    getBlogs(),
    getBlogTags(),
    getShell("blogs"),
    getSiteInfo(),
  ]);

  const jsonLd = buildBlogListJsonLd({ posts, site });

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

      <BlogList posts={posts} tags={tags} />
    </SiteShell>
  );
}
