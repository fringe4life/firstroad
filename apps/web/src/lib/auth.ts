/**
 * Runtime Better Auth config.
 *
 * Schema changes: also update `./auth.cli.ts` (used by `bun run auth:schema`).
 * See the sync checklist at the top of that file.
 */
import { orm, pool, uuidv7 } from "@firstroad/db";
import type { MemberRole } from "@firstroad/db/client-types";
import {
  addMemberPermissions,
  removeMemberPermissions,
} from "@firstroad/db/member-permissions";
import { betterAuth } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { emailOTP, openAPI, organization } from "better-auth/plugins";
import { isAdminOrOwner } from "@/features/organisation/utils/admin";
import { inngest } from "@/lib/inngest";
import { acceptInvitationPath, resetPasswordPath } from "@/path";
import { tryCatch } from "@/utils/try-catch";
import { env } from "./env";

// Session configuration constants
const MINUTES_IN_SECONDS = 60;
const HOURS_IN_SECONDS = 60 * MINUTES_IN_SECONDS;
const DAYS_IN_SECONDS = 24 * HOURS_IN_SECONDS;
const DAYS_PER_WEEK = 7;
const SESSION_CACHE_MINUTES = 5;

const SESSION_CACHE_DURATION_SECONDS =
  SESSION_CACHE_MINUTES * MINUTES_IN_SECONDS; // 5 minutes
const SESSION_EXPIRES_IN_SECONDS = DAYS_PER_WEEK * DAYS_IN_SECONDS; // 7 days
const SESSION_UPDATE_AGE_SECONDS = DAYS_IN_SECONDS; // 1 day

export const auth = betterAuth({
  advanced: {
    database: {
      generateId: () => uuidv7(),
      joins: true,
    },
  },
  basePath: "/api/auth",
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  database: pool,

  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const member = await orm.Member.where({
            userId: session.userId,
          })
            .select("organizationId")
            .orderBy((row) => row.createdAt.asc())
            .first();
          return {
            data: {
              ...session,
              activeOrganizationId: member?.organizationId ?? null,
            },
          };
        },
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    onPasswordReset: async ({ user }) => {
      // Trigger Inngest event to handle password changed email asynchronously
      await tryCatch(() =>
        inngest.send({
          data: {
            email: user.email,
            userName: user.name ?? "User",
          },
          name: "password.changed",
        }),
      );
    },
    resetPasswordTokenExpiresIn: 3600, // 1 hour
    // Follows Better Auth's guidance: token is provided directly,
    sendResetPassword: async ({ user, token }) => {
      // Base app URL used to construct absolute reset links
      const baseUrl =
        // biome-ignore lint/style/noNonNullAssertion: will exist
        process.env.NEXT_PUBLIC_APP_URL!;
      // Always construct absolute URL for email
      const resetUrl = `${baseUrl}${resetPasswordPath(token)}`;

      // Trigger Inngest event to handle password reset email asynchronously
      await tryCatch(() =>
        inngest.send({
          data: {
            email: user.email,
            resetUrl,
            userName: user.name ?? "User",
          },
          name: "password.reset",
        }),
      );
    },
  },

  emailVerification: {
    autoSignInAfterVerification: true,
    expiresIn: 3600, // 1 hour
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      // Trigger Inngest event to handle email verification asynchronously
      await tryCatch(() =>
        inngest.send({
          data: {
            email: user.email,
            userName: user.name ?? "User",
            verificationUrl: url,
          },
          name: "email.verification",
        }),
      );
    },
  },

  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      // Check if this is a sign-up request and a new session was created
      if (ctx.path.startsWith("/sign-up") && ctx.context.newSession) {
        const { user } = ctx.context.newSession;

        // Trigger Inngest event to handle welcome email with 2-minute delay
        await tryCatch(() =>
          inngest.send({
            data: {
              email: user.email,
              userName: user.name ?? "User",
            },
            name: "user.welcome",
          }),
        );
      }
    }),
  },

  plugins: [
    openAPI(),
    emailOTP({
      allowedAttempts: 5,
      expiresIn: 300, // 5 minutes
      otpLength: 6,
      overrideDefaultEmailVerification: true, // Use OTP instead of verification links
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "change-email") {
          return;
        }
        // Trigger Inngest event to handle OTP email asynchronously
        await tryCatch(() =>
          inngest.send({
            data: {
              email,
              otp,
              type,
              userName: undefined, // Will be populated by the event handler if needed
            },
            name: "email.otp",
          }),
        );
      },
    }),
    organization({
      organizationHooks: {
        afterAcceptInvitation: async ({ member }) => {
          await addMemberPermissions(member.id, ["TICKET", "COMMENT"]);
        },
        afterAddMember: async ({ member }) => {
          await addMemberPermissions(member.id, ["TICKET", "COMMENT"]);
        },
        afterCreateOrganization: async ({ member }) => {
          await addMemberPermissions(member.id, ["TICKET", "COMMENT"]);
        },
        afterDeleteOrganization: async (data: {
          organization: { id: string };
        }) => {
          await orm.Session.where({
            activeOrganizationId: data.organization.id,
          }).update({ activeOrganizationId: null });
        },
        afterRemoveMember: async ({ member, organization: removedFromOrg }) => {
          await orm.Session.where({
            activeOrganizationId: removedFromOrg.id,
            userId: member.userId,
          }).update({ activeOrganizationId: null });
        },
        beforeRemoveMember: async ({ member, organization: memberOrg }) => {
          // Prevent removing the last member from an organization
          const { count: memberCount } = await orm.Member.where({
            organizationId: memberOrg.id,
          }).aggregate((aggregate) => ({ count: aggregate.count() }));

          if (memberCount <= 1) {
            throw new Error(
              "Cannot remove the last member from an organization",
            );
          }

          // Prevent removing the last owner/admin
          // Type assertion needed because Better Auth hooks type role as string
          if (isAdminOrOwner(member)) {
            const { count: adminOwnerCount } = await orm.Member.where({
              organizationId: memberOrg.id,
            })
              .where((row) => row.role.in(["owner", "admin"]))
              .aggregate((aggregate) => ({ count: aggregate.count() }));

            if (adminOwnerCount <= 1) {
              throw new Error(
                "Cannot remove the last owner or admin from an organization",
              );
            }
          }

          await removeMemberPermissions(member.id, ["TICKET", "COMMENT"]);
        },
      },
      async sendInvitationEmail(data) {
        const baseUrl =
          // biome-ignore lint/style/noNonNullAssertion: will exist
          process.env.NEXT_PUBLIC_APP_URL!;
        const inviteUrl = `${baseUrl}${acceptInvitationPath(data.id)}`;

        // Trigger Inngest event to handle invitation email asynchronously
        await tryCatch(() =>
          inngest.send({
            data: {
              email: data.email,
              inviterName: data.inviter.user.name ?? "A team member",
              inviteUrl,
              organizationName: data.organization.name,
              role: (data.role as Exclude<MemberRole, "owner">) ?? "member",
            },
            name: "organization.invitation",
          }),
        );
      },
    }),
    nextCookies(), // nextCookies should be the last plugin
  ],

  rateLimit: {
    customRules: {
      // Stricter limits for password reset
      "/request-password-reset": {
        max: 3, // 3 password reset requests per minute
        window: 60, // 1 minute
      },
      "/reset-password": {
        max: 5, // 5 reset attempts per 5 minutes
        window: 300, // 5 minutes
      },
      // Stricter limits for sign-in attempts
      "/sign-in/email": {
        max: 5, // 5 sign-in attempts per minute
        window: 60, // 1 minute
      },
    },
    enabled: process.env.NODE_ENV === "production",
    max: 100, // 100 requests per minute (global)
    window: 60, // 1 minute
  },
  session: {
    additionalFields: {
      activeOrganizationId: {
        defaultValue: null,
        returned: true,
        type: "string",
      },
    },
    cookieCache: {
      enabled: true,
      maxAge: SESSION_CACHE_DURATION_SECONDS,
    },
    expiresIn: SESSION_EXPIRES_IN_SECONDS,
    updateAge: SESSION_UPDATE_AGE_SECONDS,
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      // redirectURI: "http://localhost:3000/api/auth/callback/github",
      redirectURI: "https://www.first-ticket.fyi/api/auth/callback/github",
    },
  },
});
