import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface DecodedToken {
  userId: string;
  username: string;
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      console.log('No token found in verify endpoint');
      return NextResponse.json({ error: 'No token found' }, { status: 401 });
    }

    // Verify the token
    const decoded = verify(token, JWT_SECRET) as DecodedToken;
    console.log('Token verified for user:', decoded);

    return NextResponse.json({ 
      success: true,
      user: {
        userId: decoded.userId,
        username: decoded.username
      }
    });
  } catch (error) {
    console.error('Token verification failed:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
} 