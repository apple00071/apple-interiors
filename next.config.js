/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Changed to 'export' for static site generation
  images: {
    unoptimized: true,
  },
  trailingSlash: true,  // Add trailing slashes to all routes
  // Remove rewrites as they don't work with static exports
};

module.exports = nextConfig; 