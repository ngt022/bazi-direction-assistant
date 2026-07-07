import type { NextConfig } from "next";

import path from "node:path";

const isDev = process.env.NODE_ENV === "development";
const scriptSrc = isDev
  ? `'self' 'unsafe-eval' 'unsafe-inline'`
  : `'self' 'unsafe-inline'`;

const csp = [
  `default-src 'self'`,
  `script-src ${scriptSrc}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob:`,
  `font-src 'self' data:`,
  `connect-src 'self' https://api.openai.com ${process.env.OPENAI_BASE_URL || ""}`,
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
].filter(Boolean).join("; ");

const nextConfig: NextConfig = {
  output: "standalone",
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || undefined,
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  serverExternalPackages: ["bazi-calculator-by-alvamind"],
  outputFileTracingIncludes: {
    "/api/profiles": ["./node_modules/bazi-calculator-by-alvamind/dist/dates_mapping.json"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
