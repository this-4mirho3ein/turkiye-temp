import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect root path to admin
  if (pathname === "/") {
    const adminUrl = new URL("/admin", request.url);
    return NextResponse.redirect(adminUrl);
  }

  // Only run authentication middleware for admin routes
  if (pathname.startsWith("/admin")) {
    // Don't check token for login route and its subroutes
    if (pathname.startsWith("/admin/login")) {
      return NextResponse.next();
    }

    // Check for the token in cookies (where it would be stored after login)
    const cookieToken = request.cookies.get("accessToken")?.value;

    // Check from various header formats
    const headerToken =
      request.headers.get("x-access-token") ||
      request.headers.get("accesstoken") ||
      request.headers.get("access-token") ||
      request.headers.get("authorization")?.replace("Bearer ", "");


    if (!cookieToken && !headerToken) {

      // Create the URL for the login page
      const loginUrl = new URL("/admin/login", request.url);

      // Redirect to login page
      return NextResponse.redirect(loginUrl);
    }

  }

  return NextResponse.next();
}

// Define which routes this middleware should run on
export const config = {
  // Apply to root and admin routes
  matcher: ["/", "/admin", "/admin/:path*"],
};
