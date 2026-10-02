import { NextResponse, type NextRequest } from "next/server";

const SESSION_FLAG_COOKIE = "chx_session";

export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has(SESSION_FLAG_COOKIE);
  const { pathname } = request.nextUrl;

  if (pathname === "/admin") {
    const target = hasSession ? "/admin/dashboard" : "/admin/login";
    return NextResponse.redirect(new URL(target, request.url));
  }

  if (!hasSession) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/dashboard/:path*", "/admin/trip-preview/:path*"],
};
