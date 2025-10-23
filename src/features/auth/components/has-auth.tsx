import { cache, Suspense } from "react";
import { getSession } from "@/features/auth/queries/get-session";
import type { MaybeServerSession } from "@/features/auth/types";

// Cached session getter using React's cache function
const getCachedSession = cache(
  async (): Promise<MaybeServerSession> => await getSession(),
);

// HasAuth component that provides session to children
export const HasAuth = async ({
  children,
}: {
  children: (session: MaybeServerSession) => React.ReactNode;
}) => {
  const session = await getCachedSession();
  return <>{children(session)}</>;
};

// Suspense wrapper for dynamic auth-dependent content
export const HasAuthSuspense = ({
  children,
  fallback,
}: {
  children: (session: MaybeServerSession) => React.ReactNode;
  fallback: React.ReactNode;
}) => (
  <Suspense fallback={fallback}>
    <HasAuth>{children}</HasAuth>
  </Suspense>
);
