"use server";
import { cacheTag } from "next/cache";
import { headers } from "next/headers";
import type { UserProp } from "@/features/auth/types";
import { auth } from "@/lib/auth";
import { sessionCache } from "@/utils/cache-tags";
import { tryCatch } from "@/utils/try-catch";

const getUser = async (): Promise<UserProp> => {
  "use cache: private";
  cacheTag(sessionCache());

  const { data: session } = await tryCatch(
    async () =>
      await auth.api.getSession({
        headers: await headers(),
      }),
  );

  if (session?.user) {
    return { user: session.user, hasUser: true };
  }
  return { user: null, hasUser: false };
};

export { getUser };
