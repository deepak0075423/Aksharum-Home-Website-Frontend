import type { NextConfig } from "next";

const API_PROXY = process.env.API_PROXY_URL ?? "http://localhost:4000/api";

// The site answers on four hostnames; www.aksharum.com is canonical and the
// other three permanently redirect to it (preserving path + query) so search
// engines consolidate all ranking signals onto one URL. Keep this list in
// sync with SITE_URL in src/lib/seo.ts.
const CANONICAL_HOST = "www.aksharum.com";
const REDIRECT_HOSTS = ["aksharum.in", "www.aksharum.in", "aksharum.com"];

const nextConfig: NextConfig = {
  async redirects() {
    return REDIRECT_HOSTS.map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: `https://${CANONICAL_HOST}/:path*`,
      permanent: true,
    }));
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_PROXY}/:path*`,
      },
    ];
  },
};

export default nextConfig;
