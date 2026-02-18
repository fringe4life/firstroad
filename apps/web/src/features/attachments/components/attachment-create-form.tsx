"use client";

import { useActionState, useRef, useState } from "react";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { type ActionState, EMPTY_ACTION_STATE } from "@/utils/to-action-state";
import {
  type AttachmentCreatedPayload,
  type CreateAttachmentAction,
  hasAttachmentCreatedPayload,
} from "../types";
import type { AttachmentInputWithPreviewsRef } from "./attachment-input-with-previews";
import { AttachmentInputWithPreviews } from "./attachment-input-with-previews";

interface AttachmentCreateFormProps {
  createAttachmentAction: CreateAttachmentAction;
  onClientAttachmentCreated?: (payload: AttachmentCreatedPayload) => void;
  onSuccess?: () => void;
  ownerId: string;
}

const AttachmentCreateForm = ({
  ownerId,
  createAttachmentAction,
  onSuccess,
  onClientAttachmentCreated,
}: AttachmentCreateFormProps) => {
  const inputRef = useRef<AttachmentInputWithPreviewsRef>(null);
  const [previewCount, setPreviewCount] = useState(0);

  const [actionState, action] = useActionState(
    async (
      prevState: ActionState<AttachmentCreatedPayload | unknown>,
      formData: FormData,
    ) => {
      const nextState = await createAttachmentAction(
        ownerId,
        prevState,
        formData,
      );

      if (nextState.status === "SUCCESS") {
        if (hasAttachmentCreatedPayload(nextState)) {
          onClientAttachmentCreated?.(nextState.data);
        }
        inputRef.current?.reset();
        setPreviewCount(0);
        onSuccess?.();
      }

      return nextState;
    },
    EMPTY_ACTION_STATE as ActionState<AttachmentCreatedPayload | unknown>,
  );

  return (
    <Form action={action} state={actionState}>
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
