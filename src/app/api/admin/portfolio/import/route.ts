import { NextResponse } from 'next/server';
import { sql } from '../../../../lib/db';
import { readdir, unlink, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

const VALID_CATEGORIES = [
  'living-room',
  'dining',
  'bedroom',
  'kitchen',
  'false-ceiling'
] as const;

type Category = typeof VALID_CATEGORIES[number];

// Function to delete image file
async function deleteImageFile(imagePath: string) {
  try {
    const filePath = path.join(process.cwd(), 'public', imagePath);
    if (existsSync(filePath)) {
      await unlink(filePath);
      console.log(`Deleted file: ${filePath}`);
    }
  } catch (error) {
    console.error('Error deleting image file:', error);
  }
}

// Function to ensure directory exists
async function ensureDir(dirPath: string) {
  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true });
  }
}

export async function GET() {
  try {
    // Skip file deletion during build
    if (process.env.NODE_ENV !== 'production') {
      // First get all existing image paths
      const existingItems = await sql`SELECT image_paths FROM portfolio_items`;

      // Delete existing image files
      for (const item of existingItems) {
        if (Array.isArray(item.image_paths)) {
          for (const imagePath of item.image_paths) {
            await deleteImageFile(imagePath);
          }
        }
      }
    }

    // Then clear database records
    await sql`DELETE FROM portfolio_items`;

    const portfolioDir = path.join(process.cwd(), 'public', 'images', 'portfolio');
    console.log('Reading from directory:', portfolioDir);

    // Ensure the portfolio directory exists
    await ensureDir(portfolioDir);

    let totalImported = 0;
    let errors = [];
    let importVerification = [];
    
    for (const category of VALID_CATEGORIES) {
      try {
        const categoryDir = path.join(portfolioDir, category);
        console.log('Checking category directory:', categoryDir);
        
        // Ensure category directory exists
        await ensureDir(categoryDir);
        
        if (existsSync(categoryDir)) {
          const files = await readdir(categoryDir);
          const imageFiles = files.filter(file => 
            /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
          );
          
          console.log(`Found ${imageFiles.length} images in ${category}`);
          importVerification.push({ category, image_count: imageFiles.length });
          
          // Take only the first 6 images for each category
          const sortedFiles = imageFiles
            .sort((a, b) => {
              // Sort by filename (assuming timestamp-based names)
              return a.localeCompare(b);
            })
            .slice(0, 6);

          // Ensure category exists
          await sql`
            INSERT INTO categories (name)
            VALUES (${category})
            ON CONFLICT (name) DO NOTHING
          `;

          // Create image paths array
          const imagePaths = sortedFiles.map(file => 
            `/images/portfolio/${category}/${file}`
          );

          if (imagePaths.length > 0) {
            try {
              await sql`
                INSERT INTO portfolio_items (image_paths, category)
                VALUES (${imagePaths}, ${category})
              `;
              totalImported += imagePaths.length;
            } catch (error) {
              console.error(`Error importing images for category ${category}:`, error);
              errors.push(`Failed to import images for ${category}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
          }
        }
      } catch (error) {
        console.error(`Error processing category ${category}:`, error);
        errors.push(`Failed to process ${category}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    console.log('Import verification:', importVerification);

    return NextResponse.json({
      success: true,
      totalImported,
      errors: errors.length > 0 ? errors : undefined,
      verification: importVerification
    });
  } catch (error) {
    console.error('Error importing portfolio items:', error);
    return NextResponse.json(
      { error: 'Failed to import portfolio items', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 