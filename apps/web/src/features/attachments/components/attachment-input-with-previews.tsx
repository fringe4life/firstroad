"use client";

import {
  forwardRef,
  useEffect,
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

  useEffect(() => {
    onPreviewsChange?.(previews.length);
  }, [previews.length, onPreviewsChange]);

  const reset = () => {
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
  };

  const resetRef = useRef(reset);
  resetRef.current = reset;
  useImperativeHandle(ref, () => ({ reset: () => resetRef.current() }), []);

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
      for (const preview of previousPreviews) {
        if (preview.kind === "image") {
          URL.revokeObjectURL(preview.objectUrl);
        }
      }
      return createAttachmentPreviews(files);
    });
  };

  const handleRemovePreview = (previewId: string): void => {
    setPreviews((previousPreviews) => {
      const nextPreviews = previousPreviews.filter(
        (preview) => preview.id !== previewId,
      );
      const removedPreview = previousPreviews.find(
        (preview) => preview.id === previewId,
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
