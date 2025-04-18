import { NextResponse } from "next/server";

export function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/" || path === "/auth/login" || path === "/auth/register" || path === "/auth/forgot-password"

  // PLACEHOLDER: Check for authentication token
  // This is where you would check for your auth token/cookie
  // const token = request.cookies.get("your-auth-token")?.value

  // For demonstration, we'll use a simulated token check
  // Replace this with your actual auth check logic
  const isAuthenticated = false // PLACEHOLDER: Set to true when testing protected routes

  // Redirect logic
  if (isPublicPath && isAuthenticated) {
    // If user is authenticated and tries to access public path, redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isPublicPath && !isAuthenticated) {
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
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts, /images (static files)
     * 4. /favicon.ico, /sitemap.xml (static files)
     */
    "/((?!api|_next|fonts|images|favicon.ico|sitemap.xml).*)",
  ],
}
