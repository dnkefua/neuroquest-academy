/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',       // static export for Firebase Hosting
  trailingSlash: true,    // ensures /dashboard/ works as an index.html
  images: {
    unoptimized: true,    // required for static export (no Next.js image server)
    domains: ['lh3.googleusercontent.com', 'firebasestorage.googleapis.com'],
  },
};

module.exports = nextConfig;
