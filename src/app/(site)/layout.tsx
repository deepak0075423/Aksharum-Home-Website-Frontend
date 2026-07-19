import type { ReactNode } from "react";

// Runs before paint so the saved theme applies without a flash —
// copied verbatim from the legacy pages' <head> script.
const THEME_INIT = `
(function () {
  const savedTheme = localStorage.getItem("aksharum-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (savedTheme === "dark" || savedTheme === "light") {
    document.documentElement.setAttribute("data-theme", savedTheme);
  } else {
    document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
  }
})();
`;

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        {children}
      </body>
    </html>
  );
}
