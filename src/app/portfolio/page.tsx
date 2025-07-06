import { getPortfolioItems, getCategories } from '@/app/lib/db';
import Portfolio from '@/app/components/Portfolio';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Portfolio | Apple Interiors',
  description: 'Explore our portfolio of interior design projects, showcasing our expertise in living rooms, dining spaces, bedrooms, kitchens, and false ceilings.',
  openGraph: {
    title: 'Portfolio | Apple Interiors',
    description: 'Explore our portfolio of interior design projects, showcasing our expertise in living rooms, dining spaces, bedrooms, kitchens, and false ceilings.',
    images: ['/images/og-image.jpg'],
  },
};

async function PortfolioContent() {
  try {
    console.log('Fetching portfolio items and categories...');
    const [items, categories] = await Promise.all([
      getPortfolioItems(),
      getCategories()
    ]);
    
    console.log('Items:', items);
    console.log('Categories:', categories);

    if (!items || !categories) {
      throw new Error('Failed to fetch portfolio data');
    }

    return <Portfolio items={items} categories={categories} />;
  } catch (error) {
    console.error('Error in PortfolioContent:', error);
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Something went wrong loading the portfolio. Please try again later.</p>
      </div>
    );
  }
}

export default function PortfolioPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Portfolio</h1>
      <Suspense fallback={
        <div className="text-center py-12">
          <p className="text-gray-600">Loading portfolio items...</p>
        </div>
      }>
        <PortfolioContent />
      </Suspense>
    </div>
  );
} 