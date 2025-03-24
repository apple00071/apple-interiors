import { NextResponse } from 'next/server';
import { createConnection } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import mysql from 'mysql2/promise';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const projectId = formData.get('projectId');
    const file = formData.get('file') as File;

    if (!projectId || !file) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save file to public/images/portfolio
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create unique filename
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const filepath = path.join(process.cwd(), 'public', 'images', 'portfolio', filename);
    
    await writeFile(filepath, buffer);
    const imageUrl = `/images/portfolio/${filename}`;

    // Save to database
    const connection = await createConnection();
    try {
      const [result] = await connection.execute<mysql.ResultSetHeader>(
        'INSERT INTO portfolio_images (project_id, url) VALUES (?, ?)',
        [projectId, imageUrl]
      );

      return NextResponse.json({
        success: true,
        imageId: result.insertId,
        url: imageUrl
      });
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
} 