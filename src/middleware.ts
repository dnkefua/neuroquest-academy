import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/lesson', '/games', '/world-map', '/skill-tree', '/social-hub', '/parent', '/analytics'];

// Routes only for teachers/admins
const teacherRoutes = ['/admin', '/teacher-dashboard'];

// Routes only for authenticated users (not guests)
const authRequiredRoutes = ['/onboarding', '/select-grade'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get auth token from cookie
  const sessionCookie = request.cookies.get('session')?.value;
  const isAuthenticated = !!sessionCookie;
  const userRole = request.cookies.get('userRole')?.value;
  
  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isTeacherRoute = teacherRoutes.some(route => pathname.startsWith(route));
  
  // For demo mode - allow access but log for monitoring
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  
  // Redirect unauthenticated users to auth page
  if (isProtectedRoute && !isAuthenticated && !isDemoMode) {
    const loginUrl = new URL('/auth', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Redirect to dashboard if authenticated and trying to access auth pages
  if (pathname === '/auth' && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Check teacher/admin role for restricted routes
  if (isTeacherRoute && userRole !== 'teacher' && userRole !== 'admin' && !isDemoMode) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Add security headers to all responses
  const response = NextResponse.next();
  
  // Content Security Policy
  response.headers.set('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: blob: https://*.firebaseapp.com https://*.googleapis.com; " +
    "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://identitytoolkit.googleapis.com; " +
    "frame-src 'self' https://*.firebaseapp.com;"
  );
  
  // Additional security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // HSTS header for HTTPS
  if (request.url.startsWith('https://')) {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
};
