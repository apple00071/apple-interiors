import { MetadataRoute } from 'next';
import { getPortfolioItems, getCategories } from './lib/db';

const baseUrl = 'https://appleinteriors.in';

// List of all service pages
const servicePages = [
  '2bhk-interior-design-hyderabad',
  '3bhk-interior-design-hyderabad',
  'modular-kitchen-design-hyderabad',
  'false-ceiling-contractors-hyderabad',
  'wardrobe-designers-hyderabad',
  'office-interior-designers-hyderabad',
  'villa-interior-design-hyderabad',
  'budget-interior-designers-hyderabad',
  'interior-designers-hitec-city',
  'interior-designers-kukatpally',
  'interior-designers-madhapur'
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get dynamic data
  const portfolioItems = await getPortfolioItems();
  const categories = await getCategories();

  // Base pages
  const routes = ['', 'about', 'services', 'portfolio', 'contact'].map((route) => ({
    url: `${baseUrl}${route ? `/${route}` : ''}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Service pages
  const serviceRoutes = servicePages.map((route) => ({
    url: `${baseUrl}/${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Portfolio category pages
  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/portfolio/${category.name}`,
    lastModified: new Date(category.updated_at || ''),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Portfolio item pages (if you have individual portfolio item pages)
  const portfolioRoutes = portfolioItems.map((item) => ({
    url: `${baseUrl}/portfolio/${item.category}/${item.id}`,
    lastModified: new Date(item.updated_at || ''),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...routes, ...serviceRoutes, ...categoryRoutes, ...portfolioRoutes];
} 