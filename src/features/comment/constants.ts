import type { EditingState } from "./types";

export const INITIAL_EDITING_STATE = {
  commentId: undefined,
  content: undefined,
} satisfies EditingState;
