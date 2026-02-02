import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { tryCatch } from "@/utils/try-catch";

export interface InvitationDetails {
  id: string;
  email: string;
  organizationName: string;
  organizationSlug: string;
  inviterName: string | null;
  role: string;
  status: string;
  expiresAt: Date;
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
