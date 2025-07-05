import { Pool } from 'pg';
import { hash } from 'bcryptjs';

interface DatabaseError extends Error {
  code?: string;
  detail?: string;
  schema?: string;
  table?: string;
}

// Parse the connection string
const connectionString = 'postgresql://neondb_owner:npg_M0jZJHs9OSKY@ep-muddy-flower-a86z1fws-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require';

// Create connection pool
const pool = new Pool({ connectionString });

// Test database connection
export async function testDatabaseConnection() {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to the database');
    
    // Test a simple query
    const result = await client.query('SELECT 1');
    console.log('Database query successful');
    
    client.release();
    return { success: true, message: 'Database connection successful' };
  } catch (error) {
    const dbError = error as DatabaseError;
    console.error('Database connection error:', {
      message: dbError.message,
      code: dbError.code,
      detail: dbError.detail
    });
    return { 
      success: false, 
      message: 'Database connection failed', 
      error: dbError.message,
      code: dbError.code 
    };
  }
}

export async function executeQuery<T>({ query, values }: { query: string; values?: any[] }): Promise<T> {
  try {
    const result = await pool.query(query, values);
    return result.rows as T;
  } catch (error) {
    const dbError = error as DatabaseError;
    console.error('Database query error:', {
      message: dbError.message,
      code: dbError.code,
      query: query,
      values: values
    });
    throw error;
  }
}

// Initialize database tables if they don't exist
export async function initializeDatabase() {
  try {
    // First test the connection
    const connectionTest = await testDatabaseConnection();
    if (!connectionTest.success) {
      throw new Error(`Database initialization failed: ${connectionTest.message}`);
    }

    // Create admin_users table
    await executeQuery({
      query: `
        CREATE TABLE IF NOT EXISTS admin_users (
          id VARCHAR(36) PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `
    });

    // Create portfolio_items table if it doesn't exist
    await executeQuery({
      query: `
        CREATE TABLE IF NOT EXISTS portfolio_items (
          id SERIAL PRIMARY KEY,
          category_id VARCHAR(50) NOT NULL,
          image_url TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `
    });

    // Check if portfolio_items table has any data
    const portfolioItems = await executeQuery<any[]>({
      query: 'SELECT COUNT(*) as count FROM portfolio_items'
    });
    console.log('Current portfolio items count:', portfolioItems[0].count);

    // Insert default admin user if it doesn't exist
    const defaultAdmin = {
      id: 'admin-1',
      username: 'u14178067_apple',
      password: '3]C*5X+EeUc'
    };

    // Check if admin user exists
    const adminExists = await executeQuery<any[]>({
      query: 'SELECT id FROM admin_users WHERE username = $1',
      values: [defaultAdmin.username]
    });

    if (!adminExists.length) {
      // Hash the password before storing
      const hashedPassword = await hash(defaultAdmin.password, 12);
      
      await executeQuery({
        query: `
          INSERT INTO admin_users (id, username, password)
          VALUES ($1, $2, $3)
        `,
        values: [defaultAdmin.id, defaultAdmin.username, hashedPassword]
      });
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
} 