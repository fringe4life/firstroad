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
    const { activeOrganizationId } = authSession.session;
    return {
      hasUser: true,
      user: {
        ...authSession.user,
        activeOrganizationId,
      },
    };
  }
  return DEFAULT_NO_USER;
});

export { getUser };
