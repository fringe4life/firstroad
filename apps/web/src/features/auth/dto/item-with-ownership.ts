import type { Maybe } from "@/types";
import { getUser } from "../queries/get-user";
import type { IsOwner, User, UserVerifiable } from "../types";
import { isOwner } from "../utils/owner";

/**
 * @abstract DAL helper for adding ownership information to a single item
 * @param item an item or a promise of an item
 * @param user the user to check ownership against
 * @returns the item with the isOwner property
 */
const itemWithOwnership = async <T extends UserVerifiable>(
  item: Maybe<T> | Promise<Maybe<T>>,
  user?: Maybe<User>,
): Promise<Maybe<T & IsOwner>> => {
  const currentUser = user ?? (await getUser()).user;
  const resolvedItem = await item;
  if (!resolvedItem) {
    return null;
  }
  return { ...resolvedItem, isOwner: isOwner(currentUser, resolvedItem) };
};

export { itemWithOwnership };
