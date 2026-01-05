import type { List, Maybe } from "@/types";
import type { IsOwner, User, UserVerifiable } from "../types";
import { isOwner } from "../utils/owner";

const itemsWithOwnership = async <T extends UserVerifiable>(
  itemsPromise: () => Promise<List<T>>,
  user: Maybe<User>,
): Promise<List<T & IsOwner>> => {
  const items = await itemsPromise();
  return items?.map((item) => ({ ...item, isOwner: isOwner(user, item) }));
};

export { itemsWithOwnership };
