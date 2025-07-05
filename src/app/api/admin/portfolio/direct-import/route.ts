import { NextResponse } from 'next/server';
import { executeQuery } from '../../../../lib/db';
import { readdir, unlink, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

const VALID_CATEGORIES = [
  'living-room',
  'dining',
  'bedroom',
  'kitchen',
  'false-ceiling'
];

// Function to delete image file
async function deleteImageFile(imageUrl: string) {
  try {
    const filePath = path.join(process.cwd(), 'public', imageUrl);
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
    // First get all existing image URLs
    const existingImages = await executeQuery<{ image_url: string }[]>({
      query: 'SELECT image_url FROM portfolio_items'
    });

    // Delete existing image files
    for (const image of existingImages) {
      await deleteImageFile(image.image_url);
    }

    // Then clear database records
    await executeQuery({
      query: 'DELETE FROM portfolio_items'
    });

    const portfolioDir = path.join(process.cwd(), 'public', 'images', 'portfolio');
    console.log('Reading from directory:', portfolioDir);

    // Ensure the portfolio directory exists
    await ensureDir(portfolioDir);

    let totalImported = 0;
    let errors = [];
    
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
          
          // Take only the first 6 images for each category
          const sortedFiles = imageFiles
            .sort((a, b) => {
              // Sort by filename (assuming timestamp-based names)
              return a.localeCompare(b);
            })
            .slice(0, 6);

          for (const file of sortedFiles) {
            try {
              const imagePath = `/images/portfolio/${category}/${file}`;
              console.log(`Importing: ${imagePath}`);
              
              await executeQuery({
                query: `
                  INSERT INTO portfolio_items (category_id, image_url, created_at)
                  VALUES ($1, $2, NOW())
                `,
                values: [category, imagePath]
              });
              totalImported++;
            } catch (fileError) {
              console.error(`Error importing file ${file}:`, fileError);
              errors.push(`Failed to import ${category}/${file}: ${fileError instanceof Error ? fileError.message : 'Unknown error'}`);
            }
          }
        }
      } catch (categoryError) {
        console.error(`Error processing category ${category}:`, categoryError);
        errors.push(`Failed to process category ${category}: ${categoryError instanceof Error ? categoryError.message : 'Unknown error'}`);
      }
    }

    // Verify the import
    const verifyResult = await executeQuery({
      query: 'SELECT category_id, COUNT(*) as count FROM portfolio_items GROUP BY category_id'
    });
    console.log('Import verification:', verifyResult);

    return NextResponse.json({
      success: true,
      count: totalImported,
      message: `Successfully imported ${totalImported} images`,
      verification: verifyResult,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error importing portfolio items:', error);
    return NextResponse.json(
      { 
        error: 'Failed to import portfolio items',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 