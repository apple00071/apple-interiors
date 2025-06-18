import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  
  // If the path ends with a trailing slash (except for the root path)
  if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
    // Remove the trailing slash
    url.pathname = url.pathname.slice(0, -1);
    
    // Redirect to the path without trailing slash
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

// Only run middleware on API routes
export const config = {
  matcher: '/api/:path*',
}; 