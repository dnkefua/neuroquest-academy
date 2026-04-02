/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NEXT_OUTPUT === 'static' ? 'export' : 'standalone',
  images: {
    domains: ['lh3.googleusercontent.com', 'firebasestorage.googleapis.com'],
    unoptimized: process.env.NEXT_OUTPUT === 'static',
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  trailingSlash: process.env.NEXT_OUTPUT === 'static',
};

module.exports = nextConfig;
