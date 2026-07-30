import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CmsPageRenderer, getCmsPage } from "@/components/cms-page";
import {
  absoluteUrl,
  buildJsonLd,
  canonicalPath,
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  getSiteInfo,
  NOINDEX_SLUGS,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_NAME,
} from "@/lib/seo";

type Params = Promise<{ slug?: string[] }>;

function slugKey(slug?: string[]): string {
  return (slug ?? []).join("/") || "home";
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const key = slugKey(slug);
  const page = await getCmsPage(key);

  const title = page?.title || DEFAULT_TITLE;
  const description = page?.metaDescription || DEFAULT_DESCRIPTION;
  const keywords = page?.metaKeywords
    ? page.metaKeywords.split(",").map((k) => k.trim()).filter(Boolean)
    : DEFAULT_KEYWORDS;
  const path = canonicalPath(key);
  const url = absoluteUrl(path);
  const ogImage = page?.ogImage || DEFAULT_OG_IMAGE;
  const noindex = NOINDEX_SLUGS.has(key) || !page;

  return {
    // DB titles already include the brand, so bypass the "%s | Aksharum" template.
    title: { absolute: title },
    description,
    keywords,
    alternates: { canonical: path },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_IN",
      url,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    ...(page?.faviconUrl ? { icons: { icon: page.faviconUrl } } : {}),
  };
}

export default async function SitePage({ params }: { params: Params }) {
  const { slug } = await params;
  const key = slugKey(slug);
  const page = await getCmsPage(key);
  if (!page) notFound();

  const site = await getSiteInfo();
  const jsonLd = buildJsonLd({
    slug: key,
    title: page.title,
    canonical: absoluteUrl(canonicalPath(key)),
    site,
  });

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          // Escape "<" so page content can never break out of the script tag.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <CmsPageRenderer page={page} />
    </>
  );
}
