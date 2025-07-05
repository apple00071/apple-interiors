import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

async function updatePathsForCategory(category: string) {
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
        // Skip if it's already a URL or already in the correct format
        if (imagePath.startsWith('http') || imagePath.startsWith('/portfolio/')) {
          newImages.push(imagePath);
          console.log(`Skipped (already correct format): ${imagePath}`);
          continue;
        }

        try {
          // Convert old path to new portfolio path format
          const fileName = imagePath.split('/').pop();
          const newPath = `/portfolio/${category.toLowerCase().replace(/ /g, '-')}/${fileName}`;
          newImages.push(newPath);
          console.log(`Updated path: ${imagePath} -> ${newPath}`);
        } catch (error) {
          console.error(`Failed to update path for ${imagePath}:`, error);
          newImages.push(imagePath);
        }
      }

      // Update item with new image paths
      item.images = newImages;
    }

    // Save updated portfolio data
    await writeFile(portfolioPath, JSON.stringify(portfolioData, null, 2));
    console.log(`Path updates complete for category: ${category}`);
  } catch (error) {
    console.error('Update failed:', error);
  }
}

async function updateAllRemainingCategories() {
  const categories = ['Kitchen', 'False Ceiling'];  // Only remaining categories
  console.log('Starting path updates for remaining categories:', categories.join(', '));
  
  for (const category of categories) {
    console.log(`\n=== Processing category: ${category} ===\n`);
    await updatePathsForCategory(category);
  }
  
  console.log('\nPath updates completed for all remaining categories!');
}

// Run updates for remaining categories
updateAllRemainingCategories(); 