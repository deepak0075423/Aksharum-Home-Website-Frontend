import { notFound } from "next/navigation";
import { CmsPageRenderer, getCmsPage } from "@/components/cms-page";

type Params = Promise<{ slug?: string[] }>;

function slugKey(slug?: string[]): string {
  return (slug ?? []).join("/") || "home";
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const page = await getCmsPage(slugKey(slug));
  const title = page?.title ?? "Aksharum";
  const description = page?.metaDescription || undefined;
  return {
    title,
    description,
    ...(page?.metaKeywords ? { keywords: page.metaKeywords } : {}),
    openGraph: {
      title,
      description,
      ...(page?.ogImage ? { images: [page.ogImage] } : {}),
    },
    ...(page?.faviconUrl ? { icons: { icon: page.faviconUrl } } : {}),
  };
}

export default async function SitePage({ params }: { params: Params }) {
  const { slug } = await params;
  const page = await getCmsPage(slugKey(slug));
  if (!page) notFound();
  return <CmsPageRenderer page={page} />;
}
