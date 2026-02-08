"use server";

import { prisma } from "@firstroad/db";

const userExists = async (email: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { email: true }, // Only select email to limit data transfer
  });
  return user !== null;
};

export { userExists };
