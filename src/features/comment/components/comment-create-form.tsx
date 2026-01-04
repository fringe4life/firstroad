"use client";

import { useEffect, useId, useRef } from "react";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Maybe } from "@/types";
import type { ActionState } from "@/utils/to-action-state";
import type { CommentWithUserInfo } from "../types";

interface CommentCreateFormProps {
  action: (formData: FormData) => void;
  state: ActionState<CommentWithUserInfo>;
  commentId?: string;
  initialContent?: Exclude<Maybe<string>, null>;
  onCancel?: () => void;
  onSuccessState?: (state: ActionState<CommentWithUserInfo>) => void;
}

const CommentCreateForm = ({
  action,
  state,
  commentId,
  initialContent = "",
  onCancel,
  onSuccessState,
}: CommentCreateFormProps) => {
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

  const handleSuccess = (stateArg: ActionState<unknown>) => {
    // Reset form on success
    if (textareaRef.current) {
      textareaRef.current.value = "";
    }
    // Call onSuccessState callback with the action state (includes returned comment)
    if (onSuccessState) {
      onSuccessState(stateArg as ActionState<CommentWithUserInfo>);
    }
    // Call onCancel if provided (for edit mode)
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Form
      action={action}
      className="grid gap-y-2"
      onSuccessState={handleSuccess}
      state={state as ActionState<unknown>}
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
