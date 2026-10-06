import type { NextConfig } from "next";

/* Not a static export: the /api/subscribe route runs on the server so its
 * API key stays out of the browser. Vercel runs Next.js natively — no config
 * needed. Analytics and the email capture are optional; the app builds and
 * runs with no environment variables set. */
const nextConfig: NextConfig = {
  images: { unoptimized: true },
};

/* GitHub Pages (PAGES_EXPORT=1): static export under the /beautiful-ui
 * base path. The /api routes are removed before the build in CI. */
if (process.env.PAGES_EXPORT === "1") {
  nextConfig.output = "export";
  nextConfig.basePath = "/beautiful-ui";
}

export default nextConfig;
