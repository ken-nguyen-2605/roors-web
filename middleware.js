// middleware.js
// Place this file in the root of your Next.js project

import { NextResponse } from 'next/server';

// Add routes that require authentication
const protectedRoutes = [
  '/profile',
  '/orders',
  '/reservations',
  '/dashboard',
];

// Add routes that should redirect to home if already authenticated
const authRoutes = ['/signin', '/signup'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Get token from cookies or check if user is authenticated
  const token = request.cookies.get('authToken')?.value;
  const isAuthenticated = !!token;

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Check if the current route is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Redirect to signin if trying to access protected route without auth
  if (isProtectedRoute && !isAuthenticated) {
    const signInUrl = new URL('/signin', request.url);
    signInUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect to home if trying to access auth routes while authenticated
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/api', request.url));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|image).*)',
  ],
};