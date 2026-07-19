"use client";

import { useEffect } from "react";

/**
 * Loads the legacy page scripts (GSAP CDN + page JS) in order after mount,
 * then re-fires DOMContentLoaded/load for scripts that wait on them.
 * Site navigation uses plain <a> tags (full page loads), so this runs
 * fresh on every page — exactly like the original static site.
 */
export default function LegacyScripts({ scripts }: { scripts: string[] }) {
  useEffect(() => {
    const w = window as unknown as Record<string, unknown>;
    if (w.__aksharumLegacyLoaded) return; // React strict-mode double-mount guard
    w.__aksharumLegacyLoaded = true;

    (async () => {
      for (const src of scripts) {
        await new Promise<void>((resolve) => {
          const s = document.createElement("script");
          s.src = src;
          s.onload = () => resolve();
          s.onerror = () => resolve();
          document.body.appendChild(s);
        });
      }
      document.dispatchEvent(new Event("DOMContentLoaded", { bubbles: true }));
      window.dispatchEvent(new Event("load"));
    })();
  }, [scripts]);

  return null;
}
