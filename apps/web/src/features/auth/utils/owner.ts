import type { User, UserVerifiable } from "@/features/auth/types";
import type { Maybe } from "@/types";

/**
 *
 * @param user the User that may or may not be logged
 * @param UserVerifiable any object that contains userId
 * @returns boolean
 */
const isOwner = <T extends UserVerifiable>(
  user: Maybe<User>,
  { userId }: T,
): boolean => (userId ? user?.id === userId : false);

export { isOwner };
