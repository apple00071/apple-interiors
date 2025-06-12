/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // Changed from 'export' to 'standalone' for better routing support
  images: {
    unoptimized: true,
  },
  trailingSlash: true,  // Add trailing slashes to all routes
  // Add rewrites to handle the root path
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/home',
      },
    ];
  },
}

module.exports = nextConfig 