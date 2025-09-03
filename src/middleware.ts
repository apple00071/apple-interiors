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

  // Handle root path
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Handle known routes
  const knownRoutes = [
    '/about',
    '/contact',
    '/portfolio',
    '/services',
    '/launch',
    '/2bhk-interior-design-hyderabad',
    '/3bhk-interior-design-hyderabad',
    '/modular-kitchen-design-hyderabad',
    '/false-ceiling-contractors-hyderabad',
    '/wardrobe-designers-hyderabad',
    '/office-interior-designers-hyderabad',
    '/villa-interior-design-hyderabad',
    '/budget-interior-designers-hyderabad',
    '/interior-designers-hitec-city',
    '/interior-designers-kukatpally',
    '/interior-designers-madhapur',
    '/admin/dashboard',
    '/admin/login',
    '/admin/portfolio',
    '/_not-found',
    '/404'
  ];

  if (knownRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Handle dynamic routes and API routes
  if (
    pathname.startsWith('/api/') ||
    pathname.match(/^\/admin\/portfolio\/.*/) ||
    pathname.match(/^\/api\/admin\/.*/)
  ) {
    return NextResponse.next();
  }

  // Handle all other paths
  try {
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/_not-found', request.url));
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