import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { Maybe } from "@/types";
import { tryCatch } from "@/utils/try-catch";

const getMemberRole = async (
  organizationId: string,
): Promise<Maybe<Prisma.MemberModel["role"]>> => {
  const { id: userId } = await getUserOrRedirect({
    checkOrganistation: false,
  });

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

  return member?.role ?? null;
};

export { getMemberRole };
