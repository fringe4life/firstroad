"use server";

import { headers } from "next/headers";
import type { ServerSession } from "@/features/auth/types";
import { auth } from "@/lib/auth";

export const getSession = async (): Promise<ServerSession | null> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session as ServerSession | null;
};
