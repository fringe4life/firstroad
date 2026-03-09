/**
 * Edge-runtime-safe environment access.
 *
 * This module is intended for use in:
 * - Middleware / edge handlers (e.g. `apps/web/src/proxy.ts`)
 * - Other code that must run in the Next.js Edge runtime or middleware
 *
 * It deliberately:
 * - Avoids `server-only` and heavy validation libraries (e.g. Valibot)
 * - Reads only the minimal subset of environment variables needed at the edge
 *
 * Failure mode:
 * - If a required variable is missing, this module will throw as soon as it is
 *   first imported in that environment. This causes a fast, loud failure
 *   during the first request (or build-time rendering) rather than a silent
 *   misconfiguration.
 *
 * Usage:
 * - Import the specific constants you need from this file in edge / middleware
 *   code instead of importing from `env.ts`, which is server-only and may
 *   pull in unnecessary dependencies for the edge runtime.
 *
 *   Example:
 *     import { EDGE_SESSION_COOKIE_NAME } from "@/lib/env-edge";
 *
 *     // use EDGE_SESSION_COOKIE_NAME to read the session cookie in middleware
 */

/**
 * Name of the session cookie used for optimistic auth checks in middleware.
 *
 * Source:
 * - `process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME`
 *
 * Throws:
 * - If `NEXT_PUBLIC_SESSION_COOKIE_NAME` is not defined or empty, an error is
 *   thrown immediately when this module is imported. This is intentional: the
 *   application requires this value to be configured correctly in all
 *   environments where middleware runs.
 */
export const EDGE_SESSION_COOKIE_NAME = (() => {
  const name = process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME;
  if (!name || name.length === 0) {
    throw new Error(
      "Missing NEXT_PUBLIC_SESSION_COOKIE_NAME for edge runtime (required by middleware/proxy).",
    );
  }
  return name;
})();
