import type { User } from "@/features/auth/types";
import type { Maybe } from "@/types";

interface Entity {
  userId: Maybe<string>;
}

export interface IsOwner {
  isOwner: boolean;
}

export const isOwner = (user: Maybe<User>, { userId }: Entity): boolean =>
  userId ? user?.id === userId : false;

/**
 * Maps entities to include isOwner property based on session
 * Generic DAL helper for adding ownership information to data
 *
 * @example
 * const ticketsWithOwnership = withOwnership(session, tickets);
 * const commentsWithOwnership = withOwnership(session, comments);
 */
export const withOwnership = <T extends Entity>(
  session: Maybe<User>,
  entities: T[],
): Array<T & IsOwner> =>
  entities.map((entity) => ({
    ...entity,
    isOwner: isOwner(session, entity),
  }));
