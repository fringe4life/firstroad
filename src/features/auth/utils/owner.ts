import type { Entity, IsOwner, User } from "@/features/auth/types";
import type { Maybe } from "@/types";

/**
 *
 * @param user the User that may or may not be logged
 * @param Entity any object that contains userId
 * @returns boolean
 */
const isOwner = <T extends Entity>(
  user: Maybe<User>,
  { userId }: T,
): boolean => (userId ? user?.id === userId : false);

/**
 * Maps entities to include isOwner property based on session
 * Generic DAL helper for adding ownership information to data
 *
 * @example
 * const ticketsWithOwnership = withOwnership(session, tickets);
 * const commentsWithOwnership = withOwnership(session, comments);
 */
const withOwnership = <T extends Entity>(
  user: Maybe<User>,
  entities: T[],
): Array<T & IsOwner> =>
  entities.map((entity) => ({
    ...entity,
    isOwner: isOwner(user, entity),
  }));

export { isOwner, withOwnership };
