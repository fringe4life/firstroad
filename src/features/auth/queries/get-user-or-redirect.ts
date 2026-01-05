import type { Route } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/features/auth/queries/get-user";
import type { User } from "@/features/auth/types";
import { signInPath } from "@/path";
import type { Maybe } from "@/types";

// Discriminated union for explicit behavior control
// - when: "no-session" (default) → redirect to sign-in when session is missing
// - when: "has-session" → redirect to provided path when session exists
export type GetUserRedirectOptions =
  | {
      when?: "no-session";
    }
  | {
      when: "has-session";
      redirectPath: Route;
    };

// Overloads
export function getUserOrRedirect(
  options?: Extract<GetUserRedirectOptions, { when?: "no-session" }>,
): Promise<User>;
export function getUserOrRedirect(
  options: Extract<GetUserRedirectOptions, { when: "has-session" }>,
): Promise<Maybe<User>>;

export async function getUserOrRedirect(
  options?: GetUserRedirectOptions,
): Promise<Maybe<User>> {
  const { user, hasUser } = await getUser();

  // has-session branch (narrowed: redirectPath is required)
  if (options?.when === "has-session") {
    if (hasUser) {
      throw redirect(options.redirectPath);
    }
    return user;
  }

  // default: no-session branch
  if (!hasUser) {
    throw redirect(signInPath());
  }
  return user;
}
