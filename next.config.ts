import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Stable in Next.js 16 (moved OUT of experimental) ────────────────────
  reactCompiler: true,    // was experimental.reactCompiler
  cacheComponents: true,  // was experimental.dynamicIO / experimental.ppr

  compress: true,

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31_536_000,
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options",       value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy",        value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",     value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [{ key: "Cache-Control", value: "public, immutable, max-age=31536000" }],
      },
      {
        source: "/api/og(.*)",
        headers: [{ key: "Cache-Control", value: "public, immutable, max-age=31536000" }],
      },
    ];
  },

  async redirects() {
    return [
      { source: "/cnn",         destination: "/architectures/cnn",          permanent: true },
      { source: "/rnn",         destination: "/architectures/rnn",          permanent: true },
      { source: "/lstm",        destination: "/architectures/lstm",         permanent: true },
      { source: "/gru",         destination: "/architectures/gru",          permanent: true },
      { source: "/gnn",         destination: "/architectures/gnn",          permanent: true },
      { source: "/transformer", destination: "/architectures/transformers", permanent: true },
      { source: "/llm",         destination: "/architectures/llm",          permanent: true },
    ];
  },
};

export default nextConfig;