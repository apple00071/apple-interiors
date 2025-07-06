import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET() {
  try {
    const token = cookies().get('auth_token')?.value;

    if (!token) {
      console.log('No auth token found in cookies');
      return NextResponse.json(
        { error: 'Not authenticated', message: 'No auth token found' },
        { status: 401 }
      );
    }

    // Verify the token and get the decoded data
    const decoded = verify(token, JWT_SECRET);

    return NextResponse.json({ 
      success: true,
      user: {
        username: (decoded as any).username
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { 
        error: 'Invalid token', 
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 401 }
    );
  }
} 