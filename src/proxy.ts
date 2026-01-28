import { getCookieCache } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";
// const authRoutes = [
//   "/sign-in",
//   "/sign-up",
//   "/forgot-password",
//   "/reset-password",
//   "/verify-email",
// ];

// const protectedRoutes = ["/account", "/tickets", "/organisations"];

export const proxy = async (request: NextRequest) => {
  const sessionCookie = await getCookieCache(request);
  // THIS IS NOT SECURE!
  if (sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/signin", "/signup"], // Specify the routes the middleware applies to
};

// export const config = {
//   matcher: [
//     "/tickets/:path*",
//     "/account/:path*",
//     "/sign-in",
//     "/sign-up",
//     "/forgot-password",
//     "/reset-password/:path*",
//     "/verify-email",
//   ],
// };
