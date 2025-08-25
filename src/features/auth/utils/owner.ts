import type { Session } from "next-auth";

type Entity = {
  userId: string | null | undefined;
};

export type IsOwner = {
  isOwner: boolean;
};

export const isOwner = (session: Session | null, { userId }: Entity) => {
  if (!userId) return false;

  return session?.user?.id === userId;
};
