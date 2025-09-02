"use server";

import { headers } from "next/headers";
import { connection } from "next/server";
import type { ServerSession } from "@/features/auth/types";
import { auth } from "@/lib/auth";

export const getSession = async (): Promise<ServerSession | null> => {
  await connection(); // Wait for actual request before using headers()

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session as ServerSession | null;
};
