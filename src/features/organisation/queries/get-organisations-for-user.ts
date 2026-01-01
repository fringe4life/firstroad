import { getUser } from "@/features/auth/queries/get-user";
import { prisma } from "@/lib/prisma";
import type { Maybe } from "@/types";
import { tryCatch } from "@/utils/try-catch";
import type { BaseOrganisation, Member } from "../types";

const getOrganisationByUser = async (): Promise<Maybe<BaseOrganisation[]>> => {
  "use cache: private";
  const { user, hasUser } = await getUser();
  if (!(hasUser && user)) {
    return null;
  }
  const userId = user.id;
  const { data: organisations } = await tryCatch(() =>
    prisma.organization.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: {
          where: {
            userId,
          },
        },
        _count: { select: { members: true } },
      },
    }),
  );
  return organisations?.map(({ members, ...org }) => ({
    ...org,
    memberShipByUser: members[0] as Omit<Member, "user">,
  }));
};

export { getOrganisationByUser };
