import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { put } from '@vercel/blob';
import { blobConfig } from '../app/lib/blob';

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  images: string[];
  category: string;
  year: string;
  location: string;
  area: string;
}

interface PortfolioData {
  categories: string[];
  items: PortfolioItem[];
}

async function migrateImagesForCategory(category: string) {
  try {
    // Read portfolio data
    const portfolioPath = join(process.cwd(), 'src/app/data/portfolio.json');
    const portfolioData = JSON.parse(await readFile(portfolioPath, 'utf8'));

    // Find items for the specified category
    const categoryItems = portfolioData.items.filter((item: any) => item.category === category);
    
    if (categoryItems.length === 0) {
      console.log(`No items found for category: ${category}`);
      return;
    }

    console.log(`Found ${categoryItems.length} items in category: ${category}`);

    // Process each item in the category
    for (const item of categoryItems) {
      const newImages: string[] = [];

      for (const imagePath of item.images) {
        // Skip if already a Blob URL
        if (imagePath.startsWith('http')) {
          newImages.push(imagePath);
          console.log(`Skipped (already in Blob): ${imagePath}`);
          continue;
        }

        try {
          // Read image from public folder
          const publicPath = join(process.cwd(), 'public', imagePath);
          const imageBuffer = await readFile(publicPath);
          const fileName = imagePath.split('/').pop() || '';

          // Upload to Vercel Blob
          const blob = await put(`portfolio/${Date.now()}-${fileName}`, imageBuffer, {
            access: 'public',
            addRandomSuffix: false,
            token: blobConfig.token
          });

          newImages.push(blob.url);
          console.log(`Migrated: ${imagePath} -> ${blob.url}`);
        } catch (error) {
          console.error(`Failed to migrate image ${imagePath}:`, error);
          newImages.push(imagePath);
        }
      }

      // Update item with new image URLs
      item.images = newImages;
    }

    // Save updated portfolio data
    await writeFile(portfolioPath, JSON.stringify(portfolioData, null, 2));
    console.log(`Migration complete for category: ${category}`);
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

async function migrateAllRemainingCategories() {
  const categories = ['Bedroom', 'Kitchen', 'False Ceiling'];
  console.log('Starting migration for remaining categories:', categories.join(', '));
  
  for (const category of categories) {
    console.log(`\n=== Processing category: ${category} ===\n`);
    await migrateImagesForCategory(category);
  }
  
  console.log('\nMigration completed for all remaining categories!');
}

// Run migration for all remaining categories
migrateAllRemainingCategories(); 