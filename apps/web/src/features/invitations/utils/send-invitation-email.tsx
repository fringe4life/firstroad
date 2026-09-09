import { resend } from "@/lib/email";

export const sendInvitationEmail = async (
  email: string,
  organizationName: string,
  inviterName: string,
  role: string,
  inviteUrl: string,
) =>
  await resend.emails.send({
    // biome-ignore lint/style/noNonNullAssertion: will exist
    from: process.env.NEXT_PUBLIC_RESEND_FROM!,
    subject: `You've been invited to join ${organizationName}`,
    template: {
      id: "organization-invitation",
      variables: {
        INVITE_URL: inviteUrl,
        INVITER_NAME: inviterName,
        ORGANIZATION_NAME: organizationName,
        ROLE: role,
        TO_NAME: email,
      },
    },
    to: email,
  });
