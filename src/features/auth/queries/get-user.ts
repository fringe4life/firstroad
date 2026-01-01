"use server";
import { cacheTag } from "next/cache";
import { headers } from "next/headers";
import type { UserProp } from "@/features/auth/types";
import { auth } from "@/lib/auth";
import { tryCatch } from "@/utils/try-catch";

const getUser = async (): Promise<UserProp> => {
  "use cache: private";
  cacheTag("session");

  const { data: session } = await tryCatch(
    async () =>
      await auth.api.getSession({
        headers: await headers(),
      }),
  );

  const hasUser = Boolean(session?.user?.id);

  return {
    user: session?.user,
    hasUser,
  };
};

export { getUser };
