import { NextResponse } from 'next/server';
import { initDb } from '../../../lib/init-db';

interface DatabaseError extends Error {
  code?: string;
  detail?: string;
}

export async function GET() {
  try {
    const result = await initDb();
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to initialize database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    const err = error as DatabaseError;
    console.error('Failed to initialize database:', err);
    return NextResponse.json(
      { error: 'Failed to initialize database', details: err.message },
      { status: 500 }
    );
  }
} 