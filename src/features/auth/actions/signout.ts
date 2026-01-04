"use server";

import { headers } from "next/headers";
import { RedirectType, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { homePath } from "@/path";
import { invalidateSession } from "@/utils/invalidate-cache";
import { fromErrorToActionState } from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

const signOut = async () => {
  const { error } = await tryCatch(async () => {
    await auth.api.signOut({
      headers: await headers(),
    });
  });

  if (error) {
    return fromErrorToActionState(error);
  }

  invalidateSession();
  throw redirect(homePath(), RedirectType.replace);
};

export { signOut };
