"use client";

import {
  createContext,
  use,
  useOptimistic,
  useRef,
  useState,
  useTransition,
} from "react";
import type {
  AttachmentCreatedPayload,
  AttachmentDeletedPayload,
} from "@/features/attachments/types";
import { getMimeTypeFromFile } from "@/features/attachments/utils/attachment-mime-type";
import { getFilesFromFormData } from "@/features/attachments/utils/get-files-from-form-data";
import { commentReducer } from "@/features/comment/hooks/use-comment-optimistic";
import type {
  CommentState,
  CommentsContextValue,
  CommentsProviderProps,
  CommentWithUserInfo,
  EditingState,
} from "@/features/comment/types";
import { NO_PAGINATION } from "@/features/pagination/constants";
import { useActionStateWithFeedback } from "@/hooks/use-action-state-with-feedback";
import type { ActionState } from "@/utils/to-action-state";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";
import { INITIAL_EDITING_STATE } from "../constants";

const CommentsContext = createContext<CommentsContextValue | null>(null);

const CommentsProvider = ({
  list,
  metadata,
  ticketSlug,
  loadMoreAction,
  loadMoreOrganizationId,
  loadMoreUserId,
  upsertCommentAction,
  deleteCommentAction,
  createAttachmentAction,
  deleteAttachmentAction,
  userId,
  userName,
  ticketId,
  canCreate,
  children,
}: CommentsProviderProps) => {
  const [commentsState, setCommentsState] = useState<CommentState>(() => ({
    list: list ?? [],
    metadata: metadata ?? NO_PAGINATION.metadata,
  }));

  const [optimisticComments, addOptimisticUpdate] = useOptimistic(
    commentsState.list,
    commentReducer,
  );

  const [editingState, setEditingState] = useState<EditingState>(
    () => INITIAL_EDITING_STATE,
  );

  const formRef = useRef<HTMLDivElement | null>(null);
  const formResetRef = useRef<(() => void) | null>(null);
  const registerFormReset = (fn: () => void) => {
    formResetRef.current = fn;
  };
  const [isPending, startTransition] = useTransition();

  const handleUpsertSuccess = (state: ActionState<CommentWithUserInfo>) => {
    const { data: comment } = state;
    if (!comment) {
      return;
    }

    setCommentsState((prev) => ({
      ...prev,
      list: (() => {
        if (editingState.commentId) {
          return prev.list.map((c) => (c.id === comment.id ? comment : c));
        }
        const exists = prev.list.some((c) => c.id === comment.id);
        if (exists) {
          return prev.list.map((c) => (c.id === comment.id ? comment : c));
        }
        return [comment, ...prev.list];
      })(),
    }));

    setEditingState(INITIAL_EDITING_STATE);
  };

  const [upsertState, upsertAction] = useActionStateWithFeedback(
    async (
      _prevState: ActionState<CommentWithUserInfo>,
      formData: FormData,
    ): Promise<ActionState<CommentWithUserInfo>> => {
      const content = formData.get("content") as string;
      const { commentId } = editingState;

      if (commentId) {
        startTransition(() => {
          addOptimisticUpdate({ commentId, content, type: "edit" });
        });
      } else if (userId && userName && ticketId) {
        const files = getFilesFromFormData(formData);
        const optimisticAttachments =
          files.length > 0
            ? files.map((file: File) => ({
                contentType: getMimeTypeFromFile(file),
                downloadUrl: null as string | null,
                id: crypto.randomUUID(),
                name: file.name,
              }))
            : undefined;
        startTransition(() => {
          addOptimisticUpdate({
            comment: {
              content,
              ticketId,
              user: {
                name: userName,
              },
              userId,
              ...(optimisticAttachments &&
                optimisticAttachments.length > 0 && {
                  attachments: optimisticAttachments,
                }),
            },
            type: "add",
          });
        });
      }

      return await upsertCommentAction(
        commentId,
        ticketId,
        _prevState as ActionState<CommentWithUserInfo>,
        formData,
      );
    },
    EMPTY_ACTION_STATE as ActionState<CommentWithUserInfo>,
    {
      onSuccess: (state) => {
        handleUpsertSuccess(state);
        formResetRef.current?.();
      },
    },
  );

  const handleEdit = (commentId: string, content: string) => {
    setEditingState({ commentId, content });
    // biome-ignore lint/suspicious/noUnnecessaryConditions: ref is null until mount
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleCancelEdit = () => {
    setEditingState(INITIAL_EDITING_STATE);
  };

  const handleLoadMore = () => {
    startTransition(() => {
      (async () => {
        const newData = await loadMoreAction(
          ticketSlug,
          commentsState.metadata.nextCursor ?? "",
          3,
          loadMoreOrganizationId,
          loadMoreUserId,
        );
        setCommentsState((prev) => ({
          list: [...prev.list, ...(newData.list ?? [])],
          metadata: newData.metadata,
        }));
      })();
    });
  };

  const handleDelete = async (
    commentId: string,
  ): Promise<ActionState<string>> => {
    startTransition(() => {
      addOptimisticUpdate({ commentId, type: "delete" });
    });

    const result = await deleteCommentAction(commentId);

    if (result.status === "SUCCESS") {
      setCommentsState((prev) => ({
        ...prev,
        list: prev.list.filter((c) => c.id !== commentId),
      }));
    }

    return result;
  };

  const handleClientAttachmentCreated = (payload: AttachmentCreatedPayload) => {
    setCommentsState((prev) => ({
      ...prev,
      list: prev.list.map((comment) =>
        comment.id === payload.item.commentId
          ? {
              ...comment,
              attachments: [...(comment.attachments ?? []), ...payload.created],
            }
          : comment,
      ),
    }));
  };

  const handleClientAttachmentDeleted = (payload: AttachmentDeletedPayload) => {
    setCommentsState((prev) => ({
      ...prev,
      list: prev.list.map((comment) =>
        comment.id === payload.item.commentId
          ? {
              ...comment,
              attachments: (comment.attachments ?? []).filter(
                (attachment) => attachment.id !== payload.deletedAttachmentId,
              ),
            }
          : comment,
      ),
    }));
  };

  const value: CommentsContextValue = {
    canCreate,
    createAttachmentAction,
    deleteAttachmentAction,
    editingState,
    formRef,
    handleCancelEdit,
    handleClientAttachmentCreated,
    handleClientAttachmentDeleted,
    handleDelete,
    handleEdit,
    handleLoadMore,
    hasNextPage: commentsState.metadata.hasNextPage,
    isPending,
    optimisticComments,
    registerFormReset,
    upsertAction,
    upsertState,
    userId,
  };

  return <CommentsContext value={value}>{children}</CommentsContext>;
};

const useComments = () => {
  const context = use(CommentsContext);
  if (!context) {
    throw new Error("useComments must be used within CommentsProvider");
  }
  return context;
};

export { CommentsProvider, useComments };
