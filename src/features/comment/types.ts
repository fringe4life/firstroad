import type { Prisma } from "@prisma/client";
import type { IsOwner } from "@/features/auth/utils/owner";

// Base comment type using Prisma's generated type
type BaseComment = Prisma.CommentGetPayload<{
  include: {
    userInfo: {
      include: {
        user: {
          select: {
            name: true;
          };
        };
      };
    };
  };
}> &
  IsOwner;

// Comment type with additional properties for UI
export type Comment = BaseComment & {
  isDeleting?: boolean;
};

// Comment type with required user info (for actions)
export type CommentWithUserInfo = BaseComment;
