import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("🔐 Middleware running for path:", pathname);

  // Only run this middleware for admin routes
  if (pathname.startsWith("/admin")) {
    // Don't check token for login route and its subroutes
    if (pathname.startsWith("/admin/login")) {
      console.log("🔐 Allowing access to login routes");
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

    console.log(
      "🔐 Token checks - Cookie:",
      !!cookieToken,
      "Header:",
      !!headerToken
    );

    if (!cookieToken && !headerToken) {
      console.log("🔐 No token found, redirecting to login");

      // Create the URL for the login page
      const loginUrl = new URL("/admin/login", request.url);

      // Redirect to login page
      return NextResponse.redirect(loginUrl);
    }

    console.log("🔐 Token found, allowing access to admin route");
  }

  return NextResponse.next();
}

// Define which routes this middleware should run on
export const config = {
  // Only apply to admin routes
  matcher: ["/admin", "/admin/:path*"],
};
