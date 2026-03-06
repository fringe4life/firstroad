import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "@firstroad/db";
import type { MemberRole } from "@firstroad/db/client-types";
import {
  addMemberPermissions,
  removeMemberPermissions,
} from "@firstroad/db/member-permissions";
import { createAuthMiddleware } from "better-auth/api";
import { betterAuth } from "better-auth/minimal";
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
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  basePath: "/api/auth",
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  experimental: { joins: true },
  session: {
    additionalFields: {
      activeOrganizationId: {
        type: "string",
        defaultValue: null,
        returned: true,
      },
    },
    cookieCache: {
      enabled: true,
      maxAge: SESSION_CACHE_DURATION_SECONDS,
    },
    expiresIn: SESSION_EXPIRES_IN_SECONDS,
    updateAge: SESSION_UPDATE_AGE_SECONDS,
  },

  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const member = await prisma.member.findFirst({
            where: { userId: session.userId },
            orderBy: { createdAt: "asc" },
            select: { organizationId: true },
          });
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

  plugins: [
    openAPI(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "change-email") {
          return;
        }
        // Trigger Inngest event to handle OTP email asynchronously
        await tryCatch(() =>
          inngest.send({
            name: "email.otp",
            data: {
              email,
              otp,
              type,
              userName: undefined, // Will be populated by the event handler if needed
            },
          }),
        );
      },
      otpLength: 6,
      expiresIn: 300, // 5 minutes
      allowedAttempts: 5,
      overrideDefaultEmailVerification: true, // Use OTP instead of verification links
    }),
    organization({
      async sendInvitationEmail(data) {
        const baseUrl =
          // biome-ignore lint/style/noNonNullAssertion: will exist
          process.env.NEXT_PUBLIC_APP_URL!;
        const inviteUrl = `${baseUrl}${acceptInvitationPath(data.id)}`;

        // Trigger Inngest event to handle invitation email asynchronously
        await tryCatch(() =>
          inngest.send({
            name: "organization.invitation",
            data: {
              email: data.email,
              organizationName: data.organization.name,
              inviterName: data.inviter.user.name ?? "A team member",
              role: (data.role as Exclude<MemberRole, "owner">) ?? "member",
              inviteUrl,
            },
          }),
        );
      },
      organizationHooks: {
        afterAcceptInvitation: async ({ member }) => {
          await addMemberPermissions(prisma, member.id, ["TICKET", "COMMENT"]);
        },
        afterAddMember: async ({ member }) => {
          await addMemberPermissions(prisma, member.id, ["TICKET", "COMMENT"]);
        },
        afterCreateOrganization: async ({ member }) => {
          await addMemberPermissions(prisma, member.id, ["TICKET", "COMMENT"]);
        },
        beforeRemoveMember: async ({ member, organization }) => {
          // Prevent removing the last member from an organization
          const memberCount = await prisma.member.count({
            where: {
              organizationId: organization.id,
            },
          });

          if (memberCount <= 1) {
            throw new Error(
              "Cannot remove the last member from an organization",
            );
          }

          // Prevent removing the last owner/admin
          // Type assertion needed because Better Auth hooks type role as string
          if (isAdminOrOwner(member)) {
            const adminOwnerCount = await prisma.member.count({
              where: {
                organizationId: organization.id,
                role: {
                  in: ["owner", "admin"],
                },
              },
            });

            if (adminOwnerCount <= 1) {
              throw new Error(
                "Cannot remove the last owner or admin from an organization",
              );
            }
          }

          await removeMemberPermissions(prisma, member.id, [
            "TICKET",
            "COMMENT",
          ]);
        },
        afterRemoveMember: async ({ member, organization }) => {
          await prisma.session.updateMany({
            where: {
              userId: member.userId,
              activeOrganizationId: organization.id,
            },
            data: { activeOrganizationId: null },
          });
        },
        afterDeleteOrganization: async (data: {
          organization: { id: string };
        }) => {
          await prisma.session.updateMany({
            where: { activeOrganizationId: data.organization.id },
            data: { activeOrganizationId: null },
          });
        },
      },
    }),
    nextCookies(), // nextCookies should be the last plugin
  ],

  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      // Check if this is a sign-up request and a new session was created
      if (ctx.path.startsWith("/sign-up") && ctx.context.newSession) {
        const newSession = ctx.context.newSession;
        const user = newSession.user;

        // Trigger Inngest event to handle welcome email with 2-minute delay
        await tryCatch(() =>
          inngest.send({
            name: "user.welcome",
            data: {
              email: user.email,
              userName: user.name ?? "User",
            },
          }),
        );
      }
    }),
  },

  rateLimit: {
    enabled: process.env.NODE_ENV === "production",
    window: 60, // 1 minute
    max: 100, // 100 requests per minute (global)
    customRules: {
      // Stricter limits for password reset
      "/request-password-reset": {
        window: 60, // 1 minute
        max: 3, // 3 password reset requests per minute
      },
      "/reset-password": {
        window: 300, // 5 minutes
        max: 5, // 5 reset attempts per 5 minutes
      },
      // Stricter limits for sign-in attempts
      "/sign-in/email": {
        window: 60, // 1 minute
        max: 5, // 5 sign-in attempts per minute
      },
    },
  },

  emailAndPassword: {
    enabled: true,
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
          name: "password.reset",
          data: {
            email: user.email,
            resetUrl,
            userName: user.name ?? "User",
          },
        }),
      );
    },
    onPasswordReset: async ({ user }) => {
      // Trigger Inngest event to handle password changed email asynchronously
      await tryCatch(() =>
        inngest.send({
          name: "password.changed",
          data: {
            email: user.email,
            userName: user.name ?? "User",
          },
        }),
      );
    },
    resetPasswordTokenExpiresIn: 3600, // 1 hour
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      // Trigger Inngest event to handle email verification asynchronously
      await tryCatch(() =>
        inngest.send({
          name: "email.verification",
          data: {
            email: user.email,
            verificationUrl: url,
            userName: user.name ?? "User",
          },
        }),
      );
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600, // 1 hour
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
