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
      headers: await headers(),
      query: { id: invitationId },
    });
    return result;
  });

  if (!invitation) {
    return null;
  }

  return {
    email: invitation.email,
    expiresAt: new Date(invitation.expiresAt),
    id: invitation.id,
    inviterName: invitation.inviterEmail ?? null,
    organizationName: invitation.organizationName,
    organizationSlug: invitation.organizationSlug,
    role: invitation.role ?? "member",
    status: invitation.status,
  };
};
