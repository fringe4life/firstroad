"use client";

import {
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
import { ACCEPTED_FILE_TYPES } from "../constants";
import type { AttachmentPreview } from "../utils/attachment-previews";
import { createAttachmentPreviews } from "../utils/attachment-previews";

/** Revoke object URLs for image previews so they can be garbage-collected. */
const revokeImagePreviews = (previews: AttachmentPreview[]): void => {
  for (const preview of previews) {
    if (preview.kind === "image") {
      URL.revokeObjectURL(preview.objectUrl);
    }
  }
};

export interface AttachmentInputWithPreviewsRef {
  reset: () => void;
}

interface AttachmentInputWithPreviewsProps {
  disabled?: boolean;
  fileInputId?: string;
  label?: string;
  name?: string;
  onPreviewsChange?: (count: number) => void;
}

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
  const inputRef = useRef<HTMLInputElement | null>(null);
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

  const handleFilesChange = (
    event: React.ChangeEvent<HTMLInputElement>,
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
