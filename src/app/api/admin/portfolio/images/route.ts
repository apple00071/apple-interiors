import { NextResponse } from 'next/server';
import { createConnection } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const projectId = formData.get('projectId');
    const images = formData.getAll('images');

    if (!projectId || images.length === 0) {
      return NextResponse.json(
        { error: 'Project ID and images are required' },
        { status: 400 }
      );
    }

    const connection = await createConnection();

    try {
      for (let i = 0; i < images.length; i++) {
        const image = images[i] as File;
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create directory if it doesn't exist
        const uploadDir = join(process.cwd(), 'public/uploads/portfolio');
        await createDirIfNotExists(uploadDir);

        // Generate unique filename
        const filename = `${Date.now()}-${Math.random().toString(36).substring(2)}-${image.name}`;
        const filepath = join(uploadDir, filename);

        // Save file
        await writeFile(filepath, buffer);

        // Save to database
        await connection.execute(
          'INSERT INTO portfolio_images (project_id, image_url, image_order) VALUES (?, ?, ?)',
          [projectId, `/uploads/portfolio/${filename}`, i]
        );
      }

      return NextResponse.json({ success: true });
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error('Error uploading images:', error);
    return NextResponse.json(
      { error: 'Failed to upload images' },
      { status: 500 }
    );
  }
}

async function createDirIfNotExists(dir: string) {
  try {
    await writeFile(dir, '', { flag: 'wx' });
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === 'EEXIST') {
      return;
    }
    throw error;
  }
} 