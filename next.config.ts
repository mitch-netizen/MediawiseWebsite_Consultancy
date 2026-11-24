import type { NextConfig } from "next";

// Static export so the site can be hosted on Cloudflare Pages (or any static host).
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
