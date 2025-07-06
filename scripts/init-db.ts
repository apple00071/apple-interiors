import 'dotenv/config';
import { initializeDatabase } from '../src/app/lib/db';
import { initializeData } from '../src/app/lib/init-data';

async function main() {
  try {
    console.log('Initializing database schema...');
    await initializeDatabase();
    console.log('Database schema initialized successfully');

    console.log('Initializing data...');
    await initializeData();
    console.log('Data initialization completed');

    process.exit(0);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to initialize database:', error.message);
    } else {
      console.error('Failed to initialize database:', error);
    }
    process.exit(1);
  }
}

main().catch(error => {
  if (error instanceof Error) {
    console.error('Unhandled error:', error.message);
  } else {
    console.error('Unhandled error:', error);
  }
  process.exit(1);
}); 