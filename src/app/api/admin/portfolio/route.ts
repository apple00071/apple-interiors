import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '../../../lib/db';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

// Function to save image to public directory
async function saveImage(file: File, category: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create a unique filename
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
  
  // Ensure portfolio directory exists
  const portfolioDir = path.join(process.cwd(), 'public', 'images', 'portfolio', category);
  if (!existsSync(portfolioDir)) {
    await mkdir(portfolioDir, { recursive: true });
  }
  
  const publicPath = path.join(portfolioDir, filename);
  
  await writeFile(publicPath, buffer);
  return `/images/portfolio/${category}/${filename}`;
}

// Function to delete image file
async function deleteImageFile(imageUrl: string) {
  try {
    const filePath = path.join(process.cwd(), 'public', imageUrl);
    if (existsSync(filePath)) {
      await unlink(filePath);
    }
  } catch (error) {
    console.error('Error deleting image file:', error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const category = formData.get('category') as string;
    const id = formData.get('id') as string;

    if (!image || !category || !id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the old image URL
    const oldImage = await executeQuery<{ image_url: string }[]>({
      query: 'SELECT image_url FROM portfolio_items WHERE id = $1',
      values: [id]
    });

    if (oldImage && oldImage.length > 0) {
      // Delete the old image file
      await deleteImageFile(oldImage[0].image_url);
    }

    // Save new image and get its URL
    const imageUrl = await saveImage(image, category);

    // Update database record
    await executeQuery({
      query: `
        UPDATE portfolio_items 
        SET category_id = $1, image_url = $2
        WHERE id = $3
      `,
      values: [category, imageUrl, id]
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating portfolio item:', error);
    return NextResponse.json(
      { error: 'Failed to update portfolio item' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const category = formData.get('category') as string;

    if (!image || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save image and get its URL
    const imageUrl = await saveImage(image, category);

    // Insert into database
    await executeQuery({
      query: `
        INSERT INTO portfolio_items (category_id, image_url, created_at)
        VALUES ($1, $2, NOW())
      `,
      values: [category, imageUrl]
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error creating portfolio item:', error);
    return NextResponse.json(
      { error: 'Failed to create portfolio item' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get 6 most recent images per category
    const result = await executeQuery({
      query: `
        WITH RankedItems AS (
          SELECT 
            id,
            category_id,
            image_url,
            created_at,
            ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY created_at DESC) as rn
          FROM portfolio_items
        )
        SELECT 
          id,
          category_id,
          image_url,
          created_at
        FROM RankedItems
        WHERE rn <= 6
        ORDER BY category_id, created_at DESC
      `
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio items' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Missing portfolio item ID' },
        { status: 400 }
      );
    }

    // First get the image URL
    const result = await executeQuery<{ image_url: string }[]>({
      query: 'SELECT image_url FROM portfolio_items WHERE id = $1',
      values: [id]
    });

    if (result && result.length > 0) {
      // Delete the image file first
      await deleteImageFile(result[0].image_url);
    }

    // Then delete the database record
    await executeQuery({
      query: 'DELETE FROM portfolio_items WHERE id = $1',
      values: [id]
    });

    return NextResponse.json({ 
      success: true,
      message: `Successfully deleted portfolio item ${id}`
    });

  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    return NextResponse.json(
      { error: 'Failed to delete portfolio item' },
      { status: 500 }
    );
  }
}