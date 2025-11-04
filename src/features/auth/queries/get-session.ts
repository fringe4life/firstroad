"use server";
import { cacheTag } from "next/cache";
import { headers } from "next/headers";
import type { ServerSession } from "@/features/auth/types";
import { auth } from "@/lib/auth";

export const getSession = async (): Promise<ServerSession | null> => {
  "use cache: private";
  cacheTag("session");

  return await auth.api.getSession({
    headers: await headers(),
  });
};
