"use server";

import { cookies, headers } from "next/headers";
import { RedirectType, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { homePath } from "@/path";

export const signOut = async () => {
  // Sign out via Better Auth API
  await auth.api.signOut({
    headers: await headers(),
  });

  // Manually delete Better Auth cookies since signOut API doesn't remove them
  const cookieStore = await cookies();
  cookieStore.delete("session_token");
  cookieStore.delete("session_data");

  throw redirect(homePath, RedirectType.replace);
};
