import type { NextConfig } from "next";

// BACKEND_URL is read at runtime by the Next.js server process — it is never
// baked into the client-side JS bundle, so Render's runtime env injection works
// The /api route handler reads it for each request.
const nextConfig: NextConfig = {
  output: "standalone",

  async headers() {
    return [
      {
        // Prevent caching of HTML pages so deployments are picked up immediately.
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, must-revalidate",
          },
        ],
      },
      {
        // Immutable cache for hashed static assets (JS/CSS chunks).
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
