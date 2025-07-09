import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function middleware(request: NextRequest) {
  // Get the hostname from the request
  const hostname = request.headers.get('host') || '';

  // Check if it's using www
  if (hostname.startsWith('www.')) {
    // Create the new URL without www
    const newUrl = new URL(request.url);
    newUrl.hostname = hostname.replace('www.', '');
    
    // Return a 301 permanent redirect
    return NextResponse.redirect(newUrl, 301);
  }

  // For non-www requests, continue as normal
  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/ (API routes)
     * 2. /_next/ (Next.js internals)
     * 3. /static/ (public static files)
     * 4. /favicon.ico, /robots.txt (static files)
     */
    '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
  ],
}; 