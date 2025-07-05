import { readFile, writeFile, mkdir, access } from 'fs/promises';
import { join } from 'path';
import fetch from 'node-fetch';

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

// Helper function to ensure directory exists
async function ensureDir(dir: string) {
  try {
    await access(dir);
  } catch {
    await mkdir(dir, { recursive: true });
  }
}

// Helper function to check if file exists
async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

// Helper function to download image
async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

async function migrateImages() {
  try {
    // Read portfolio data
    const portfolioPath = join(process.cwd(), 'src/app/data/portfolio.json');
    const portfolioData = JSON.parse(await readFile(portfolioPath, 'utf8'));

    // Ensure base portfolio directory exists
    const baseDir = join(process.cwd(), 'public', 'portfolio');
    await ensureDir(baseDir);

    // Process each portfolio item
    for (const item of portfolioData.items) {
      if (item.images.length === 0) continue;

      // Create category directory
      const categorySlug = item.category.toLowerCase().replace(/ /g, '-');
      const categoryDir = join(baseDir, categorySlug);
      await ensureDir(categoryDir);

      // Process each image
      const newImages: string[] = [];
      for (const imageUrl of item.images) {
        try {
          // Handle local paths
          if (!imageUrl.startsWith('http')) {
            // Remove leading slash for path joining
            const localPath = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
            const fullPath = join(process.cwd(), 'public', localPath);
            
            if (await fileExists(fullPath)) {
              newImages.push(imageUrl);
              console.log(`Verified local file exists: ${imageUrl}`);
            } else {
              console.log(`Local file missing: ${imageUrl}`);
              // Try to download from Vercel Blob
              const blobUrl = `https://apple-interiors.vercel.app${imageUrl}`;
              console.log(`Attempting to download from: ${blobUrl}`);
              const imageBuffer = await downloadImage(blobUrl);
              await writeFile(fullPath, imageBuffer);
              newImages.push(imageUrl);
              console.log(`Downloaded missing local file: ${imageUrl}`);
            }
            continue;
          }

          // Download and save image from URL
          console.log(`Downloading: ${imageUrl}`);
          const imageBuffer = await downloadImage(imageUrl);
          const timestamp = Date.now();
          const fileExtension = imageUrl.split('.').pop() || 'png';
          const fileName = `${timestamp}.${fileExtension}`;
          const imagePath = join(categoryDir, fileName);
          await writeFile(imagePath, imageBuffer);

          // Update image path
          const publicPath = `/portfolio/${categorySlug}/${fileName}`;
          newImages.push(publicPath);
          console.log(`Migrated: ${imageUrl} -> ${publicPath}`);
        } catch (error) {
          console.error(`Failed to migrate image ${imageUrl}:`, error);
          // Keep the original URL if migration fails
          newImages.push(imageUrl);
        }
      }

      // Update item with new image paths
      item.images = newImages;
    }

    // Save updated portfolio data
    await writeFile(portfolioPath, JSON.stringify(portfolioData, null, 2));
    console.log('Migration complete!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run migration
migrateImages(); 