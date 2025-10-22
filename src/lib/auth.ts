import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        // Trigger Inngest event to handle OTP email asynchronously
        await inngest.send({
          name: "email.otp",
          data: {
            email,
            otp,
            type,
            userName: undefined, // Will be populated by the event handler if needed
          },
        });
      },
      otpLength: 6,
      expiresIn: 300, // 5 minutes
      allowedAttempts: 5,
      overrideDefaultEmailVerification: true, // Use OTP instead of verification links
    }),
    nextCookies(), // nextCookies should be the last plugin
  ],

  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      // Check if this is a sign-up request and a new session was created
      if (ctx.path.startsWith("/sign-up") && ctx.context.newSession) {
        const newSession = ctx.context.newSession;
        const user = newSession.user;

        try {
          // Trigger Inngest event to handle welcome email with 2-minute delay
          await inngest.send({
            name: "user.welcome",
            data: {
              email: user.email,
              userName: user.name,
            },
          });
        } catch (_error) {
          // Don't throw the error to avoid breaking the sign-up flow
        }
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

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            await prisma.userInfo.create({
              data: { userId: user.id },
            });
          } catch {
            // Ignore if already exists or any race during parallel creations
          }
        },
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
      await inngest.send({
        name: "password.reset",
        data: {
          email: user.email,
          resetUrl,
          userName: user.name,
        },
      });
    },
    // onPasswordReset: async ({ user }, _request) => {},
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
      await inngest.send({
        name: "email.verification",
        data: {
          email: user.email,
          verificationUrl,
          userName: user.name,
        },
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600, // 1 hour
  },
});
