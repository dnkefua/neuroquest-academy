/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',       // Firebase Hosting: static site generation
  images: {
    domains: ['lh3.googleusercontent.com', 'firebasestorage.googleapis.com'],
    unoptimized: true,    // Required for static export
  },
  trailingSlash: true,
};

module.exports = nextConfig;
