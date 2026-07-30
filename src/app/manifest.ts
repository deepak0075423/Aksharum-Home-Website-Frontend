import type { MetadataRoute } from "next";
import {
  BRAND_BG,
  BRAND_COLOR,
  DEFAULT_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
} from "@/lib/seo";

// Served at /manifest.webmanifest
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — ${SITE_TAGLINE}`,
    short_name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: BRAND_BG,
    theme_color: BRAND_COLOR,
    lang: "en",
    categories: ["education", "business", "productivity"],
  };
}
