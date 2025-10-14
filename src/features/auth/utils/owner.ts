import type { MaybeServerSession, ServerSession } from "@/features/auth/types";

type Entity = {
  userId: string | null | undefined;
};

export type IsOwner = {
  isOwner: boolean;
};

export const isOwner = (session: ServerSession | null, { userId }: Entity) => {
  if (!userId) {
    return false;
  }

  return session?.user?.id === userId;
};

/**
 * Maps entities to include isOwner property based on session
 * Generic DAL helper for adding ownership information to data
 *
 * @example
 * const ticketsWithOwnership = withOwnership(session, tickets);
 * const commentsWithOwnership = withOwnership(session, comments);
 */
export function withOwnership<T extends Entity>(
  session: MaybeServerSession,
  entities: T[],
): Array<T & IsOwner> {
  return entities.map((entity) => ({
    ...entity,
    isOwner: isOwner(session, entity),
  }));
}
