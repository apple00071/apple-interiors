import { NextResponse } from 'next/server';
import { executeQuery } from '../../../../lib/db';
import { readdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

const VALID_CATEGORIES = [
  'living-room',
  'dining',
  'bedroom',
  'kitchen',
  'false-ceiling'
];

// Helper function to get all image files from a directory recursively
async function getImagesFromDir(dir: string): Promise<{path: string, category: string}[]> {
  const images: {path: string, category: string}[] = [];
  const items = await readdir(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      // Only process if it's a valid category
      if (VALID_CATEGORIES.includes(item.name)) {
        // Category folder
        const categoryImages = await readdir(fullPath);
        categoryImages.forEach(image => {
          if (image.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            images.push({
              path: `/portfolio/${item.name}/${image}`,
              category: item.name // This is now guaranteed to be a valid category
            });
          }
        });
      }
    }
  }
  
  return images;
}

export async function GET() {
  try {
    const portfolioDir = path.join(process.cwd(), 'public', 'portfolio');
    
    if (!existsSync(portfolioDir)) {
      return NextResponse.json(
        { error: 'Portfolio directory does not exist' },
        { status: 404 }
      );
    }

    // Get all images from the portfolio directory
    const images = await getImagesFromDir(portfolioDir);
    console.log('Found images:', images); // Debug log

    // Insert each image into the database if it doesn't already exist
    let importedCount = 0;
    for (const image of images) {
      try {
        const result = await executeQuery({
          query: `
            INSERT INTO portfolio_items (category_id, image_url)
            SELECT $1, $2
            WHERE NOT EXISTS (
              SELECT 1 FROM portfolio_items WHERE image_url = $2
            )
            RETURNING id
          `,
          values: [image.category, image.path]
        });
        
        if (Array.isArray(result) && result.length > 0) {
          importedCount++;
        }
      } catch (error) {
        console.error('Error importing image:', image, error);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Imported ${importedCount} images`,
      images 
    });

  } catch (error) {
    console.error('Error importing portfolio items:', error);
    return NextResponse.json(
      { error: 'Failed to import portfolio items' },
      { status: 500 }
    );
  }
} 