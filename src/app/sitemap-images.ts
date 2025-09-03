import { getPortfolioItems } from './lib/db';

const baseUrl = 'https://appleinteriors.in';

export default async function generateImageSitemap() {
  const portfolioItems = await getPortfolioItems();
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${baseUrl}</loc>
    <image:image>
      <image:loc>${baseUrl}/images/New-logo.png</image:loc>
      <image:title>Apple Interiors - Best Interior Designers in Hyderabad</image:title>
      <image:caption>Apple Interiors Logo</image:caption>
    </image:image>
  </url>
  ${portfolioItems.map(item => `
  <url>
    <loc>${baseUrl}/portfolio/${item.category}/${item.id}</loc>
    ${item.image_paths.map(imagePath => `
    <image:image>
      <image:loc>${baseUrl}${imagePath}</image:loc>
      <image:title>Interior Design by Apple Interiors - ${item.category}</image:title>
      <image:caption>${item.category} Interior Design in Hyderabad</image:caption>
    </image:image>`).join('')}
  </url>`).join('')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
} 