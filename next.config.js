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
  // Add React strict mode for better development experience
  reactStrictMode: true,
  // Ensure proper hydration
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true
  },
};

module.exports = nextConfig; 