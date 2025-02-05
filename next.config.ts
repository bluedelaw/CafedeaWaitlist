// next.config.js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export
  output: "export",
  // Prefix for the subdirectory (replace with the name of your repo or folder)
  basePath: "/CafedeaWaitlist",
  assetPrefix: "/CafedeaWaitlist/",
  trailingSlash: true, // Ensures paths have trailing slashes (GitHub Pages needs this)
};

export default nextConfig;
