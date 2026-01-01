"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";
import { upsertComment } from "../actions/upsert-comment";

interface CommentCreateFormProps {
  ticketId: string;
  commentId?: string;
  initialContent?: string;
  onCancel?: () => void;
  onSuccess?: () => void;
  upsertCommentAction: typeof upsertComment;
}

const CommentCreateForm = ({
  ticketId,
  commentId,
  initialContent = "",
  onCancel,
  onSuccess,
}: CommentCreateFormProps) => {
  // Create a wrapper function that matches useActionState signature

  const [state, formAction] = useActionState(
    upsertComment.bind(null, commentId, ticketId),
    EMPTY_ACTION_STATE,
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contentId = useId();

  // Populate form when editing
  useEffect(() => {
    if (commentId && initialContent && textareaRef.current) {
      textareaRef.current.value = initialContent;
    }
  }, [commentId, initialContent]);

  // Focus textarea when editing
  useEffect(() => {
    if (commentId && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [commentId]);

  const handleSuccess = () => {
    // Reset form on success
    if (textareaRef.current) {
      textareaRef.current.value = "";
    }
    // Call onSuccess callback to refresh data
    if (onSuccess) {
      onSuccess();
    }
    // Call onCancel if provided (for edit mode)
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Form
      action={formAction}
      className="grid gap-y-2"
      onSuccessState={handleSuccess}
      state={state}
    >
      <div>
        <Label htmlFor={contentId}>
          {commentId ? "Edit comment" : "Add a comment"}
        </Label>
        <Textarea
          className="field-sizing-content min-h-25"
          defaultValue={
            (state?.payload?.get("content") as string) || initialContent
          }
          id={contentId}
          name="content"
          placeholder="Write your comment here..."
          ref={textareaRef}
        />
        <FieldError actionState={state} name="content" />
      </div>
      <div className="flex gap-2">
        <SubmitButton label={commentId ? "Update comment" : "Post comment"} />
        {Boolean(commentId) && Boolean(onCancel) && (
          <button
            className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
        )}
      </div>
    </Form>
  );
};

export { CommentCreateForm };
