import { getUser } from "@/features/auth/queries/get-user";
import { prisma } from "@/lib/prisma";
import type { Maybe } from "@/types";
import { tryCatch } from "@/utils/try-catch";
import type { BaseOrganisation, Member } from "../types";

const getOrganisationByUser = async (): Promise<Maybe<BaseOrganisation[]>> => {
  "use cache: private";
  const { user } = await getUser();

  if (!user) {
    return null;
  }
  const { id } = user;
  const { data: organisations } = await tryCatch(() =>
    prisma.organization.findMany({
      where: {
        members: {
          some: {
            userId: id,
          },
        },
      },
      include: {
        members: {
          where: {
            userId: id,
          },
        },
        _count: { select: { members: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  );
  return organisations?.map(({ members, ...org }) => ({
    ...org,
    memberShipByUser: members[0] as Omit<Member, "user">,
  }));
};

export { getOrganisationByUser };
