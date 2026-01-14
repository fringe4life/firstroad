import { Suspense, ViewTransition } from "react";
import { getUser } from "@/features/auth/queries/get-user";
import type { User } from "@/features/auth/types";
import type { Maybe } from "@/types";

// HasAuth component that provides session to children
const HasAuth = async ({
  children,
}: {
  children: (user: Maybe<User>) => React.ReactNode;
}) => {
  const { user } = await getUser();
  return <>{children(user)}</>;
};

// Suspense wrapper for dynamic auth-dependent content
const HasAuthSuspense = ({
  children,
  fallback,
}: {
  children: (user: Maybe<User>) => React.ReactNode;
  fallback: React.ReactNode;
}) => (
  <Suspense fallback={fallback}>
    <ViewTransition>
      <HasAuth>{children}</HasAuth>
    </ViewTransition>
  </Suspense>
);
export { HasAuthSuspense };
