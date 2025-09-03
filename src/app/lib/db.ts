import { neon, NeonQueryFunction } from '@neondatabase/serverless';

const isDevelopment = process.env.NODE_ENV === 'development';

// Mock data for static generation
const mockPortfolioItems = [
  {
    id: 1,
    image_paths: [
      '/images/portfolio/bedroom/104.webp',
      '/images/portfolio/bedroom/3.webp',
      '/images/portfolio/bedroom/99.webp',
      '/images/portfolio/bedroom/J7.webp',
      '/images/portfolio/bedroom/J8.webp',
      '/images/portfolio/bedroom/N3.webp'
    ],
    category: 'bedroom',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 2,
    image_paths: [
      '/images/portfolio/living-room/1.webp',
      '/images/portfolio/living-room/12.webp',
      '/images/portfolio/living-room/13.webp',
      '/images/portfolio/living-room/4.webp',
      '/images/portfolio/living-room/7.webp'
    ],
    category: 'living-room',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 3,
    image_paths: [
      '/images/portfolio/kitchen/J1.webp',
      '/images/portfolio/kitchen/J2.webp',
      '/images/portfolio/kitchen/J3.webp',
      '/images/portfolio/kitchen/J4.webp',
      '/images/portfolio/kitchen/J8.webp',
      '/images/portfolio/kitchen/J9.webp'
    ],
    category: 'kitchen',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 4,
    image_paths: [
      '/images/portfolio/dining/1.webp',
      '/images/portfolio/dining/10.webp',
      '/images/portfolio/dining/2.webp',
      '/images/portfolio/dining/26.webp',
      '/images/portfolio/dining/9.webp',
      '/images/portfolio/dining/N2.webp'
    ],
    category: 'dining',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 5,
    image_paths: [
      '/images/portfolio/false-ceiling/141.webp',
      '/images/portfolio/false-ceiling/142.webp',
      '/images/portfolio/false-ceiling/2.webp',
      '/images/portfolio/false-ceiling/40.webp',
      '/images/portfolio/false-ceiling/73.webp',
      '/images/portfolio/false-ceiling/96.webp'
    ],
    category: 'false-ceiling',
    created_at: new Date(),
    updated_at: new Date()
  }
];

const mockCategories = [
  {
    id: 1,
    name: 'bedroom',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 2,
    name: 'living-room',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 3,
    name: 'kitchen',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 4,
    name: 'dining',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 5,
    name: 'false-ceiling',
    created_at: new Date(),
    updated_at: new Date()
  }
];

interface DatabaseRow {
  id: string | number;
  image_paths?: string[];
  category?: string;
  name?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
  [key: string]: any;
}

interface PortfolioItem {
  id: number;
  image_paths: string[];
  category: string;
  created_at?: Date;
  updated_at?: Date;
}

interface Category {
  id: number;
  name: string;
  created_at?: Date;
  updated_at?: Date;
}

export const sql = isDevelopment && typeof window === 'undefined' ? neon(process.env.DATABASE_URL!) : null;

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  return mockPortfolioItems;
}

export async function getCategories(): Promise<Category[]> {
  return mockCategories;
}

// Admin functions - only available in development
export async function addPortfolioItem(item: Omit<PortfolioItem, 'id' | 'created_at' | 'updated_at'>) {
  if (!isDevelopment || !sql) throw new Error('Cannot add items in production build');
  throw new Error('Not implemented');
}

export async function deletePortfolioItem(id: number) {
  if (!isDevelopment || !sql) throw new Error('Cannot delete items in production build');
  throw new Error('Not implemented');
}

export async function updatePortfolioItem(id: number, item: Partial<Omit<PortfolioItem, 'id' | 'created_at' | 'updated_at'>>) {
  if (!isDevelopment || !sql) throw new Error('Cannot update items in production build');
  throw new Error('Not implemented');
}

export async function addCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) {
  if (!isDevelopment || !sql) throw new Error('Cannot add categories in production build');
  throw new Error('Not implemented');
}

export async function deleteCategory(id: number) {
  if (!isDevelopment || !sql) throw new Error('Cannot delete categories in production build');
  throw new Error('Not implemented');
}

export async function updateCategory(id: number, category: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>) {
  if (!isDevelopment || !sql) throw new Error('Cannot update categories in production build');
  throw new Error('Not implemented');
} 