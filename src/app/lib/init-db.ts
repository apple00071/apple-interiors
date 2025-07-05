import { executeQuery } from './db';

export async function initDb() {
  try {
    // Create portfolio_items table if it doesn't exist
    await executeQuery({
      query: `
        CREATE TABLE IF NOT EXISTS portfolio_items (
          id SERIAL PRIMARY KEY,
          category_id VARCHAR(50) NOT NULL,
          image_url TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `,
      values: [],
    });

    console.log('Database initialized successfully');
    return { 
      success: true,
      message: 'Database initialized successfully'
    };
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
} 