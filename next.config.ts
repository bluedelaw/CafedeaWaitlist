/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',
   basePath: '/CafedeaWaitlist',

  // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
  // trailingSlash: true,
 
  // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
  // skipTrailingSlashRedirect: true,
 
  // Optional: Change the output directory `out` -> `dist`
  // distDir: 'dist',
}
 
module.exports = nextConfig
  // // Prefix for the subdirectory (replace with the name of your repo or folder)
  // basePath: "/CafedeaWaitlist",
  // assetPrefix: "/CafedeaWaitlist/",
  // trailingSlash: true, // Ensures paths have trailing slashes (GitHub Pages needs this)