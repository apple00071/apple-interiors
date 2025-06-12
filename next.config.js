/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Static HTML export
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/applenew' : '',
  trailingSlash: true,  // Add trailing slashes to all routes
  assetPrefix: process.env.NODE_ENV === 'production' ? '/applenew' : '',
}

module.exports = nextConfig 