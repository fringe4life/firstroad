"use client";

import {
  useActionState,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AttachmentPreviewCard } from "@/features/attachments/components/attachment-preview";
import { type ActionState, EMPTY_ACTION_STATE } from "@/utils/to-action-state";
import { ACCEPTED_FILE_TYPES } from "../constants";
import type { CreateAttachmentAction } from "../types";
import type { AttachmentPreview } from "../utils/attachment-previews";
import { createAttachmentPreviews } from "../utils/attachment-previews";

interface AttachmentCreateFormProps {
  ownerId: string;
  createAttachmentAction: CreateAttachmentAction;
}

const AttachmentCreateForm = ({
  ownerId,
  createAttachmentAction,
}: AttachmentCreateFormProps) => {
  const fileId = useId();
  const [actionState, action] = useActionState(
    async (prevState: ActionState, formData: FormData) => {
      const nextState = await createAttachmentAction(
        ownerId,
        prevState,
        formData,
      );

      if (nextState.status === "SUCCESS") {
        // clear previews + reset file input here
        setPreviews((previous) => {
          for (const preview of previous) {
            if (preview.kind === "image") {
              URL.revokeObjectURL(preview.objectUrl);
            }
          }
          return [];
        });
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }

      return nextState;
    },
    EMPTY_ACTION_STATE,
  );
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previews, setPreviews] = useState<AttachmentPreview[]>([]);

  const hasPreviews = useMemo(() => previews.length > 0, [previews]);

  useEffect(
    () => () => {
      for (const preview of previews) {
        if (preview.kind === "image") {
          URL.revokeObjectURL(preview.objectUrl);
        }
      }
    },
    [previews],
  );

  const handleFilesChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const { files } = event.target;

    setPreviews((previousPreviews) => {
      // Clean up existing object URLs before creating new ones
      for (const preview of previousPreviews) {
        if (preview.kind === "image") {
          URL.revokeObjectURL(preview.objectUrl);
        }
      }

      return createAttachmentPreviews(files);
    });
  };

  const handleRemovePreview = (id: string): void => {
    setPreviews((previousPreviews) => {
      const nextPreviews = previousPreviews.filter(
        (preview) => preview.id !== id,
      );

      const removedPreview = previousPreviews.find(
        (preview) => preview.id === id,
      );

      if (removedPreview?.kind === "image") {
        URL.revokeObjectURL(removedPreview.objectUrl);
      }

      const input = inputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();

        for (const preview of nextPreviews) {
          dataTransfer.items.add(preview.file);
        }

        input.files = dataTransfer.files;
      }

      return nextPreviews;
    });
  };

  return (
    <Form action={action} state={actionState}>
      <Label htmlFor={fileId}>Files</Label>
      <Input
        accept={ACCEPTED_FILE_TYPES.join(",")}
        id={fileId}
        multiple
        name="files"
        onChange={handleFilesChange}
        ref={inputRef}
        type="file"
      />
      <FieldError actionState={actionState} name="files" />

      {hasPreviews && (
        <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(9.75rem,1fr))] justify-start justify-items-start gap-3">
          {previews.map((preview) => (
            <AttachmentPreviewCard
              key={preview.id}
              onRemove={handleRemovePreview}
              preview={preview}
            />
          ))}
        </div>
      )}

      <SubmitButton disabled={!hasPreviews} label="Upload" />
    </Form>
  );
};

export { AttachmentCreateForm };
