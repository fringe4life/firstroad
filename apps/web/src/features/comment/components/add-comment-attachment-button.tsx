"use client";

import { LucidePaperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AttachmentCreateForm } from "@/features/attachments/components/attachment-create-form";
import type { CreateAttachmentAction } from "@/features/attachments/types";
import { useToggle } from "@/hooks/use-toggle";

interface AddCommentAttachmentButtonProps {
  commentId: string;
  createAttachmentAction: CreateAttachmentAction;
}

const AddCommentAttachmentButton = ({
  commentId,
  createAttachmentAction,
}: AddCommentAttachmentButtonProps) => {
  const { isOpen, open, close } = useToggle(false);

  return (
    <>
      <Button onClick={open} size="icon" variant="outline">
        <LucidePaperclip className="aspect-square w-4" />
      </Button>

      <Dialog onOpenChange={close} open={isOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add attachments</DialogTitle>
            <DialogDescription>
              Upload files to attach to this comment.
            </DialogDescription>
          </DialogHeader>

          <AttachmentCreateForm
            createAttachmentAction={createAttachmentAction}
            onSuccess={close}
            ownerId={commentId}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export { AddCommentAttachmentButton };
