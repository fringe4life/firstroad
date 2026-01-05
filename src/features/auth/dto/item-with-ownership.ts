import type { Maybe } from "@/types";
import { tryCatch } from "@/utils/try-catch";
import { getUser } from "../queries/get-user";
import type { IsOwner, User, UserVerifiable } from "../types";
import { isOwner } from "../utils/owner";

const itemWithOwnership = async <T extends UserVerifiable>(
  itemPromise: () => Promise<Maybe<T>>,
  user?: Maybe<User>,
): Promise<Maybe<T & IsOwner>> => {
  const currentUser = user ?? (await getUser()).user;
  const { data: item, error } = await tryCatch(() => itemPromise());
  if (!item || error) {
    return null;
  }
  return { ...item, isOwner: isOwner(currentUser, item) };
};

export { itemWithOwnership };
