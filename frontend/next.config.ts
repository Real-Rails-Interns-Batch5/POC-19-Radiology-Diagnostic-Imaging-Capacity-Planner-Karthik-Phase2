import type { NextConfig } from "next";

// The API route handler reads BACKEND_URL/BACKEND_HOSTPORT at runtime. Neither
// value is baked into the client-side bundle.
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
