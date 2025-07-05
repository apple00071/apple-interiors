import { NextResponse } from 'next/server';
import { executeQuery } from '../../lib/db';

interface PortfolioItem {
  id: number;
  category: string;
  images: string;
}

interface TransformedItem {
  id: number;
  title: string;
  description: string;
  images: string[];
  category: string;
  year: string;
  location: string;
  area: string;
}

export async function GET() {
  try {
    const result = await executeQuery<PortfolioItem[]>({
      query: `
        SELECT 
          id,
          category_id as category,
          image_url as images
        FROM portfolio_items
        ORDER BY created_at DESC
      `
    });

    // Transform the data to match the expected format
    const transformedItems: TransformedItem[] = result.map(item => ({
      id: item.id,
      title: `${item.category} Design`,
      description: `Beautiful ${item.category} interior design`,
      images: [item.images], // Wrap single image in array to match expected format
      category: item.category.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '),
      year: new Date().getFullYear().toString(),
      location: 'Hyderabad',
      area: '0'
    }));

    // Get unique categories
    const categories = Array.from(new Set(transformedItems.map(item => item.category)));

    return NextResponse.json({
      categories,
      items: transformedItems
    });
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio items' },
      { status: 500 }
    );
  }
} 