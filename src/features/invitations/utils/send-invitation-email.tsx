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
    to: email,
    subject: `You've been invited to join ${organizationName}`,
    template: {
      id: "organization-invitation",
      variables: {
        TO_NAME: email,
        ORGANIZATION_NAME: organizationName,
        INVITER_NAME: inviterName,
        ROLE: role,
        INVITE_URL: inviteUrl,
      },
    },
  });
