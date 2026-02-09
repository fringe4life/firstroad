"use client";

import { Trash2 } from "lucide-react";
import { useActionState } from "react";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";
import { ATTACHMENT_KIND_ICONS } from "../constants";
import type { DeleteAttachmentAction, UIAttachment } from "../types";
import { getAttachmentKindFromName } from "../utils/attachment-kind";

interface AttachmentItemProps {
  attachment: UIAttachment;
  isOwner: boolean;
  ownerId: string;
  deleteAttachmentAction: DeleteAttachmentAction;
}

const AttachmentItem = ({
  attachment,
  isOwner,
  ownerId,
  deleteAttachmentAction,
}: AttachmentItemProps) => {
  const { downloadUrl, id, name } = attachment;
  const [state, action] = useActionState(
    deleteAttachmentAction.bind(null, { attachmentId: id, ownerId }),
    EMPTY_ACTION_STATE,
  );

  const kind = getAttachmentKindFromName(name);
  const KindIcon = ATTACHMENT_KIND_ICONS[kind];

  const content = downloadUrl ? (
    <a
      className="flex items-center gap-x-2 text-primary text-sm hover:underline"
      href={downloadUrl}
      rel="noopener noreferrer"
      target="_blank"
    >
      {KindIcon}
      <span className="truncate">{name}</span>
    </a>
  ) : (
    <span className="flex items-center gap-x-2 text-muted-foreground text-sm">
      {KindIcon}
      <span className="truncate">{name}</span>
    </span>
  );

  return (
    <li
      className="grid grid-flow-col grid-cols-1 owner:grid-cols-[1fr_36px] items-center gap-x-2"
      data-owner={isOwner}
    >
      <div className="truncate">{content}</div>
      {isOwner && (
        <Form action={action} state={state}>
          <SubmitButton icon={<Trash2 />} size="icon" variant="destructive" />
        </Form>
      )}
    </li>
  );
};

export { AttachmentItem };
