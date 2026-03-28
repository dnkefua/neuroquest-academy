/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',    // Cloud Run: full Next.js server with API routes
  images: {
    domains: ['lh3.googleusercontent.com', 'firebasestorage.googleapis.com'],
  },
};

module.exports = nextConfig;
