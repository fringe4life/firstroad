import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { signInPath, ticketsPath } from "@/path";

const authRoutes = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

const protectedRoutes = ["/tickets", "/account"];

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  const { pathname } = request.nextUrl;

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Redirect authenticated users away from auth pages
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL(ticketsPath, request.url));
  }

  // Redirect unauthenticated users away from protected pages
  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL(signInPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/tickets/:path*",
    "/account/:path*",
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/reset-password/:path*",
    "/verify-email",
  ],
};
