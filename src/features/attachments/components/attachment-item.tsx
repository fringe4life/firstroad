"use client";

import { FileDown } from "lucide-react";
import type { AttachmentWithUrl } from "../types";

interface AttachmentItemProps {
  attachment: AttachmentWithUrl;
}

const AttachmentItem = ({ attachment }: AttachmentItemProps) => {
  const { downloadUrl, name } = attachment;

  const content = downloadUrl ? (
    <a
      className="flex items-center gap-x-2 text-primary text-sm hover:underline"
      href={downloadUrl}
      rel="noopener noreferrer"
      target="_blank"
    >
      <FileDown className="aspect-square w-4 shrink-0" />
      <span className="truncate">{name}</span>
    </a>
  ) : (
    <span className="flex items-center gap-x-2 text-muted-foreground text-sm">
      <FileDown className="aspect-square w-4 shrink-0" />
      <span className="truncate">{name}</span>
    </span>
  );

  return <li>{content}</li>;
};

export { AttachmentItem };
