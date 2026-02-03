"use client";

import { useActionState, useId } from "react";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";
import type { createAttachment } from "../actions/create-attachment";
import { ACCEPTED_FILE_TYPES } from "../constants";

interface AttachmentCreateFormProps {
  ticketId: string;
  createAttachmentAction: typeof createAttachment;
}

const AttachmentCreateForm = ({
  ticketId,
  createAttachmentAction,
}: AttachmentCreateFormProps) => {
  const fileId = useId();
  const [actionState, action] = useActionState(
    createAttachmentAction.bind(null, ticketId),
    EMPTY_ACTION_STATE,
  );

  return (
    <Form action={action} state={actionState}>
      <Label htmlFor={fileId}>Files</Label>
      <Input
        accept={ACCEPTED_FILE_TYPES.join(",")}
        id={fileId}
        multiple
        name="files"
        type="file"
      />
      <FieldError actionState={actionState} name="files" />
      <SubmitButton label="Upload" />
    </Form>
  );
};

export { AttachmentCreateForm };
