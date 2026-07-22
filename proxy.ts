import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const isProduction = process.env.NODE_ENV === "production";

  const token = isProduction
    ? request.cookies.get("__Secure-admin_hotela.session_token")
    : request.cookies.get("admin_hotela.session_token");

  const currentPathname = request.nextUrl.pathname;
  const isAuthPage =
    currentPathname === "/" ||
    currentPathname === "/forgot-password" ||
    currentPathname === "/reset-password";
  const isProtectedRoute = currentPathname.startsWith("/dashboard");

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/"],
};
