import { cacheTag } from "next/cache";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { prisma } from "@/lib/prisma";
import type { Maybe } from "@/types";
import { organisationsForUserCache } from "@/utils/cache-tags";
import { tryCatch } from "@/utils/try-catch";
import type { BaseOrganisation, Member } from "../types";

const getOrganisationByUser = async (
  userId: string,
): Promise<Maybe<BaseOrganisation[]>> => {
  "use cache: private";
  cacheTag(organisationsForUserCache(userId));
  const { id } = await getUserOrRedirect();

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
