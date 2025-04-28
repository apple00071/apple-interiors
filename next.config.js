/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true,
  },
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
}

module.exports = nextConfig 