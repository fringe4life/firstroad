import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware } from "better-auth/api";
import { sendEmail } from "@/utils/send-email";
import { prisma } from "@/lib/prisma";

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
                  <a href="${process.env.AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"}/tickets" 
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
              
              Get started: ${process.env.AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"}/tickets
              
              If you have any questions or need help getting started, don't hesitate to reach out to our support team.
              
              Best regards,
              The TicketBounty Team
            `,
          });
          console.log(`Welcome email sent to ${user.email}`);
        } catch (error) {
          console.error(
            `Failed to send welcome email to ${user.email}:`,
            error,
          );
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
      const urlObj = new URL(url);
      const tokenParam = urlObj.searchParams.get("token");
      const baseUrl =
        process.env.AUTH_URL ||
        process.env.NEXTAUTH_URL ||
        "http://localhost:3000";
      const dynamicRouteUrl = tokenParam
        ? `${baseUrl}/reset-password/${tokenParam}`
        : url;

      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Reset Your Password</h2>
            <p>Hello,</p>
            <p>You requested to reset your password. Click the button below to create a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${dynamicRouteUrl}" 
                 style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p>If you didn't request this password reset, you can safely ignore this email.</p>
            <p>This link will expire in 1 hour.</p>
            <p>Best regards,<br>Your App Team</p>
          </div>
        `,
        text: `
          Reset Your Password
          
          Hello,
          
          You requested to reset your password. Click the link below to create a new password:
          
          ${dynamicRouteUrl}
          
          If you didn't request this password reset, you can safely ignore this email.
          
          This link will expire in 1 hour.
          
          Best regards,
          Your App Team
        `,
      });
    },
    onPasswordReset: async ({ user }, _request) => {
      console.log(`Password for user ${user.email} has been reset.`);
    },
    resetPasswordTokenExpiresIn: 3600, // 1 hour
  },

  // emailVerification: {
  //   sendVerificationEmail: async ({ user, url }, _request) => {
  //     await sendEmail({
  //       to: user.email,
  //       subject: "Verify your email address",
  //       html: `
  //         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  //           <h2 style="color: #333;">Verify Your Email Address</h2>
  //           <p>Hello,</p>
  //           <p>Please verify your email address by clicking the button below:</p>
  //           <div style="text-align: center; margin: 30px 0;">
  //             <a href="${url}"
  //                style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
  //               Verify Email
  //             </a>
  //           </div>
  //           <p>If you didn't create an account, you can safely ignore this email.</p>
  //           <p>Best regards,<br>Your App Team</p>
  //         </div>
  //       `,
  //       text: `
  //         Verify Your Email Address

  //         Hello,

  //         Please verify your email address by clicking the link below:

  //         ${url}

  //         If you didn't create an account, you can safely ignore this email.

  //         Best regards,
  //         Your App Team
  //       `,
  //     });
  //   },
  //   sendOnSignUp: true,
  //   autoSignInAfterVerification: true,
  //   expiresIn: 3600, // 1 hour
  // },
});
