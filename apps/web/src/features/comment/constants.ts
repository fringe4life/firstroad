import type { CommentInclude } from "@firstroad/db/client-types";
import type { EditingState } from "./types";

const INITIAL_EDITING_STATE = {
  commentId: undefined,
  content: undefined,
} satisfies EditingState;

const COMMENT_WITH_USER_INCLUDE = {
  user: {
    select: {
      name: true,
    },
  },
} satisfies CommentInclude;

export { COMMENT_WITH_USER_INCLUDE, INITIAL_EDITING_STATE };
