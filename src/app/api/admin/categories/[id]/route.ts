import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID' },
        { status: 400 }
      );
    }

    // Start a transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Get the category name
      const categoryResult = await client.query(
        'SELECT name FROM categories WHERE id = $1',
        [id]
      );

      if (categoryResult.rowCount === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        );
      }

      const categoryName = categoryResult.rows[0].name;

      // Delete all portfolio items in this category
      await client.query(
        'DELETE FROM portfolio_items WHERE category = $1',
        [categoryName]
      );

      // Delete the category
      await client.query(
        'DELETE FROM categories WHERE id = $1',
        [id]
      );

      await client.query('COMMIT');
      return NextResponse.json({ message: 'Category deleted successfully' });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Failed to delete category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
} 