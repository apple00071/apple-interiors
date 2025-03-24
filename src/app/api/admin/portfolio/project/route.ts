import { NextResponse } from 'next/server';
import { createConnection } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import mysql from 'mysql2/promise';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const connection = await createConnection();

    try {
      // First get or create category
      await connection.execute<mysql.ResultSetHeader>(
        'INSERT IGNORE INTO portfolio_categories (name, slug) VALUES (?, ?)',
        [data.category, data.category.toLowerCase().replace(/\s+/g, '-')]
      );

      const [categoryRows] = await connection.execute<mysql.RowDataPacket[]>(
        'SELECT id FROM portfolio_categories WHERE name = ?',
        [data.category]
      );
      const categoryId = categoryRows[0]?.id;

      if (!categoryId) {
        throw new Error('Failed to get category ID');
      }

      // Create project
      const [result] = await connection.execute<mysql.ResultSetHeader>(
        `INSERT INTO portfolio_projects 
         (category_id, title, description, location, area, year) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [categoryId, data.title, data.description, data.location, data.area, data.year]
      );

      return NextResponse.json({ 
        success: true,
        projectId: result.insertId
      });
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
} 