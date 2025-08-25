import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  plugins: [nextCookies()],

  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }, _request) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Reset Your Password</h2>
            <p>Hello,</p>
            <p>You requested to reset your password. Click the button below to create a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${url}" 
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
          
          ${url}
          
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

  emailVerification: {
    sendVerificationEmail: async ({ user, url }, _request) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Verify Your Email Address</h2>
            <p>Hello,</p>
            <p>Please verify your email address by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${url}" 
                 style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Verify Email
              </a>
            </div>
            <p>If you didn't create an account, you can safely ignore this email.</p>
            <p>Best regards,<br>Your App Team</p>
          </div>
        `,
        text: `
          Verify Your Email Address
          
          Hello,
          
          Please verify your email address by clicking the link below:
          
          ${url}
          
          If you didn't create an account, you can safely ignore this email.
          
          Best regards,
          Your App Team
        `,
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600, // 1 hour
  },
});
