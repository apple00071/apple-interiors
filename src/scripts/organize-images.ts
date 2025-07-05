import { readFile, writeFile, copyFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

async function organizeImagesForCategory(category: string) {
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

    // Create organized directory structure
    const baseDir = join(process.cwd(), 'public', 'portfolio');
    const categoryDir = join(baseDir, category.toLowerCase().replace(/ /g, '-'));
    
    if (!existsSync(baseDir)) {
      await mkdir(baseDir, { recursive: true });
    }
    if (!existsSync(categoryDir)) {
      await mkdir(categoryDir, { recursive: true });
    }

    // Process each item in the category
    for (const item of categoryItems) {
      const newImages: string[] = [];

      for (const imagePath of item.images) {
        // Skip if it's already a URL
        if (imagePath.startsWith('http')) {
          newImages.push(imagePath);
          console.log(`Skipped (external URL): ${imagePath}`);
          continue;
        }

        try {
          // Get source and destination paths
          const sourceFile = join(process.cwd(), 'public', imagePath);
          const fileName = `${Date.now()}-${imagePath.split('/').pop()}`;
          const newPath = join('portfolio', category.toLowerCase().replace(/ /g, '-'), fileName);
          const destFile = join(process.cwd(), 'public', newPath);

          // Copy file to new location
          await copyFile(sourceFile, destFile);
          
          // Update path in portfolio data (using forward slashes for URLs)
          const urlPath = '/' + newPath.replace(/\\/g, '/');
          newImages.push(urlPath);
          console.log(`Organized: ${imagePath} -> ${urlPath}`);
        } catch (error) {
          console.error(`Failed to organize image ${imagePath}:`, error);
          newImages.push(imagePath);
        }
      }

      // Update item with new image paths
      item.images = newImages;
    }

    // Save updated portfolio data
    await writeFile(portfolioPath, JSON.stringify(portfolioData, null, 2));
    console.log(`Organization complete for category: ${category}`);
  } catch (error) {
    console.error('Organization failed:', error);
  }
}

async function organizeAllRemainingCategories() {
  const categories = ['Kitchen', 'False Ceiling'];  // Only remaining categories
  console.log('Starting organization for remaining categories:', categories.join(', '));
  
  for (const category of categories) {
    console.log(`\n=== Processing category: ${category} ===\n`);
    await organizeImagesForCategory(category);
  }
  
  console.log('\nOrganization completed for all remaining categories!');
}

// Run organization for remaining categories
organizeAllRemainingCategories(); 