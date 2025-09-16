import type { Route } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/features/auth/queries/get-session";
import type { ServerSession } from "@/features/auth/types";
import { signInPath } from "@/path";

// Discriminated union for explicit behavior control
// - when: "no-session" (default) → redirect to sign-in when session is missing
// - when: "has-session" → redirect to provided path when session exists
export type GetSessionRedirectOptions =
  | {
      when?: "no-session";
    }
  | {
      when: "has-session";
      redirectPath: Route;
    };

// Overloads
export function getSessionOrRedirect(
  options?: Extract<GetSessionRedirectOptions, { when?: "no-session" }>,
): Promise<ServerSession>;
export function getSessionOrRedirect(
  options: Extract<GetSessionRedirectOptions, { when: "has-session" }>,
): Promise<ServerSession | null>;

export async function getSessionOrRedirect(
  options?: GetSessionRedirectOptions,
): Promise<ServerSession | null> {
  const session = await getSession();

  // has-session branch (narrowed: redirectPath is required)
  if (options?.when === "has-session") {
    if (session) {
      throw redirect(options.redirectPath);
    }
    return session;
  }

  // default: no-session branch
  if (!session) {
    throw redirect(signInPath);
  }
  return session as ServerSession;
}
