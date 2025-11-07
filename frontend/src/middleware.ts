import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

/**
 * Clerk middleware for protecting routes
 * Using Clerk v5 API with clerkMiddleware
 */

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/signup(.*)',
  '/api/webhook/clerk',
]);

// Define admin routes that require authentication
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

// Define public admin routes (login/signup)
const isPublicAdminRoute = createRouteMatcher([
  '/admin/login(.*)',
  '/admin/signup(.*)',
]);

export default clerkMiddleware((auth, request) => {
  const url = new URL(request.url);
  const hostname = url.hostname;
  
  // Check if this is a subdomain (e.g., acme.localhost or acme.domain.com)
  const isSubdomain = hostname.split('.').length >= 2 && 
                      hostname !== 'localhost' && 
                      !hostname.startsWith('www.');
  
  // If accessing subdomain root path, allow it (for organization landing pages)
  if (isSubdomain && url.pathname === '/') {
    return; // Don't protect - allow public access
  }
  
  // Protect admin routes (except login/signup)
  if (isAdminRoute(request) && !isPublicAdminRoute(request)) {
    auth().protect();
  }
  
  // Protect all other routes except public ones
  if (!isPublicRoute(request) && !isAdminRoute(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
