import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { tryCatch } from "@/utils/try-catch";

export interface InvitationDetails {
  email: string;
  expiresAt: Date;
  id: string;
  inviterName: string | null;
  organizationName: string;
  organizationSlug: string;
  role: string;
  status: string;
}

export const getInvitation = async (
  invitationId: string,
): Promise<InvitationDetails | null> => {
  const { data: invitation } = await tryCatch(async () => {
    const result = await auth.api.getInvitation({
      query: { id: invitationId },
      headers: await headers(),
    });
    return result;
  });

  if (!invitation) {
    return null;
  }

  return {
    id: invitation.id,
    email: invitation.email,
    organizationName: invitation.organizationName,
    organizationSlug: invitation.organizationSlug,
    inviterName: invitation.inviterEmail ?? null,
    role: invitation.role ?? "member",
    status: invitation.status,
    expiresAt: new Date(invitation.expiresAt),
  };
};
