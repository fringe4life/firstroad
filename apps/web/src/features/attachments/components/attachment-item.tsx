"use client";

import { FileDown, Trash2 } from "lucide-react";
import { useActionState } from "react";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";
import { deleteAttachment } from "../actions/delete-attachment";
import type { AttachmentWithUrl } from "../types";

interface AttachmentItemProps {
  attachment: AttachmentWithUrl;
  isOwner: boolean;
  ticketId: string;
}

const AttachmentItem = ({
  attachment,
  isOwner,
  ticketId,
}: AttachmentItemProps) => {
  const { downloadUrl, id, name } = attachment;
  const [state, action] = useActionState(
    deleteAttachment.bind(null, { attachmentId: id, ticketId }),
    EMPTY_ACTION_STATE,
  );

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

  return (
    <li className="flex items-center gap-x-2">
      <div className="flex-1">{content}</div>
      {isOwner && (
        <Form action={action} state={state}>
          <SubmitButton icon={<Trash2 />} size="icon" variant="destructive" />
        </Form>
      )}
    </li>
  );
};

export { AttachmentItem };
