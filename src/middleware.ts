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
  const protocol = request.headers.get('x-forwarded-proto') || 'https';
  const pathname = request.nextUrl.pathname;
  const search = request.nextUrl.search || '';

  // Handle www to non-www redirect
  if (hostname?.startsWith('www.')) {
    const newHostname = hostname.replace('www.', '');
    return NextResponse.redirect(
      `${protocol}://${newHostname}${pathname}${search}`,
      301
    );
  }

  // Handle root path redirect
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Handle all other paths
  try {
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

// Specify paths to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|images/|fonts/).*)',
  ],
}; 