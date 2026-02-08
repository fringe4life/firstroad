import { prisma } from "@firstroad/db";
import type { MemberModel } from "@firstroad/db/client-types";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import type { Maybe } from "@/types";
import { tryCatch } from "@/utils/try-catch";

const getMemberRole = async (
  organizationId: string,
): Promise<Maybe<MemberModel["role"]>> => {
  const { id: userId } = await getUserOrRedirect();

  const { data: member } = await tryCatch(() =>
    prisma.member.findFirst({
      where: {
        organizationId,
        userId,
      },
      select: {
        role: true,
      },
    }),
  );

  return member?.role;
};

export { getMemberRole };
