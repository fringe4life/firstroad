import type { Route } from "next";
import { headers } from "next/headers";
import { redirect, unauthorized } from "next/navigation";
import { Suspense } from "react";
import { getUser } from "@/features/auth/queries/get-user";
import type { User } from "@/features/auth/types";
import { signInPath } from "@/path";

// RequireAuth component that ensures user is authenticated and optionally authorized
const RequireAuth = async ({
  children,
  redirectPath,
  authorize,
}: {
  children: (user: User) => React.ReactNode;
  redirectPath?: string;
  authorize?: (user: User) => boolean;
}) => {
  const { user, hasUser } = await getUser();

  if (!(hasUser && user)) {
    // Not authenticated - redirect to sign-in
    const headersList = await headers();
    const pathname =
      redirectPath ||
      headersList.get("x-pathname") ||
      headersList.get("x-invoke-path") ||
      headersList.get("referer");

    const redirectUrl = pathname
      ? (`${signInPath}?callbackUrl=${encodeURIComponent(pathname)}` as Route)
      : signInPath;

    redirect(redirectUrl);
  }

  // Check authorization if provided
  if (authorize && !authorize(user)) {
    unauthorized();
  }

  return <>{children(user)}</>;
};

// Suspense wrapper that requires authentication and optionally authorization
export const RequireAuthSuspense = ({
  children,
  fallback,
  redirectPath,
  authorize,
}: {
  children: (user: User) => React.ReactNode;
  fallback: React.ReactNode;
  redirectPath?: string;
  authorize: (user: User) => boolean;
}) => (
  <Suspense fallback={fallback}>
    <RequireAuth authorize={authorize} redirectPath={redirectPath}>
      {children}
    </RequireAuth>
  </Suspense>
);
