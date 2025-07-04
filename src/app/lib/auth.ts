import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { env } from '../config/env';

export async function authenticateAdmin(username: string, password: string) {
  if (username === env.ADMIN_USERNAME && password === env.ADMIN_PASSWORD) {
    // In a production environment, use a proper JWT library
    const token = Buffer.from(JSON.stringify({ 
      username, 
      role: 'admin',
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    })).toString('base64');
    
    return { success: true, token };
  }

  return { success: false, message: 'Invalid credentials' };
}

export async function verifyAdminToken(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;

  if (!token) {
    return false;
  }

  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    
    if (decoded.exp < Date.now()) {
      return false;
    }

    return decoded.role === 'admin';
  } catch {
    return false;
  }
}

export function getAdminTokenFromCookies() {
  const cookieStore = cookies();
  return cookieStore.get('admin_token')?.value;
}

export function isAuthenticated() {
  const token = getAdminTokenFromCookies();
  
  if (!token) {
    return false;
  }

  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    return decoded.exp > Date.now() && decoded.role === 'admin';
  } catch {
    return false;
  }
} 