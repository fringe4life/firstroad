import type { Route } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getUser } from "@/features/auth/queries/get-user";
import type { User } from "@/features/auth/types";
import { forgotPasswordPath, signInPath, signUpPath } from "@/path";

const isAuthRoute = (path: string): boolean =>
  path === signInPath() ||
  path === signUpPath() ||
  path === forgotPasswordPath();

/** Normalize to pathname only (strip origin and query) so we can check isAuthRoute. */
const toPathname = (value: string): string => {
  const trimmed = value.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      return new URL(trimmed).pathname;
    } catch {
      return trimmed;
    }
  }
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
};

// RequireAuth component that ensures user is authenticated and optionally authorized
const RequireAuth = async ({
  children,
  redirectPath,
}: {
  children: (user: User) => React.ReactNode;
  redirectPath?: string;
}) => {
  const { user, hasUser } = await getUser();

  if (!hasUser) {
    // Not authenticated - redirect to sign-in
    const headersList = await headers();
    const pathname =
      redirectPath ||
      headersList.get("x-pathname") ||
      headersList.get("x-invoke-path") ||
      headersList.get("referer");

    const pathOnly = pathname ? toPathname(pathname) : "";
    const useAsCallback =
      pathOnly !== "" && pathOnly !== "/" && !isAuthRoute(pathOnly);

    const redirectUrl = useAsCallback
      ? (`${signInPath()}?callbackUrl=${encodeURIComponent(pathOnly)}` as Route)
      : signInPath();

    redirect(redirectUrl);
  }

  return <>{children(user)}</>;
};

// Suspense wrapper that requires authentication and optionally authorization
const RequireAuthSuspense = ({
  children,
  fallback,
  redirectPath,
}: {
  children: (user: User) => React.ReactNode;
  fallback: React.ReactNode;
  redirectPath?: string;
}) => (
  <Suspense fallback={fallback}>
    <RequireAuth redirectPath={redirectPath}>{children}</RequireAuth>
  </Suspense>
);
export { RequireAuthSuspense };
