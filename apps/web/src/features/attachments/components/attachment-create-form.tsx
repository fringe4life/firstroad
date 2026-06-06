"use client";

import { useRef, useState } from "react";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { useActionStateWithFeedback } from "@/hooks/use-action-state-with-feedback";
import { type ActionState, EMPTY_ACTION_STATE } from "@/utils/to-action-state";
import {
  type AttachmentCreatedPayload,
  type AttachmentCreateFormProps,
  type AttachmentInputWithPreviewsRef,
  hasAttachmentCreatedPayload,
} from "../types";

import { AttachmentInputWithPreviews } from "./attachment-input-with-previews";

const AttachmentCreateForm = ({
  ownerId,
  createAttachmentAction,
  onSuccess,
  onClientAttachmentCreated,
}: AttachmentCreateFormProps) => {
  const inputRef = useRef<AttachmentInputWithPreviewsRef>(null);
  const [previewCount, setPreviewCount] = useState(0);

  const [actionState, action] = useActionStateWithFeedback(
    async (
      prevState: ActionState<AttachmentCreatedPayload | unknown>,
      formData: FormData,
    ) => await createAttachmentAction(ownerId, prevState, formData),
    EMPTY_ACTION_STATE as ActionState<AttachmentCreatedPayload>,
    {
      onSuccess: (nextState) => {
        if (hasAttachmentCreatedPayload(nextState)) {
          onClientAttachmentCreated?.(nextState.data);
        }
        inputRef.current?.reset();
        setPreviewCount(0);
        onSuccess?.();
      },
    },
  );

  return (
    <Form action={action}>
      <AttachmentInputWithPreviews
        onPreviewsChange={setPreviewCount}
        ref={inputRef}
      />
      <FieldError actionState={actionState} name="files" />
      <SubmitButton disabled={previewCount === 0} label="Upload" />
    </Form>
  );
};

export { AttachmentCreateForm };
