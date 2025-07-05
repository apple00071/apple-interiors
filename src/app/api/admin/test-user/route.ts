import { NextResponse } from 'next/server';
import { executeQuery } from '../../../lib/db';

export async function GET() {
  try {
    // Query all admin users
    const result = await executeQuery<any[]>({
      query: 'SELECT id, username, created_at FROM admin_users'
    });

    return NextResponse.json({
      message: 'Admin users found',
      users: result
    });
  } catch (error) {
    console.error('Failed to query admin users:', error);
    return NextResponse.json(
      { error: 'Failed to query admin users' },
      { status: 500 }
    );
  }
} 