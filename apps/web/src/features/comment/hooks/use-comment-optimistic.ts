import type { CommentWithUserInfo } from "../types";

export type OptimisticCommentAction =
  | {
      type: "add";
      comment: Omit<CommentWithUserInfo, "id" | "createdAt" | "updatedAt">;
    }
  | { type: "edit"; commentId: string; content: string }
  | { type: "delete"; commentId: string };

export const commentReducer = (
  state: CommentWithUserInfo[],
  action: OptimisticCommentAction,
): CommentWithUserInfo[] => {
  switch (action.type) {
    case "add":
      // Add to beginning (newest first by updatedAt)
      return [
        {
          ...action.comment,
          createdAt: new Date().toISOString(),
          id: crypto.randomUUID(),
          updatedAt: new Date().toISOString(),
        },
        ...state,
      ];
    case "edit": {
      // Update content and move to beginning (reflects updatedAt change)
      const updated = state.map((comment) =>
        comment.id === action.commentId
          ? {
              ...comment,
              content: action.content,
              updatedAt: new Date().toISOString(),
            }
          : comment,
      );
      // Move edited comment to top
      const edited = updated.find((c) => c.id === action.commentId);
      const others = updated.filter((c) => c.id !== action.commentId);
      return edited ? [edited, ...others] : updated;
    }
    case "delete":
      return state.filter((comment) => comment.id !== action.commentId);
    default:
      throw new Error("shouldnt happen") as never;
  }
};
