"use server";
import { cacheTag } from "next/cache";
import { headers } from "next/headers";
import type { MaybeServerSession } from "@/features/auth/types";
import { auth } from "@/lib/auth";
import { tryCatch } from "@/utils/try-catch";
export const getSession = async (): Promise<MaybeServerSession> => {
  "use cache: private";
  cacheTag("session");

  const { data } = await tryCatch(
    async () =>
      await auth.api.getSession({
        headers: await headers(),
      }),
  );

  return data;
};
