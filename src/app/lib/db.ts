import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

export const sql = neon(process.env.DATABASE_URL!);

export async function testConnection() {
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
  try {
    const schemaPath = path.join(process.cwd(), 'src', 'app', 'lib', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the entire schema as one transaction
    await sql.unsafe(schema);
    
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

interface PortfolioItem {
  id: number;
  image_paths: string[];
  category: string;
  created_at?: Date;
  updated_at?: Date;
}

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    const result = await sql`
      SELECT id, image_paths, category, created_at, updated_at 
      FROM portfolio_items 
      ORDER BY created_at DESC
    `;

    // Ensure the result is properly typed
    const items = result.map(row => ({
      id: Number(row.id),
      image_paths: Array.isArray(row.image_paths) ? row.image_paths : [],
      category: String(row.category),
      created_at: row.created_at ? new Date(row.created_at) : undefined,
      updated_at: row.updated_at ? new Date(row.updated_at) : undefined
    }));

    console.log('Retrieved portfolio items:', items);
    return items;
  } catch (error) {
    console.error('Failed to get portfolio items:', error);
    throw error;
  }
}

export async function addPortfolioItem(item: Omit<PortfolioItem, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const result = await sql`
      INSERT INTO portfolio_items (image_paths, category)
      VALUES (${item.image_paths}, ${item.category})
      RETURNING *
    `;

    const newItem = {
      id: Number(result[0].id),
      image_paths: Array.isArray(result[0].image_paths) ? result[0].image_paths : [],
      category: String(result[0].category),
      created_at: result[0].created_at ? new Date(result[0].created_at) : undefined,
      updated_at: result[0].updated_at ? new Date(result[0].updated_at) : undefined
    };

    console.log('Added portfolio item:', newItem);
    return newItem;
  } catch (error) {
    console.error('Failed to add portfolio item:', error);
    throw error;
  }
}

export async function deletePortfolioItem(id: number) {
  try {
    await sql`DELETE FROM portfolio_items WHERE id = ${id}`;
    return true;
  } catch (error) {
    console.error('Failed to delete portfolio item:', error);
    throw error;
  }
}

export async function updatePortfolioItem(id: number, item: Partial<Omit<PortfolioItem, 'id' | 'created_at' | 'updated_at'>>) {
  try {
    const result = await sql`
      UPDATE portfolio_items SET
        image_paths = COALESCE(${item.image_paths}, image_paths),
        category = COALESCE(${item.category}, category)
      WHERE id = ${id}
      RETURNING *
    `;

    const updatedItem = {
      id: Number(result[0].id),
      image_paths: Array.isArray(result[0].image_paths) ? result[0].image_paths : [],
      category: String(result[0].category),
      created_at: result[0].created_at ? new Date(result[0].created_at) : undefined,
      updated_at: result[0].updated_at ? new Date(result[0].updated_at) : undefined
    };

    console.log('Updated portfolio item:', updatedItem);
    return updatedItem;
  } catch (error) {
    console.error('Failed to update portfolio item:', error);
    throw error;
  }
}

interface Category {
  id: number;
  name: string;
  created_at?: Date;
  updated_at?: Date;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const result = await sql`
      SELECT id, name, created_at, updated_at 
      FROM categories 
      ORDER BY name
    `;

    // Ensure the result is properly typed
    const categories = result.map(row => ({
      id: Number(row.id),
      name: String(row.name),
      created_at: row.created_at ? new Date(row.created_at) : undefined,
      updated_at: row.updated_at ? new Date(row.updated_at) : undefined
    }));

    console.log('Retrieved categories:', categories);
    return categories;
  } catch (error) {
    console.error('Failed to get categories:', error);
    throw error;
  }
}

export async function addCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) {
  try {
    // Check if category already exists
    const existing = await sql`SELECT id, name FROM categories WHERE name = ${category.name}`;
    if (existing.length > 0) {
      console.log(`Category ${category.name} already exists`);
      return {
        id: Number(existing[0].id),
        name: String(existing[0].name)
      };
    }

    const result = await sql`
      INSERT INTO categories (name)
      VALUES (${category.name})
      RETURNING *
    `;

    const newCategory = {
      id: Number(result[0].id),
      name: String(result[0].name),
      created_at: result[0].created_at ? new Date(result[0].created_at) : undefined,
      updated_at: result[0].updated_at ? new Date(result[0].updated_at) : undefined
    };

    console.log('Added category:', newCategory);
    return newCategory;
  } catch (error) {
    console.error('Failed to add category:', error);
    throw error;
  }
}

export async function deleteCategory(id: number) {
  try {
    await sql`DELETE FROM categories WHERE id = ${id}`;
    return true;
  } catch (error) {
    console.error('Failed to delete category:', error);
    throw error;
  }
}

export async function updateCategory(id: number, category: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>) {
  try {
    const result = await sql`
      UPDATE categories
      SET name = COALESCE(${category.name}, name)
      WHERE id = ${id}
      RETURNING *
    `;

    const updatedCategory = {
      id: Number(result[0].id),
      name: String(result[0].name),
      created_at: result[0].created_at ? new Date(result[0].created_at) : undefined,
      updated_at: result[0].updated_at ? new Date(result[0].updated_at) : undefined
    };

    console.log('Updated category:', updatedCategory);
    return updatedCategory;
  } catch (error) {
    console.error('Failed to update category:', error);
    throw error;
  }
} 