import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

const isDevelopment = process.env.NODE_ENV === 'development';

// Mock data for static generation
const mockPortfolioItems = [
  {
    id: 1,
    image_paths: [
      '/images/portfolio/living-room/1.webp',
      '/images/portfolio/living-room/2.webp',
      '/images/portfolio/living-room/3.webp'
    ],
    category: 'living-room',
    created_at: new Date(),
    updated_at: new Date()
  },
  // Add more mock items as needed
];

const mockCategories = [
  {
    id: 1,
    name: 'living-room',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 2,
    name: 'bedroom',
    created_at: new Date(),
    updated_at: new Date()
  },
  // Add more mock categories as needed
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

export const sql = isDevelopment ? neon(process.env.DATABASE_URL!) : null;

export async function testConnection() {
  if (!isDevelopment || !sql) return true;
  
  try {
    const result = await sql`SELECT 1`;
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

export async function initializeDatabase() {
  if (!isDevelopment || !sql) return true;

  try {
    const schemaPath = path.join(process.cwd(), 'src', 'app', 'lib', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    await sql.unsafe(schema);
    
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  if (!isDevelopment || !sql) {
    return mockPortfolioItems;
  }

  try {
    const result = await sql`
      SELECT id, image_paths, category, created_at, updated_at 
      FROM portfolio_items 
      ORDER BY created_at DESC
    ` as DatabaseRow[];

    const items = result.map(row => ({
      id: Number(row.id),
      image_paths: Array.isArray(row.image_paths) ? row.image_paths : [],
      category: String(row.category),
      created_at: row.created_at ? new Date(row.created_at) : undefined,
      updated_at: row.updated_at ? new Date(row.updated_at) : undefined
    }));

    return items;
  } catch (error) {
    console.error('Failed to get portfolio items:', error);
    return mockPortfolioItems;
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!isDevelopment || !sql) {
    return mockCategories;
  }

  try {
    const result = await sql`
      SELECT id, name, created_at, updated_at 
      FROM categories 
      ORDER BY name
    ` as DatabaseRow[];

    const categories = result.map(row => ({
      id: Number(row.id),
      name: String(row.name),
      created_at: row.created_at ? new Date(row.created_at) : undefined,
      updated_at: row.updated_at ? new Date(row.updated_at) : undefined
    }));

    return categories;
  } catch (error) {
    console.error('Failed to get categories:', error);
    return mockCategories;
  }
}

export async function addPortfolioItem(item: Omit<PortfolioItem, 'id' | 'created_at' | 'updated_at'>) {
  if (!isDevelopment || !sql) throw new Error('Cannot add items in production build');

  try {
    const result = await sql`
      INSERT INTO portfolio_items (image_paths, category)
      VALUES (${item.image_paths}, ${item.category})
      RETURNING *
    ` as DatabaseRow[];

    if (!result.length) throw new Error('Failed to insert portfolio item');

    const newItem = {
      id: Number(result[0].id),
      image_paths: Array.isArray(result[0].image_paths) ? result[0].image_paths : [],
      category: String(result[0].category),
      created_at: result[0].created_at ? new Date(result[0].created_at) : undefined,
      updated_at: result[0].updated_at ? new Date(result[0].updated_at) : undefined
    };

    return newItem;
  } catch (error) {
    console.error('Failed to add portfolio item:', error);
    throw error;
  }
}

export async function deletePortfolioItem(id: number) {
  if (!isDevelopment || !sql) throw new Error('Cannot delete items in production build');

  try {
    await sql`DELETE FROM portfolio_items WHERE id = ${id}`;
    return true;
  } catch (error) {
    console.error('Failed to delete portfolio item:', error);
    throw error;
  }
}

export async function updatePortfolioItem(id: number, item: Partial<Omit<PortfolioItem, 'id' | 'created_at' | 'updated_at'>>) {
  if (!isDevelopment || !sql) throw new Error('Cannot update items in production build');

  try {
    const result = await sql`
      UPDATE portfolio_items SET
        image_paths = COALESCE(${item.image_paths}, image_paths),
        category = COALESCE(${item.category}, category)
      WHERE id = ${id}
      RETURNING *
    ` as DatabaseRow[];

    if (!result.length) throw new Error('Failed to update portfolio item');

    const updatedItem = {
      id: Number(result[0].id),
      image_paths: Array.isArray(result[0].image_paths) ? result[0].image_paths : [],
      category: String(result[0].category),
      created_at: result[0].created_at ? new Date(result[0].created_at) : undefined,
      updated_at: result[0].updated_at ? new Date(result[0].updated_at) : undefined
    };

    return updatedItem;
  } catch (error) {
    console.error('Failed to update portfolio item:', error);
    throw error;
  }
}

export async function addCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) {
  if (!isDevelopment || !sql) throw new Error('Cannot add categories in production build');

  try {
    // Check if category already exists
    const existing = await sql`SELECT id, name FROM categories WHERE name = ${category.name}` as DatabaseRow[];
    if (existing.length > 0) {
      return {
        id: Number(existing[0].id),
        name: String(existing[0].name)
      };
    }

    const result = await sql`
      INSERT INTO categories (name)
      VALUES (${category.name})
      RETURNING *
    ` as DatabaseRow[];

    if (!result.length) throw new Error('Failed to insert category');

    const newCategory = {
      id: Number(result[0].id),
      name: String(result[0].name),
      created_at: result[0].created_at ? new Date(result[0].created_at) : undefined,
      updated_at: result[0].updated_at ? new Date(result[0].updated_at) : undefined
    };

    return newCategory;
  } catch (error) {
    console.error('Failed to add category:', error);
    throw error;
  }
}

export async function deleteCategory(id: number) {
  if (!isDevelopment || !sql) throw new Error('Cannot delete categories in production build');

  try {
    await sql`DELETE FROM categories WHERE id = ${id}`;
    return true;
  } catch (error) {
    console.error('Failed to delete category:', error);
    throw error;
  }
}

export async function updateCategory(id: number, category: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>) {
  if (!isDevelopment || !sql) throw new Error('Cannot update categories in production build');

  try {
    const result = await sql`
      UPDATE categories
      SET name = COALESCE(${category.name}, name)
      WHERE id = ${id}
      RETURNING *
    ` as DatabaseRow[];

    if (!result.length) throw new Error('Failed to update category');

    const updatedCategory = {
      id: Number(result[0].id),
      name: String(result[0].name),
      created_at: result[0].created_at ? new Date(result[0].created_at) : undefined,
      updated_at: result[0].updated_at ? new Date(result[0].updated_at) : undefined
    };

    return updatedCategory;
  } catch (error) {
    console.error('Failed to update category:', error);
    throw error;
  }
} 