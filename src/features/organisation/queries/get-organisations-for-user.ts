import { getSession } from "@/features/auth/queries/get-session";
import { prisma } from "@/lib/prisma";

const getOrganisationByUser = async () => {
  const session = await getSession();
  if (!session?.user) {
    return [];
  }
  const userId = session.user.id;
  const organisations = await prisma.organization.findMany({
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
  });
  return organisations.map(({ members, ...org }) => ({
    ...org,
    memberShipByUser: members[0],
  }));
};

export { getOrganisationByUser };
