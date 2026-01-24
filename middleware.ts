import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the response
  const response = NextResponse.next();

  // URL normalization - redirect uppercase to lowercase
  const url = request.nextUrl;
  const pathname = url.pathname;

  // Skip for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // Skip files with extensions
  ) {
    return response;
  }

  // Normalize URLs: redirect uppercase to lowercase
  if (pathname !== pathname.toLowerCase()) {
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url, 301);
  }

  // Normalize URLs: replace %20 (spaces) with hyphens
  if (pathname.includes('%20')) {
    url.pathname = pathname.replace(/%20/g, '-');
    return NextResponse.redirect(url, 301);
  }

  // Security Headers
  // X-Content-Type-Options: Prevents MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // X-Frame-Options: Prevents clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // X-XSS-Protection: XSS filter (legacy but still useful)
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Referrer-Policy: Controls referrer information
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions-Policy: Controls browser features
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self), interest-cohort=()'
  );

  // Content-Security-Policy: Carefully configured for Next.js + GTM + Google Maps + Supabase
  const cspDirectives = [
    // Default: only allow same origin
    "default-src 'self'",
    
    // Scripts: self, inline (needed for Next.js), GTM, Google Analytics, Google Maps, Google Ads
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://googleads.g.doubleclick.net https://maps.googleapis.com https://maps.gstatic.com",
    
    // Styles: self, inline (needed for styled components/Tailwind), Google Fonts
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    
    // Fonts: self, Google Fonts
    "font-src 'self' https://fonts.gstatic.com data:",
    
    // Images: self, data URIs, HTTPS sources, Supabase storage
    "img-src 'self' data: https: blob:",
    
    // Connect: self, Supabase, Google Analytics, Google Maps, Google Ads
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google.com https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://maps.googleapis.com https://www.googletagmanager.com",
    
    // Frames: Google Maps, GTM
    "frame-src 'self' https://www.google.com https://www.googletagmanager.com",
    
    // Form actions: self only
    "form-action 'self'",
    
    // Base URI: self only
    "base-uri 'self'",
    
    // Object sources: none (no plugins)
    "object-src 'none'",
  ];

  response.headers.set('Content-Security-Policy', cspDirectives.join('; '));

  return response;
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|logo|images|fleet|services|about|booking|contact|.*\\..*$).*)',
  ],
};
