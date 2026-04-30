import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("authToken")?.value;

  const pathname = request.nextUrl.pathname;
  const isAuthRoute = pathname.startsWith("/auth");
  const isPublicRoute =
    pathname === "/" ||
    pathname.startsWith("/website") ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/faq") ||
    pathname.startsWith("/inquiry") ||
    pathname === "/manifest.json" ||
    pathname === "/firebase-messaging-sw.js";
  const isProtectedButNotAuthRoute = !isAuthRoute && !isPublicRoute;

  if (authToken && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (!authToken && isProtectedButNotAuthRoute) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const locale = request.cookies.get("NEXT_LOCALE")?.value || "en";
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|api|manifest\\.json|firebase-messaging-sw\\.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
