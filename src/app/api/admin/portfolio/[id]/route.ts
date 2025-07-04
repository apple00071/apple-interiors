import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const imageId = params.id;
    if (!imageId) {
      return NextResponse.json(
        { success: false, message: 'Image ID is required' },
        { status: 400 }
      );
    }

    // Load current portfolio data
    const portfolioPath = path.join(process.cwd(), 'src', 'app', 'data', 'portfolio.json');
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
    const imageToDelete = portfolioData.items.find((img: any) => img.id === Number(imageId));
    if (!imageToDelete) {
      return NextResponse.json(
        { success: false, message: 'Image not found' },
        { status: 404 }
      );
    }

    // Delete the physical file
    const filename = imageToDelete.images[0].split('/').pop();
    const filepath = path.join(process.cwd(), 'public', 'portfolio', filename);
    try {
      await fs.unlink(filepath);
    } catch (error) {
      console.error('Error deleting file:', error);
      // Continue even if file deletion fails
    }

    // Update portfolio data
    portfolioData.items = portfolioData.items.filter((img: any) => img.id !== Number(imageId));
    await fs.writeFile(
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