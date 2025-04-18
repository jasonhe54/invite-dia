import { NextResponse } from "next/server";
import { isTokenExpired } from "./lib/auth"

export function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/" || path === "/auth/login" || path === "/auth/register" || path === "/auth/forgot-password"

  // Skip middleware for API routes that handle auth
  if (path.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Check for authentication token in cookies
  const token = request.cookies.get("auth_token")?.value

  // Check if token exists and is not expired
  const isAuthenticated = token && !isTokenExpired(token)

  // Redirect logic
  if (isPublicPath && isAuthenticated) {
    // If user is authenticated and tries to access public path, redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isPublicPath && !isAuthenticated && !path.startsWith("/api")) {
    // If user is not authenticated and tries to access protected path, redirect to login
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /_next (Next.js internals)
     * 2. /fonts, /images (static files)
     * 3. /favicon.ico, /sitemap.xml (static files)
     */
    "/((?!_next|fonts|images|favicon.ico|sitemap.xml).*)",
  ],
}
