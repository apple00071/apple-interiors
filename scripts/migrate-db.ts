import { config } from 'dotenv';
import { initializeDatabase } from '../src/app/lib/db';
import { migratePortfolioData } from '../src/app/lib/migrate-portfolio';

// Load environment variables
config();

console.log('Database URL:', process.env.DATABASE_URL);

async function main() {
  try {
    // Initialize database schema
    console.log('Initializing database schema...');
    await initializeDatabase();

    // Migrate portfolio data
    console.log('Migrating portfolio data...');
    await migratePortfolioData();

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main(); 