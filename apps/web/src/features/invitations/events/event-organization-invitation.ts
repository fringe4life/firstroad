import {
  email,
  examples,
  type InferOutput,
  minLength,
  object,
  parse,
  picklist,
  pipe,
  string,
  url,
} from "valibot";
import { sendInvitationEmail } from "@/features/invitations/utils/send-invitation-email";
import { inngest } from "@/lib/inngest";

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

export type OrganizationInvitationEventData = InferOutput<
  typeof organizationInvitationSchema
>;

export const eventOrganizationInvitation = inngest.createFunction(
  { id: "event-organization-invitation" },
  { event: "organization.invitation" },
  async ({ event }) => {
    try {
      const {
        email: userEmail,
        organizationName,
        inviterName,
        role,
        inviteUrl,
      } = parse(organizationInvitationSchema, event.data);
      await sendInvitationEmail(
        userEmail,
        organizationName,
        inviterName,
        role,
        inviteUrl,
      );
    } catch {
      throw new Error("Invalid organization invitation event data");
    }
  },
);
