import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // If the path ends with a trailing slash (except for the root path)
  if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
    // Remove the trailing slash
    url.pathname = url.pathname.slice(0, -1);
    
    // Redirect to the path without trailing slash
    return NextResponse.redirect(url);
  }

  // Only handle CORS for /api routes
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  const response = NextResponse.next();

  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}

// Configure which paths should run the middleware
export const config = {
  matcher: [
    // Apply to all API routes
    '/api/:path*',
    // Apply to all paths (for trailing slash handling)
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 