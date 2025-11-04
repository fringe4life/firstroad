"use server";

import { updateTag } from "next/cache";
import { headers } from "next/headers";
import { RedirectType, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { homePath } from "@/path";
import { fromErrorToActionState } from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

export const signOut = async () => {
  const { error } = await tryCatch(async () => {
    await auth.api.signOut({
      headers: await headers(),
    });
  });

  if (error) {
    return fromErrorToActionState(error);
  }

  updateTag("session");
  // revalidatePath("/");
  throw redirect(homePath, RedirectType.replace);
};
