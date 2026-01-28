import { prisma } from "@/lib/prisma";
import type { List } from "@/types";
import { tryCatch } from "@/utils/try-catch";
import type { OrganisationMemberRow } from "../types";

const getMembershipsById = async (
  id: string,
): Promise<List<OrganisationMemberRow>> => {
  const { data: members } = await tryCatch(async () => {
    const rows = await prisma.member.findMany({
      where: { organizationId: id },
      select: {
        id: true,
        createdAt: true,
        role: true,
        user: {
          select: {
            name: true,
            email: true,
            emailVerified: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return rows.map((member) => ({
      id: member.id,
      email: member.user.email,
      emailVerified: member.user.emailVerified,
      joinedAt: member.createdAt,
      name: member.user.name,
      role: member.role,
    }));
  });

  return members;
};
export { getMembershipsById };
