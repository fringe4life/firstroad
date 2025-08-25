import type { ServerSession } from "@/features/auth/types";

type Entity = {
  userId: string | null | undefined;
};

export type IsOwner = {
  isOwner: boolean;
};

export const isOwner = (session: ServerSession | null, { userId }: Entity) => {
  if (!userId) return false;

  return session?.user?.id === userId;
};
