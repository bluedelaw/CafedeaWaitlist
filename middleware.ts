import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token");

  // Define public routes that don't require authentication
  const publicRoutes = ["/login"];

  // If the request is for a public route, allow access
  if (
    publicRoutes.some((route) => req.nextUrl.pathname.startsWith(route)) ||
    req.nextUrl.pathname.startsWith("/_next/") || // Allow Next.js internal files
    req.nextUrl.pathname.startsWith("/api/auth") // Allow auth API calls
  ) {
    return NextResponse.next();
  }

  // If the user is not authenticated and trying to access a protected route, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to all routes
export const config = {
  matcher: ["/:path*"],
};
