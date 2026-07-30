import type { Metadata } from "next";
import { CmsPageRenderer, getCmsPage } from "@/components/cms-page";

// A 404 must never be indexed.
export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

// Renders the admin-editable "404" CMS page for any unknown URL
// (edit it under Admin → Pages). Falls back to a minimal message if the
// CMS page is unreachable, so the 404 boundary can never itself fail.
export default async function NotFound() {
  const page = await getCmsPage("404");
  if (page) return <CmsPageRenderer page={page} />;

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        gap: "12px",
        padding: "40px",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "56px", margin: 0 }}>404</h1>
      <p style={{ fontSize: "18px", opacity: 0.7, margin: 0 }}>
        This page doesn&apos;t exist.
      </p>
      <a href="/" style={{ marginTop: "12px", textDecoration: "underline" }}>
        Back to home
      </a>
    </div>
  );
}
