import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware } from "better-auth/api";
import { betterAuth } from "better-auth/minimal";
import { nextCookies } from "better-auth/next-js";
import { emailOTP, organization } from "better-auth/plugins";
import { isAdminOrOwner } from "@/features/organisation/utils/admin";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
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
  basePath: "/auth",
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  experimental: { joins: true },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: SESSION_CACHE_DURATION_SECONDS,
    },
    expiresIn: SESSION_EXPIRES_IN_SECONDS,
    updateAge: SESSION_UPDATE_AGE_SECONDS,
  },

  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
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
      organizationHooks: {
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
          if (isAdminOrOwner(member as { role: string })) {
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
              userName: user.name ?? "",
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
    sendResetPassword: async ({ user, url }, _request) => {
      // Extract the token from the URL and construct a dynamic route URL
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

      // Parse URL with base URL to handle relative paths
      const urlObj = new URL(url, baseUrl);

      // Try to extract token from query params first, then from pathname
      let token = urlObj.searchParams.get("token");
      if (!token) {
        // Extract token from pathname like /reset-password/TOKEN
        const pathParts = urlObj.pathname.split("/");
        token = pathParts.at(-1) || null;
      }

      // Ensure we have a valid token
      if (!token) {
        throw new Error("Password reset token not found in URL");
      }

      // Always construct absolute URL for email
      const resetUrl = `${baseUrl}/reset-password/${token}`;

      // Trigger Inngest event to handle password reset email asynchronously
      await tryCatch(() =>
        inngest.send({
          name: "password.reset",
          data: {
            email: user.email,
            resetUrl,
            userName: user.name ?? "",
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
            userName: user.name ?? "",
          },
        }),
      );
    },
    resetPasswordTokenExpiresIn: 3600, // 1 hour
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }, _request) => {
      // Extract the token from the URL and construct a dynamic verification URL
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

      // Parse URL with base URL to handle relative paths
      const urlObj = new URL(url, baseUrl);

      // Try to extract token from query params first, then from pathname
      let token = urlObj.searchParams.get("token");
      if (!token) {
        // Extract token from pathname like /verify-email/TOKEN
        const pathParts = urlObj.pathname.split("/");
        token = pathParts.at(-1) || null;
      }

      // Ensure we have a valid token
      if (!token) {
        throw new Error("Email verification token not found in URL");
      }

      // Always construct absolute URL for email
      const verificationUrl = `${baseUrl}/verify-email?token=${token}`;

      // Trigger Inngest event to handle email verification asynchronously
      await tryCatch(() =>
        inngest.send({
          name: "email.verification",
          data: {
            email: user.email,
            verificationUrl,
            userName: user.name ?? "",
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
      redirectURI: "http://localhost:3000/api/auth/callback/github",
    },
  },
});
