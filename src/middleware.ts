import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Skip middleware for static files and API routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|css|js)$/)
  ) {
    return NextResponse.next();
  }

  const hostname = request.headers.get('host');

  // Only redirect if hostname is www.appleinteriors.in
  if (hostname === 'www.appleinteriors.in') {
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const pathname = request.nextUrl.pathname;
    const search = request.nextUrl.search;
    
    return NextResponse.redirect(
      `${protocol}://appleinteriors.in${pathname}${search}`,
      301
    );
  }

  return NextResponse.next();
}

// Specify paths to run middleware on
export const config = {
  matcher: [
    // Skip all internal paths
    '/((?!_next/|api/|favicon.ico).*)',
  ],
}; 