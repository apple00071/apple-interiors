import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

interface ImageSitemap {
  url: string;
  images: Array<{
    loc: string;
    title?: string;
    caption?: string;
  }>;
}

export default function imageSitemap(): ImageSitemap[] {
  const portfolioImages = [
    {
      category: 'bedroom',
      images: ['master-bedroom.jpg', 'kids-bedroom.jpg', 'guest-bedroom.jpg']
    },
    {
      category: 'living-room',
      images: ['modern-living.jpg', 'contemporary-living.jpg', 'traditional-living.jpg']
    },
    {
      category: 'kitchen',
      images: ['modular-kitchen.jpg', 'open-kitchen.jpg', 'luxury-kitchen.jpg']
    },
    {
      category: 'dining',
      images: ['family-dining.jpg', 'formal-dining.jpg', 'breakfast-nook.jpg']
    },
    {
      category: 'false-ceiling',
      images: ['pop-ceiling.jpg', 'wooden-ceiling.jpg', 'gypsum-ceiling.jpg']
    }
  ];

  const sitemapEntries: ImageSitemap[] = [];

  // Add portfolio page entries
  portfolioImages.forEach(({ category, images }) => {
    const entry: ImageSitemap = {
      url: `https://appleinteriors.in/portfolio/${category}`,
      images: images.map(image => ({
        loc: `https://appleinteriors.in/images/portfolio/${category}/${image}`,
        title: image.split('.')[0].split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        caption: `Apple Interiors - ${category.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')} Design`
      }))
    };
    sitemapEntries.push(entry);
  });

  // Add main pages with featured images
  const mainPages = [
    {
      url: 'https://appleinteriors.in',
      image: 'home-banner.jpg',
      title: 'Apple Interiors - Modern Interior Design'
    },
    {
      url: 'https://appleinteriors.in/about',
      image: 'about-banner.jpg',
      title: 'About Apple Interiors'
    },
    {
      url: 'https://appleinteriors.in/services',
      image: 'services-banner.jpg',
      title: 'Our Interior Design Services'
    },
    {
      url: 'https://appleinteriors.in/contact',
      image: 'contact-banner.jpg',
      title: 'Contact Apple Interiors'
    }
  ];

  mainPages.forEach(page => {
    sitemapEntries.push({
      url: page.url,
      images: [{
        loc: `https://appleinteriors.in/images/${page.image}`,
        title: page.title
      }]
    });
  });

  return sitemapEntries;
} 