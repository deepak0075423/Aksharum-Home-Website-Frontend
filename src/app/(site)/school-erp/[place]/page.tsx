import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LocationPage from "@/components/location-page";
import { getShell, SiteShell } from "@/components/site-shell";
import { getBlogs } from "@/lib/blogs";
import {
  childrenOf,
  getPlace,
  pickPosts,
  placePath,
  plainName,
  relatedTo,
  type Place,
} from "@/lib/locations";
import {
  absoluteUrl,
  buildPlaceJsonLd,
  DEFAULT_OG_IMAGE,
  getSiteInfo,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_NAME,
} from "@/lib/seo";

type Params = Promise<{ place: string }>;

// The page content is static, but the shared header/footer (getShell) and the
// reading list are fetched with `cache: "no-store"`. Render on demand — never
// with generateStaticParams — or Next can freeze a page as static at build and
// then 500 at runtime when the no-store fetch flips it dynamic (see blogs).
export const dynamic = "force-dynamic";

function keywordsFor(place: Place): string[] {
  const names = [plainName(place), ...(place.alias ? [place.alias] : [])];
  return names.flatMap((n) => [
    `school ERP ${n}`,
    `school ERP software in ${n}`,
    `best school ERP in ${n}`,
    `school management software ${n}`,
    `school management system ${n}`,
  ]);
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { place: slug } = await params;
  const place = getPlace(slug);
  if (!place) return { title: "Page not found", robots: { index: false, follow: false } };

  const path = placePath(place.slug);
  return {
    title: { absolute: place.title },
    description: place.description,
    keywords: keywordsFor(place),
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_IN",
      url: absoluteUrl(path),
      title: place.title,
      description: place.description,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: `School ERP software in ${plainName(place)} — ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: place.title,
      description: place.description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default async function SchoolErpPlacePage({ params }: { params: Params }) {
  const { place: slug } = await params;
  const place = getPlace(slug);
  if (!place) notFound();

  const [shell, site, blogs] = await Promise.all([
    getShell("school-erp"),
    getSiteInfo(),
    getBlogs(),
  ]);
  const jsonLd = buildPlaceJsonLd({ place, site });

  return (
    <SiteShell shell={shell} stylesheets={["/css/blog.css", "/css/landing.css"]}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <LocationPage
        place={place}
        cities={childrenOf(place.slug)}
        related={relatedTo(place)}
        posts={pickPosts(blogs, place.topics ?? ["school erp"], 3, place.slug)}
      />
    </SiteShell>
  );
}
