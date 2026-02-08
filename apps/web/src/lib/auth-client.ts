import { emailOTPClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// Best practice:
// - Use same-origin relative requests on the client so Set-Cookie headers apply correctly
// - Ensure credentials are always included so auth cookies are sent and updated
export const authClient = createAuthClient({
  // In the browser, omit baseURL to use relative paths (same-origin).
  // On the server (if ever used), fall back to NEXT_PUBLIC_APP_URL.
  baseURL:
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      : undefined,
  plugins: [emailOTPClient(), organizationClient()],
  fetchOptions: {
    credentials: "include",
  },
});
