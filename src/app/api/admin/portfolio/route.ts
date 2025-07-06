import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT * FROM portfolio_items ORDER BY created_at DESC'
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Failed to fetch portfolio items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio items' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { image_paths, category } = await request.json();

    // Validate input
    if (!image_paths || !Array.isArray(image_paths) || !category) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }

    // Insert new portfolio item
    const result = await pool.query(
      'INSERT INTO portfolio_items (image_paths, category) VALUES ($1, $2) RETURNING *',
      [image_paths, category]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Failed to create portfolio item:', error);
    return NextResponse.json(
      { error: 'Failed to create portfolio item' },
      { status: 500 }
    );
  }
}