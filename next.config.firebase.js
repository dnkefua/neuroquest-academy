/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    domains: ['lh3.googleusercontent.com', 'firebasestorage.googleapis.com'],
    unoptimized: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;
