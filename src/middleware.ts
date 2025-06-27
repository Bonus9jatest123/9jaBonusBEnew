// import { jwtDecode } from "jwt-decode";
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const loginPath = '/admin/login';
  const loginUrl = new URL(loginPath, request.url);
  const token = cookies()?.get('token')?.value;
  if (!token) {
    // If no token, redirect to login if not already there
    if (request.nextUrl.pathname !== loginPath) {
      return NextResponse.redirect(loginUrl);
    }
    // If already on login page, proceed with the request
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/offers', '/admin/odds', '/admin/footer']
};




