import type { EditingState } from "./types";

const INITIAL_EDITING_STATE = {
  commentId: undefined,
  content: undefined,
} satisfies EditingState;

export { INITIAL_EDITING_STATE };
