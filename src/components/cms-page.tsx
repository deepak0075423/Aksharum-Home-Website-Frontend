import { cache } from "react";
import LegacyScripts from "./legacy-scripts";

const API = process.env.API_URL ?? "http://localhost:4000/api";

export interface CmsPage {
  slug: string;
  title: string;
  bodyHtml: string;
  cssLinks: string[];
  fontLinks: string[];
  scripts: string[];
  headerHtml: string;
  footerHtml: string;
  faviconUrl: string | null;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;
}

export const getCmsPage = cache(async (slug: string): Promise<CmsPage | null> => {
  try {
    const res = await fetch(`${API}/pages/public/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as CmsPage;
  } catch {
    return null;
  }
});

export function CmsPageRenderer({ page }: { page: CmsPage }) {
  return (
    <>
      {page.fontLinks.map((href) => (
        <link key={href} rel="stylesheet" href={href} precedence="fonts" />
      ))}
      {page.cssLinks.map((href) => (
        <link key={href} rel="stylesheet" href={href} precedence="legacy" />
      ))}
      {/* display:contents keeps the legacy body > * CSS structure intact;
          shared header/footer are composed around the page content */}
      <div
        style={{ display: "contents" }}
        dangerouslySetInnerHTML={{
          __html: page.headerHtml + page.bodyHtml + page.footerHtml,
        }}
      />
      <LegacyScripts scripts={page.scripts} />
    </>
  );
}
