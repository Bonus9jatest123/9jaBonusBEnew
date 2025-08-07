// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value; // ✅ correct way
  const pathname = request.nextUrl.pathname;

  // ✅ Protect all /admin routes except login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // ✅ If logged in and tries to access /admin/login
  if (pathname === '/admin/login' && token) {
    return NextResponse.redirect(new URL('/admin/offers', request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ['/admin/:path*'], // protects all /admin/* routes
};