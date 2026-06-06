"use client";

import { Trash2 } from "lucide-react";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { useActionStateWithFeedback } from "@/hooks/use-action-state-with-feedback";
import { type ActionState, EMPTY_ACTION_STATE } from "@/utils/to-action-state";
import { ATTACHMENT_KIND_ICONS } from "../constants";
import {
  type AttachmentDeletedPayload,
  type AttachmentItemProps,
  hasAttachmentDeletedPayload,
} from "../types";
import { getAttachmentKindFromName } from "../utils/attachment-kind";

const AttachmentItem = ({
  attachment,
  isOwner,
  ownerId,
  deleteAttachmentAction,
  onClientAttachmentDeleted,
}: AttachmentItemProps) => {
  const { downloadUrl, id, name } = attachment;
  const [_state, action] = useActionStateWithFeedback(
    async (
      prevState: ActionState<AttachmentDeletedPayload> | ActionState<unknown>,
      formData: FormData,
    ) =>
      await deleteAttachmentAction(
        { attachmentId: id, ownerId },
        prevState,
        formData,
      ),
    EMPTY_ACTION_STATE as
      | ActionState<AttachmentDeletedPayload>
      | ActionState<unknown>,
    {
      onSuccess: (nextState) => {
        if (hasAttachmentDeletedPayload(nextState)) {
          onClientAttachmentDeleted?.(nextState.data);
        }
      },
    },
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
        <Form action={action}>
          <SubmitButton icon={<Trash2 />} size="icon" variant="destructive" />
        </Form>
      )}
    </li>
  );
};

export { AttachmentItem };
