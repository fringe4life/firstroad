/**
 * Better Auth CLI config — schema generation ONLY.
 *
 * Used by: `bun run auth:schema` (apps/web)
 * Output: packages/database/tmp/better-auth.generated.prisma
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * KEEP IN SYNC WITH `./auth.ts`
 *
 * Any change to `auth.ts` that can affect the database schema MUST be mirrored
 * here (or explicitly confirmed as schema-neutral). Miss this and
 * `auth generate` drifts from production auth.
 *
 * Schema-affecting (update this file):
 * - plugins (add/remove/options that add tables or columns)
 * - session.additionalFields / user.additionalFields
 * - database adapter / provider
 * - modelName / fields / schema renames
 * - advanced.database.joins (relation output; was experimental.joins pre-1.7)
 *
 * Schema-neutral (leave in auth.ts only):
 * - hooks, emails, Inngest, rate limits, cookie/session lifetimes
 * - socialProviders secrets / redirect URIs
 * - send* callbacks, organizationHooks side effects
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { pool, uuidv7 } from "@firstroad/db";
import { betterAuth } from "better-auth";
import { emailOTP, organization } from "better-auth/plugins";

export const auth = betterAuth({
  advanced: {
    database: {
      generateId: () => uuidv7(),
      joins: true,
    },
  },
  basePath: "/api/auth",
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  database: pool,
  plugins: [
    // Keep plugin list aligned with auth.ts for table/column discovery.
    emailOTP({
      async sendVerificationOTP() {
        // CLI stub — no-op
      },
    }),
    organization({
      async sendInvitationEmail() {
        // CLI stub — no-op
      },
    }),
  ],
  session: {
    additionalFields: {
      activeOrganizationId: {
        defaultValue: null,
        returned: true,
        type: "string",
      },
    },
  },
});
