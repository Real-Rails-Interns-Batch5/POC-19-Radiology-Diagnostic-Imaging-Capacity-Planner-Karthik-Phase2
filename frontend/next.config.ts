import type { NextConfig } from "next";

// BACKEND_URL is read at runtime by the Next.js server process — it is never
// baked into the client-side JS bundle, so Render's runtime env injection works
// correctly. Falls back to localhost for local Docker Compose development.
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  output: "standalone",

  async rewrites() {
    return [
      {
        // All /api/* calls from the browser are forwarded server-side to the backend.
        // From the browser's perspective these are same-origin, so no CORS needed.
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },

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
