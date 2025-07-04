import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink, readFile } from 'fs/promises';
import { join } from 'path';
import fs from 'fs/promises';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { existsSync } from 'fs';

const MAX_IMAGES_PER_CATEGORY = 6;

async function deleteImage(imagePath: string) {
  try {
    // Check if file exists before attempting to delete
    if (existsSync(imagePath)) {
      await unlink(imagePath);
    }
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const image = formData.get('image') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const replaceImageId = formData.get('replaceImageId') as string;

    if (!image || !title || !description || !category) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!image.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type' },
        { status: 400 }
      );
    }

    // Load current portfolio data
    const portfolioPath = join(process.cwd(), 'src', 'app', 'data', 'portfolio.json');
    let portfolioData;
    try {
      const fileContent = await fs.readFile(portfolioPath, 'utf-8');
      portfolioData = JSON.parse(fileContent);
    } catch {
      portfolioData = { categories: [], items: [] };
    }

    // Check if category has reached the limit
    const categoryImages = portfolioData.items.filter((item: any) => item.category === category);
    if (!replaceImageId && categoryImages.length >= MAX_IMAGES_PER_CATEGORY) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Cannot add more images to this category. Maximum ${MAX_IMAGES_PER_CATEGORY} images allowed. Please delete an existing image first.` 
        },
        { status: 400 }
      );
    }

    // If replacing an image, delete the old one
    if (replaceImageId) {
      const oldImage = portfolioData.items.find((item: any) => item.id === parseInt(replaceImageId));
      if (oldImage && oldImage.images.length > 0) {
        const oldImagePath = join(process.cwd(), 'public', oldImage.images[0].replace('/', ''));
        await deleteImage(oldImagePath);
      }
    }

    // Save new image
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${image.name}`;
    const imagePath = join(process.cwd(), 'public', 'portfolio', filename);
    await writeFile(imagePath, buffer);

    // Update portfolio data
    const newImage = {
      id: replaceImageId ? parseInt(replaceImageId) : Date.now(),
      title: title || image.name,
      description: description || '',
      images: [`/portfolio/${filename}`],
      category,
      year: new Date().getFullYear().toString(),
      location: "Hyderabad",
      area: "0"
    };

    if (replaceImageId) {
      // Replace existing image
      const index = portfolioData.items.findIndex((item: any) => item.id === parseInt(replaceImageId));
      if (index !== -1) {
        portfolioData.items[index] = newImage;
      }
    } else {
      // Add new image
      portfolioData.items.unshift(newImage);
    }

    // Save updated portfolio data
    await writeFile(
      portfolioPath,
      JSON.stringify(portfolioData, null, 2),
      'utf-8'
    );

    return NextResponse.json({ success: true, data: portfolioData.items });
  } catch (error) {
    console.error('Portfolio upload error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const portfolioPath = join(process.cwd(), 'src', 'app', 'data', 'portfolio.json');
    let portfolioData;
    try {
      const fileContent = await fs.readFile(portfolioPath, 'utf-8');
      portfolioData = JSON.parse(fileContent);
    } catch {
      portfolioData = { categories: [], items: [] };
    }

    return NextResponse.json({ success: true, data: portfolioData.items });
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify admin authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get image ID from URL
    const url = new URL(request.url);
    const parts = url.pathname.split('/');
    const imageId = parts[parts.length - 1];

    if (!imageId) {
      return NextResponse.json(
        { success: false, message: 'Image ID is required' },
        { status: 400 }
      );
    }

    // Load current portfolio data
    const portfolioPath = join(process.cwd(), 'src', 'app', 'data', 'portfolio.json');
    let portfolioData;
    try {
      const fileContent = await fs.readFile(portfolioPath, 'utf-8');
      portfolioData = JSON.parse(fileContent);
    } catch {
      return NextResponse.json(
        { success: false, message: 'Portfolio data not found' },
        { status: 404 }
      );
    }

    // Find the image to delete
    const imageToDelete = portfolioData.items.find((img: any) => img.id === parseInt(imageId));
    if (!imageToDelete) {
      return NextResponse.json(
        { success: false, message: 'Image not found' },
        { status: 404 }
      );
    }

    // Delete the physical file
    if (imageToDelete.images.length > 0) {
      const imagePath = join(process.cwd(), 'public', imageToDelete.images[0].replace('/', ''));
      await deleteImage(imagePath);
    }

    // Update portfolio data
    portfolioData.items = portfolioData.items.filter((img: any) => img.id !== parseInt(imageId));
    await writeFile(
      portfolioPath,
      JSON.stringify(portfolioData, null, 2),
      'utf-8'
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Portfolio delete error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete image' },
      { status: 500 }
    );
  }
} 