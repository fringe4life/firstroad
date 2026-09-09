"use client";

import { useEffect, useId, useRef } from "react";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AttachmentInputWithPreviews } from "@/features/attachments/components/attachment-input-with-previews";
import type { AttachmentInputWithPreviewsRef } from "@/features/attachments/types";
import type { CommentCreateFormProps } from "../types";

const CommentCreateForm = ({
  action,
  state,
  commentId,
  initialContent = "",
  onCancel,
  registerFormReset,
}: CommentCreateFormProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const attachmentInputRef = useRef<AttachmentInputWithPreviewsRef>(null);
  const contentId = useId();

  useEffect(() => {
    registerFormReset(() => {
      // biome-ignore lint/suspicious/noUnnecessaryConditions: ref is null until mount
      if (textareaRef.current) {
        textareaRef.current.value = "";
      }
      attachmentInputRef.current?.reset();
    });
  }, [registerFormReset]);

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

  return (
    <Form action={action} className="grid gap-y-2">
      <div className="grid gap-y-4">
        <Label htmlFor={contentId}>
          {commentId ? "Edit comment" : "Add a comment"}
        </Label>
        <Textarea
          className="field-sizing-content min-h-25"
          defaultValue={state.payload?.content ?? initialContent}
          id={contentId}
          name="content"
          placeholder="Write your comment here..."
          ref={textareaRef}
        />
        <FieldError actionState={state} name="content" />
      </div>
      <AttachmentInputWithPreviews ref={attachmentInputRef} />
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
