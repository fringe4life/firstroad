import { prisma } from "@/lib/prisma";
import type { Maybe } from "@/types";
import { tryCatch } from "@/utils/try-catch";
import type { MemberPermission } from "../types";

const getMemberPermission = async (
  userId: string,
  organizationId: string,
): Promise<Maybe<MemberPermission>> => {
  const { data: member } = await tryCatch(() =>
    prisma.member.findFirst({
      where: {
        organizationId,
        userId,
      },
      select: {
        canDeleteTicket: true,
      },
    }),
  );

  return member;
};

export { getMemberPermission };
