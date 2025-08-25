// Simple email utility for password reset functionality
// In production, you would configure this with a proper email service like Resend, SendGrid, etc.

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  // TODO: Configure with your preferred email service
  // Examples:
  // - Resend: https://resend.com/
  // - SendGrid: https://sendgrid.com/
  // - Nodemailer with SMTP
  // - AWS SES

  console.log("📧 Email would be sent:");
  console.log("To:", options.to);
  console.log("Subject:", options.subject);
  console.log("HTML:", options.html);
  console.log("Text:", options.text);

  // For now, we'll just log the email
  // In production, replace this with actual email sending logic
  console.log("📧 Email would be sent:");
  console.log("To:", options.to);
  console.log("Subject:", options.subject);
  console.log("HTML:", options.html);
  console.log("Text:", options.text);

  // TODO: Configure with your preferred email service
  // Examples:
  // - Resend: https://resend.com/
  // - SendGrid: https://sendgrid.com/
  // - Nodemailer with SMTP
  // - AWS SES
}

export function createPasswordResetEmail(email: string, resetUrl: string) {
  const subject = "Reset Your Password";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Reset Your Password</h2>
      <p>Hello,</p>
      <p>You requested to reset your password. Click the button below to create a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" 
           style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p>If you didn't request this password reset, you can safely ignore this email.</p>
      <p>This link will expire in 1 hour.</p>
      <p>Best regards,<br>Your App Team</p>
    </div>
  `;

  const text = `
    Reset Your Password
    
    Hello,
    
    You requested to reset your password. Click the link below to create a new password:
    
    ${resetUrl}
    
    If you didn't request this password reset, you can safely ignore this email.
    
    This link will expire in 1 hour.
    
    Best regards,
    Your App Team
  `;

  return {
    to: email,
    subject,
    html,
    text,
  };
}
