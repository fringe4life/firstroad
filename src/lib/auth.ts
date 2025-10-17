import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/utils/send-email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  plugins: [nextCookies()], // nextCookies should be the last plugin

  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      // Check if this is a sign-up request and a new session was created
      if (ctx.path.startsWith("/sign-up") && ctx.context.newSession) {
        const newSession = ctx.context.newSession;
        const user = newSession.user;

        try {
          await sendEmail({
            to: user.email,
            subject: "Welcome to TicketBounty! 🎉",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #333; text-align: center;">Welcome to TicketBounty! 🎉</h2>
                <p>Hello ${user.name || "there"},</p>
                <p>Thank you for joining TicketBounty! We're excited to have you on board.</p>
                <p>Your account has been successfully created and you can now:</p>
                <ul style="color: #555;">
                  <li>Create and manage support tickets</li>
                  <li>Track ticket status and updates</li>
                  <li>Collaborate with your team</li>
                  <li>Access all our features</li>
                </ul>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/tickets" 
                     style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                    Get Started
                  </a>
                </div>
                <p>If you have any questions or need help getting started, don't hesitate to reach out to our support team.</p>
                <p>Best regards,<br>The TicketBounty Team</p>
              </div>
            `,
            text: `
              Welcome to TicketBounty! 🎉
              
              Hello ${user.name || "there"},
              
              Thank you for joining TicketBounty! We're excited to have you on board.
              
              Your account has been successfully created and you can now:
              - Create and manage support tickets
              - Track ticket status and updates
              - Collaborate with your team
              - Access all our features
              
              Get started: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/tickets
              
              If you have any questions or need help getting started, don't hesitate to reach out to our support team.
              
              Best regards,
              The TicketBounty Team
            `,
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
