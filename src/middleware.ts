import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Allow access to auth pages and public routes
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/api/auth') ||
    pathname === '/' ||
    pathname.startsWith('/tracking') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const userRole = token.role as string;

  // Role-based access control
  const roleRoutes: Record<string, string[]> = {
    admin: ['/dashboard', '/admin', '/vehicles', '/orders'],
    operator: ['/dashboard', '/orders', '/vehicles'],
    client: ['/clients', '/orders', '/tracking'],
    driver: ['/driver', '/orders', '/tracking']
  };

  // Check if user has access to the requested route
  const allowedRoutes = roleRoutes[userRole] || [];
  const hasAccess = allowedRoutes.some(route => pathname.startsWith(route));

  if (!hasAccess) {
    // Redirect to appropriate dashboard based on role
    const redirectUrls: Record<string, string> = {
      admin: '/dashboard',
      operator: '/dashboard',
      client: '/clients',
      driver: '/driver/dashboard'
    };

    const redirectUrl = redirectUrls[userRole] || '/';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
