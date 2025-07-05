import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '../../../../lib/db';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcryptjs';

interface LoginError extends Error {
  code?: string;
  stack?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    console.log('Login attempt started');
    const { username, password } = await request.json();
    console.log('Received login request for username:', username);

    // Query the admin user from the database
    console.log('Querying database for user');
    const result = await executeQuery<any[]>({
      query: 'SELECT * FROM admin_users WHERE username = $1',
      values: [username]
    });
    console.log('Database query result:', result);

    if (!Array.isArray(result) || result.length === 0) {
      console.log('No user found with username:', username);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = result[0];
    console.log('Found user:', { id: user.id, username: user.username });

    // Compare the provided password with the stored hash
    console.log('Comparing passwords');
    const isPasswordValid = await compare(password, user.password);
    console.log('Password comparison result:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Invalid password for user:', username);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    console.log('Generating JWT token');
    const token = sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    console.log('JWT token generated successfully');

    // Create the response
    const response = NextResponse.json(
      { success: true, message: 'Login successful' },
      { status: 200 }
    );

    // Set the cookie with appropriate options
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 86400 // 1 day in seconds
    });

    console.log('Login successful for user:', username);
    return response;

  } catch (error) {
    const err = error as LoginError;
    console.error('Login error details:', {
      message: err.message,
      stack: err.stack,
      name: err.name,
      code: err.code
    });
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    );
  }
} 