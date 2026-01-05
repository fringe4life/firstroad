import type { Route } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getUser } from "@/features/auth/queries/get-user";
import type { User } from "@/features/auth/types";
import { signInPath } from "@/path";

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

    const redirectUrl = pathname
      ? (`${signInPath()}?callbackUrl=${encodeURIComponent(pathname)}` as Route)
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
