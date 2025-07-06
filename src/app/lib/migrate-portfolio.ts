import { addPortfolioItem } from './db';
import portfolioData from '../data/portfolio.json';

export async function migratePortfolioData() {
  try {
    console.log('Starting portfolio data migration...');
    
    for (const item of portfolioData.items) {
      try {
        await addPortfolioItem(
          item.title,
          null, // No description in current data
          item.category,
          null, // No year in current data
          null, // No location in current data
          null, // No area in current data
          item.images
        );
        console.log(`Migrated item: ${item.title}`);
      } catch (error) {
        console.error(`Error migrating item ${item.title}:`, error);
      }
    }
    
    console.log('Portfolio data migration completed');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
} 