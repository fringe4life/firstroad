import type { List, Maybe } from "@/types";
import type { IsOwner, User, UserVerifiable } from "../types";
import { isOwner } from "../utils/owner";

/**
 * @abstract DAL helper for adding ownership information to a list of items
 * @param items a list of items or a promise of a list of items
 * @param user the user to check ownership against
 * @returns the list of items with the isOwner property
 */
const itemsWithOwnership = async <T extends UserVerifiable>(
  items: List<T> | Promise<List<T>>,
  user: Maybe<User>,
): Promise<List<T & IsOwner>> => {
  const resolvedItems = await items;
  return resolvedItems?.map((item) => ({
    ...item,
    isOwner: isOwner(user, item),
  }));
};

export { itemsWithOwnership };
