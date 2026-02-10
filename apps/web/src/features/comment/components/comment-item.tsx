"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { deleteCommentAttachment } from "@/features/attachments/actions/delete-comment-attachment";
import { AttachmentList } from "@/features/attachments/components/attachment-list";
import { useComments } from "@/features/comment/components/comments-store";
import type { CommentItemProps } from "@/features/comment/types";
import { TimeAgo } from "./time-ago";

const CommentItem = ({ comment, buttons }: CommentItemProps) => {
  const { userId } = useComments();
  const { updatedAt, createdAt, content, user, attachments } = comment;
  const isOwner = userId === comment.userId;

  const userName = user?.name || "Anonymous";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex gap-2" data-owner={isOwner}>
      <Card className="max-content-narrow gap-0 owner:border-primary/30 owner:bg-primary/7">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="font-medium text-xs">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="grid">
              <span className="font-medium text-sm">{userName}</span>
              <TimeAgo
                createdAt={createdAt.toISOString()}
                updatedAt={updatedAt.toISOString()}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="whitespace-pre-line pt-0">
          {content}
          {attachments && attachments.length > 0 && (
            <div className="mt-3">
              <AttachmentList
                attachments={attachments}
                deleteAttachmentAction={deleteCommentAttachment}
                isOwner={userId === comment.userId}
                ownerId={comment.id}
              />
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex flex-col gap-1">{buttons}</div>
    </div>
  );
};

export { CommentItem };
