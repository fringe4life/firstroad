import { prisma } from "@firstroad/db";
import { cacheLife, cacheTag } from "next/cache";
import type { Maybe } from "@/types";
import {
  organisationCache,
  organisationsForUserCache,
} from "@/utils/cache-tags";
import { tryCatch } from "@/utils/try-catch";
import type { BaseOrganisation, Member } from "../types";

const getOrganisationByUser = async (
  userId: string,
): Promise<Maybe<BaseOrganisation[]>> => {
  "use cache: remote";
  cacheTag(organisationCache());
  cacheTag(organisationsForUserCache(userId));
  cacheLife({ stale: 60 });

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
      orderBy: { createdAt: "desc" },
    }),
  );
  return organisations?.map(({ members, ...org }) => ({
    ...org,
    memberShipByUser: members[0] as Omit<Member, "user">,
  }));
};

export { getOrganisationByUser };
