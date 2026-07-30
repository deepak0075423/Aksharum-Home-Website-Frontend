import { ImageResponse } from "next/og";
import {
  BRAND_ACCENT,
  BRAND_BG,
  BRAND_BG_MID,
  BRAND_COLOR,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from "@/lib/seo";

// Branded 1200×630 social-share card, served at /og-image.
// Referenced as the default og:image / twitter:image site-wide.
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: BRAND_BG,
          backgroundImage: `radial-gradient(circle at 78% 18%, ${BRAND_COLOR}55 0%, transparent 45%), linear-gradient(135deg, ${BRAND_BG} 0%, ${BRAND_BG_MID} 100%)`,
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              padding: "10px 22px",
              borderRadius: "999px",
              border: `1px solid ${BRAND_ACCENT}66`,
              backgroundColor: "#ffffff14",
              fontSize: 26,
              letterSpacing: "2px",
              color: BRAND_ACCENT,
              fontWeight: 600,
            }}
          >
            SCHOOL ERP
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 120,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-3px",
            }}
          >
            {SITE_NAME}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 20,
              fontSize: 46,
              fontWeight: 600,
              color: BRAND_ACCENT,
            }}
          >
            {SITE_TAGLINE}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 18,
              fontSize: 30,
              color: "#d7cffb",
            }}
          >
            Admissions · Fees · Attendance · Exams · Communication
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            color: "#b8ade0",
          }}
        >
          <div style={{ display: "flex" }}>
            School management software, unified.
          </div>
          <div style={{ display: "flex", fontWeight: 600, color: "#ffffff" }}>
            {SITE_URL.replace(/^https?:\/\//, "")}
          </div>
        </div>
      </div>
    ),
    { width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT },
  );
}
