import { orm } from "@firstroad/db";
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

  const { data: memberships } = await tryCatch(async () => {
    const rows = await orm.Member.where({ userId })
      .include("organization", (organization) =>
        organization.select(
          "createdAt",
          "id",
          "logo",
          "metadata",
          "name",
          "slug",
        ),
      )
      .all();

    if (rows.length === 0) {
      return [];
    }

    const organizationIds = [...new Set(rows.map((row) => row.organizationId))];
    const counts = await orm.Member.where((member) =>
      member.organizationId.in(organizationIds),
    )
      .groupBy("organizationId")
      .aggregate((aggregate) => ({ count: aggregate.count() }));

    const membersByOrg = new Map(
      counts.map((row) => [row.organizationId, row.count]),
    );

    return rows
      .sort(
        (left, right) =>
          new Date(right.organization.createdAt).getTime() -
          new Date(left.organization.createdAt).getTime(),
      )
      .map(({ organization, ...membership }) => {
        const createdAt = new Date(organization.createdAt);
        const joinedAt = new Date(membership.createdAt);
        return {
          ...organization,
          _count: {
            members: membersByOrg.get(organization.id) ?? 0,
          },
          createdAt,
          memberShipByUser: {
            ...membership,
            createdAt: joinedAt,
          } as Omit<Member, "user">,
        } satisfies BaseOrganisation;
      });
  });

  return memberships;
};

export { getOrganisationByUser };
