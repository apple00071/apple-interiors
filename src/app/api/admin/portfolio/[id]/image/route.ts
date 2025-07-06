import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { sql } from '../../../../../lib/db';

const MAX_IMAGES = 6;

// Function to delete image file
async function deleteImageFile(imageUrl: string) {
  try {
    const filePath = path.join(process.cwd(), 'public', imageUrl);
    if (existsSync(filePath)) {
      await unlink(filePath);
      console.log(`Deleted file: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting image file:', error);
    return false;
  }
}

// Function to ensure directory exists
async function ensureDir(dirPath: string) {
  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const category = formData.get('category') as string;
    const imageIndex = parseInt(formData.get('imageIndex') as string);

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    if (imageIndex >= MAX_IMAGES) {
      return NextResponse.json({ error: 'Maximum number of images reached' }, { status: 400 });
    }

    // Create unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${image.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const relativePath = `/images/portfolio/${category}/${filename}`;
    const absolutePath = path.join(process.cwd(), 'public', relativePath);

    // Ensure directory exists
    const dir = path.dirname(absolutePath);
    await ensureDir(dir);

    // First get the current image_paths array
    const result = await sql`
      SELECT image_paths FROM portfolio_items WHERE id = ${params.id}
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Portfolio item not found' }, { status: 404 });
    }

    const currentImagePaths = result[0].image_paths || [];
    
    // Get the old image path to delete it
    const oldImagePath = currentImagePaths[imageIndex];
    
    // Create new array with replaced image
    const newImagePaths = [...currentImagePaths];
    newImagePaths[imageIndex] = relativePath;

    // Ensure we don't exceed the maximum number of images
    if (newImagePaths.length > MAX_IMAGES) {
      newImagePaths.splice(MAX_IMAGES);
    }

    // Update the database with the new image paths array
    await sql`
      UPDATE portfolio_items 
      SET image_paths = ${newImagePaths}
      WHERE id = ${params.id}
    `;

    // Write the new file
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(absolutePath, buffer);

    // Delete the old file if it exists
    if (oldImagePath) {
      await deleteImageFile(oldImagePath);
    }

    // Return response with cache control headers
    const response = NextResponse.json({ success: true, imagePath: relativePath });
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    return response;
  } catch (error) {
    console.error('Error handling image upload:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { imagePath } = await request.json();

    if (!imagePath) {
      return NextResponse.json({ error: 'No image path provided' }, { status: 400 });
    }

    // First get the current image_paths array
    const result = await sql`
      SELECT image_paths FROM portfolio_items WHERE id = ${params.id}
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Portfolio item not found' }, { status: 404 });
    }

    const currentImagePaths = result[0].image_paths || [];
    const newImagePaths = currentImagePaths.filter((path: string) => path !== imagePath);

    // Update the database with the filtered image paths
    await sql`
      UPDATE portfolio_items 
      SET image_paths = ${newImagePaths}
      WHERE id = ${params.id}
    `;

    // Then delete the file
    const deleted = await deleteImageFile(imagePath);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Failed to delete image file' },
        { status: 500 }
      );
    }

    // Return response with cache control headers
    const response = NextResponse.json({ success: true });
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    return response;
  } catch (error) {
    console.error('Error handling image deletion:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
} 