import { initializeDatabase } from './db';
import { initializeData } from './init-data';

export interface InitDbResult {
  success: boolean;
  message: string;
}

export async function initDb(): Promise<InitDbResult> {
  try {
    // Initialize database schema
    await initializeDatabase();
    
    // Initialize data
    await initializeData();
    
    return {
      success: true,
      message: 'Database initialized successfully'
    };
  } catch (error) {
    console.error('Database initialization failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
} 