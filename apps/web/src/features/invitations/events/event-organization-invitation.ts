import { eventType } from "inngest";
import {
  email,
  examples,
  minLength,
  object,
  picklist,
  pipe,
  string,
  url,
} from "valibot";
import { sendInvitationEmail } from "@/features/invitations/utils/send-invitation-email";
import { inngest } from "@/lib/inngest";
import { tryCatch } from "@/utils/try-catch";

const organizationInvitationSchema = object({
  email: pipe(
    string(),
    email(),
    minLength(1, "Email is required"),
    examples(["bob@gmail.com", "alice@yahoo.com", "john@protonmail.com"]),
  ),
  organizationName: pipe(
    string(),
    minLength(1, "Organization name is required"),
  ),
  inviterName: pipe(string(), minLength(1, "Inviter name is required")),
  role: picklist(["member", "admin"]),
  inviteUrl: pipe(string(), url()),
});

export const organizationInvitation = eventType("organization.invitation", {
  schema: organizationInvitationSchema,
});

export const eventOrganizationInvitation = inngest.createFunction(
  { id: "event-organization-invitation", triggers: [organizationInvitation] },
  async ({ event }) => {
    const {
      email: userEmail,
      organizationName,
      inviterName,
      role,
      inviteUrl,
    } = event.data;
    const { error } = await tryCatch(() =>
      sendInvitationEmail(
        userEmail,
        organizationName,
        inviterName,
        role,
        inviteUrl,
      ),
    );
    if (error) {
      throw new Error("Invalid organization invitation event data");
    }
  },
);
