// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;

  // Define public routes (no auth required)
  const isPublicRoute =
    pathname === '/admin/login' ||
    pathname === '/admin/signup' ||
    pathname === '/admin/verify-email' ||
    pathname.startsWith('/admin/reset-password');

  // Redirect unauthenticated users accessing protected admin routes
  if (pathname.startsWith('/admin') && !isPublicRoute && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Redirect authenticated users away from login page
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/admin/offers', request.url));
  }

  // Add cache-control headers to all admin routes
  const response = NextResponse.next();
  if (pathname.startsWith('/admin')) {
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
  }

  return response;
}

// Apply middleware to all /admin routes
export const config = {
  matcher: ['/admin/:path*'],
};
