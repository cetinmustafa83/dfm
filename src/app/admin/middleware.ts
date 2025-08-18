import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // For demo purposes, we're checking localStorage
  // In a real implementation, you'd check the auth token properly
  const isAdmin = typeof window !== 'undefined' && localStorage.getItem("admin-token");
  
  // If admin token doesn't exist and we're trying to access admin pages
  if (!isAdmin && request.nextUrl.pathname.startsWith('/admin')) {
    // Redirect to login page
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*'],
};