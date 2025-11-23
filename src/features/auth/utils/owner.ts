import type { MaybeServerSession } from "@/features/auth/types";
import type { Maybe } from "@/types";

type Entity = {
  userId: Maybe<string>;
};

export type IsOwner = {
  isOwner: boolean;
};

export const isOwner = (
  session: MaybeServerSession,
  { userId }: Entity,
): boolean => (userId ? session?.user?.id === userId : false);

/**
 * Maps entities to include isOwner property based on session
 * Generic DAL helper for adding ownership information to data
 *
 * @example
 * const ticketsWithOwnership = withOwnership(session, tickets);
 * const commentsWithOwnership = withOwnership(session, comments);
 */
export const withOwnership = <T extends Entity>(
  session: MaybeServerSession,
  entities: T[],
): Array<T & IsOwner> =>
  entities.map((entity) => ({
    ...entity,
    isOwner: isOwner(session, entity),
  }));
