"use client";

import {
  type ChangeEventHandler,
  forwardRef,
  useEffect,
  useEffectEvent,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AttachmentPreviewCard } from "@/features/attachments/components/attachment-preview";
import type { Maybe } from "@/types";
import { ACCEPTED_FILE_TYPES } from "../constants";
import type {
  AttachmentInputWithPreviewsProps,
  AttachmentInputWithPreviewsRef,
  AttachmentPreview,
} from "../types";
import { createAttachmentPreviews } from "../utils/attachment-previews";
import { revokeImagePreviews } from "../utils/revoke-previews";

const AttachmentInputWithPreviews = forwardRef<
  AttachmentInputWithPreviewsRef,
  AttachmentInputWithPreviewsProps
>(function AttachmentInputWithPreviews(
  {
    disabled = false,
    fileInputId,
    label = "Files",
    name = "files",
    onPreviewsChange,
  },
  ref,
) {
  const generatedId = useId();
  const id = fileInputId ?? generatedId;
  const inputRef = useRef<Exclude<Maybe<HTMLInputElement>, undefined>>(null);
  const [previews, setPreviews] = useState<AttachmentPreview[]>([]);

  const hasPreviews = previews.length > 0;

  const reset = useEffectEvent(() => {
    setPreviews((previous) => {
      revokeImagePreviews(previous);
      return [];
    });
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    // Defer so we never update parent during render (avoids "setState in render" when parent calls reset())
    queueMicrotask(() => onPreviewsChange?.(0));
  });

  useImperativeHandle(ref, () => ({ reset }), []);

  useEffect(() => () => revokeImagePreviews(previews), [previews]);

  const handleFilesChange: ChangeEventHandler<HTMLInputElement> = (
    event,
  ): void => {
    const { files } = event.target;
    const nextPreviews = createAttachmentPreviews(files);
    setPreviews((previousPreviews) => {
      revokeImagePreviews(previousPreviews);
      return nextPreviews;
    });
    onPreviewsChange?.(nextPreviews.length);
  };

  const handleRemovePreview = (previewId: string): void => {
    setPreviews((previousPreviews) => {
      const removedPreview = previousPreviews.find(
        (preview) => preview.id === previewId,
      );
      if (removedPreview) {
        revokeImagePreviews([removedPreview]);
      }
      const nextPreviews = previousPreviews.filter(
        (preview) => preview.id !== previewId,
      );
      const input = inputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        for (const preview of nextPreviews) {
          dataTransfer.items.add(preview.file);
        }
        input.files = dataTransfer.files;
      }
      onPreviewsChange?.(nextPreviews.length);
      return nextPreviews;
    });
  };

  return (
    <div className="grid gap-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        accept={ACCEPTED_FILE_TYPES.join(",")}
        disabled={disabled}
        id={id}
        multiple
        name={name}
        onChange={handleFilesChange}
        ref={inputRef}
        type="file"
      />
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
    </div>
  );
});

export { AttachmentInputWithPreviews };
