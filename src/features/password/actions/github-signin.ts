"use server";
import type { Route } from "next";
import { RedirectType, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ticketsPath } from "@/path";
import { invalidateSession } from "@/utils/invalidate-cache";
import { fromErrorToActionState } from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

const githubSignin = async () => {
  const { data, error } = await tryCatch(() =>
    auth.api.signInSocial({
      body: {
        provider: "github",
        callbackURL: ticketsPath(),
      },
    }),
  );

  if (error) {
    return fromErrorToActionState(error);
  }
  invalidateSession();
  throw redirect(data?.url as Route, RedirectType.replace);
};

export { githubSignin };
