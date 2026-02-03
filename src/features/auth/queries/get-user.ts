"use server";
import { headers } from "next/headers";
import { cache } from "react";
import type { UserProp } from "@/features/auth/types";
import { auth } from "@/lib/auth";
import { tryCatch } from "@/utils/try-catch";
import { DEFAULT_NO_USER } from "../constants";

const getUser = cache(async (): Promise<UserProp> => {
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
      return DEFAULT_NO_USER;
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
  return DEFAULT_NO_USER;
});

export { getUser };
