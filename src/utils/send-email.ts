interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  const { to, subject, html, text, replyTo } = options;

  console.log("📧 Sending email via Resend:", {
    from: env.RESEND_FROM,
    to,
    subject,
    hasHtml: !!html,
    hasText: !!text,
    replyTo,
  });

  const result = await resend.emails.send({
    from: env.RESEND_FROM,
    to,
    subject,
    html,
    text,
    replyTo,
  });

  if (result.error) {
    console.error(
      "Resend error details:",
      JSON.stringify(result.error, null, 2),
    );
    const errorMessage =
      result.error.message || result.error.name || "Unknown Resend error";
    throw new Error(`Resend error: ${errorMessage}`);
  }
}
