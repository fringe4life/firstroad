import { FileExclamationPoint, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AttachmentPreview } from "../utils/attachment-previews";

interface AttachmentPreviewProps {
  preview: AttachmentPreview;
  onRemove: (id: string) => void;
}

const AttachmentPreviewCard = ({
  preview,
  onRemove,
}: AttachmentPreviewProps) => {
  const { id, file } = preview;

  let content: React.ReactNode;

  switch (preview.kind) {
    case "image": {
      // Using a background image avoids <img> lint while still rendering safely
      content = (
        <div
          aria-label={file.name}
          className="flex aspect-square h-24 items-center justify-center rounded-md bg-center bg-cover"
          role="img"
          style={{ backgroundImage: `url(${preview.objectUrl})` }}
        />
      );
      break;
    }
    case "pdf": {
      content = (
        <div className="flex h-24 w-24 items-center justify-center rounded-md bg-muted text-destructive">
          <svg
            aria-label={file.name}
            className="h-10 w-10"
            role="img"
            viewBox="0 0 24 24"
          >
            <title>Preview not available</title>
            <path d="M6 2h9l5 5v15H6V2zm8 1.5V8h4.5L14 3.5zM9 13h1.5c.83 0 1.5.67 1.5 1.5S11.33 16 10.5 16H9v-3zm1 1v1h.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5H10zm3 0h2c.83 0 1.5.67 1.5 1.5S15.83 17 15 17h-2v-3zm1 1v1h1c.28 0 .5-.22.5-.5s-.22-.5-.5-.5h-1zM8 13v3H7v-3h1z" />
          </svg>
        </div>
      );
      break;
    }
    case "other": {
      content = (
        <div className="flex aspect-square h-24 items-center justify-center rounded-md bg-muted text-muted-foreground text-xs">
          <FileExclamationPoint className="aspect-square h-full" />
        </div>
      );
      break;
    }
    default: {
      throw new Error(
        `Unhandled attachment preview kind: ${
          // biome-ignore lint/suspicious/noExplicitAny: exhaustive guard
          (preview as any).kind ?? "unknown"
        }`,
      ) as never;
    }
  }

  return (
    <div className="flex w-39 flex-col gap-2 rounded-md border border-border border-dashed bg-background/50 p-2">
      <div className="flex items-start gap-2">
        {content}
        <Button
          aria-label={`Remove ${file.name}`}
          onClick={() => onRemove(id)}
          size="icon"
          type="button"
          variant="destructive"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      <span className="w-full truncate text-xs">{file.name}</span>
    </div>
  );
};

export { AttachmentPreviewCard };
