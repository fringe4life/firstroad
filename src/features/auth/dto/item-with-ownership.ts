import type { Maybe } from "@/types";
import { getUser } from "../queries/get-user";
import type { IsOwner, User, UserVerifiable } from "../types";
import { isOwner } from "../utils/owner";

/**
 * @abstract DAL helper for adding ownership information to a single item
 * @param itemPromise a function that returns a promise of an item
 * @param user the user to check ownership against
 * @returns the item with the isOwner property
 */
const itemWithOwnership = async <T extends UserVerifiable>(
  itemPromise: () => Promise<Maybe<T>>,
  user?: Maybe<User>,
): Promise<Maybe<T & IsOwner>> => {
  const currentUser = user ?? (await getUser()).user;
  const item = await itemPromise();
  if (!item) {
    return null;
  }
  return { ...item, isOwner: isOwner(currentUser, item) };
};

export { itemWithOwnership };
