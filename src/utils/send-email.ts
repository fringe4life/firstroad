"use server";

import { resend } from "@/lib/email";
import { env } from "@/lib/env";

type EmailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

export async function sendEmail(options: EmailOptions): Promise<void> {
  const { to, subject, html, text, replyTo } = options;

  const result = await resend.emails.send({
    from: env.RESEND_FROM,
    to,
    subject,
    html,
    text,
    replyTo,
  });

  if (result.error) {
    const errorMessage =
      result.error.message || result.error.name || "Unknown Resend error";
    throw new Error(`Resend error: ${errorMessage}`);
  }
}
