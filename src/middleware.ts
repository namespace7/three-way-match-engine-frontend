import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Architectural Decision: Auth routing is handled at the edge middleware layer,
// before any React rendering occurs. This eliminates the root page's client-side
// redirect pattern, which produced an RSC Flight payload that confused uptime
// monitors (cron-job.org "Output Too Large" failure).
//
// Public paths that do not require authentication.
const PUBLIC_PATHS = ['/login', '/health'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow all public paths and static assets to pass through unmodified.
  if (
    PUBLIC_PATHS.some((path) => pathname.startsWith(path)) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Read the auth token from cookies (set by authService.login on the client).
  const token = request.cookies.get('auth_token')?.value;

  // Unauthenticated requests to protected routes → redirect to /login.
  if (!token && pathname !== '/login') {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Root path with a valid token → redirect to /dashboard.
  if (token && pathname === '/') {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on all routes except API routes and static files.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
