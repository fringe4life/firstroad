"use server";
import { headers } from "next/headers";
import type { UserProp } from "@/features/auth/types";
import { auth } from "@/lib/auth";
import { tryCatch } from "@/utils/try-catch";

const getUser = async (): Promise<UserProp> => {
  const { data: authSession } = await tryCatch(
    async () =>
      await auth.api.getSession({
        headers: await headers(),
      }),
  );
  if (authSession?.user && authSession.session) {
    const expiresAt = new Date(authSession.session.expiresAt).getTime();
    const now = Date.now();

    // DEFENSIVE coding just to ensure session is not expired
    // If session is expired, return no user (Better Auth handles cleanup automatically)
    if (expiresAt < now) {
      // If session is expired, return no user (Better Auth handles cleanup automatically)
      return { user: null, hasUser: false };
    }
    // Extract activeOrganizationId from session.session and append to user
    const activeOrganizationId =
      authSession.session?.activeOrganizationId ?? null;
    return {
      user: {
        ...authSession.user,
        activeOrganizationId,
      },
      hasUser: true,
    };
  }
  return { user: null, hasUser: false };
};

export { getUser };
