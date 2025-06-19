/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['apple-interiors.vercel.app'],
  },
  trailingSlash: true,  // Add trailing slashes to all routes
  typescript: {
    ignoreBuildErrors: true, // Temporarily ignore TypeScript errors during build
  },
  experimental: {
    serverActions: true, // Enable server actions
  },
};

module.exports = nextConfig; 