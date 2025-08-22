"use client";

import { getComments } from "@/features/comment/queries/get-comments";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { LucideTrash } from "lucide-react";
import useConfirmDialog from "@/components/confirm-dialog";
import { deleteComment } from "@/features/comment/actions/delete-comment";
import { useSession } from "next-auth/react";
import { isOwner } from "@/features/auth/utils/owner";

type CommentItemProps ={ comment:    Awaited<ReturnType<typeof getComments>>[number]};

const CommentItem = ({ comment }: CommentItemProps) => {
  const { data: session } = useSession();
  const { updatedAt, createdAt, content, userInfo, id } = comment;
  const isCommentOwner = isOwner(session, comment);
  
  const userName = userInfo?.user?.name || "Anonymous";
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  
  // Safely parse dates and handle potential invalid date values
  const createdDate = new Date(createdAt);
  const updatedDate = new Date(updatedAt);
  const timeAgo = !isNaN(createdDate.getTime()) 
    ? formatDistanceToNow(createdDate, { addSuffix: true })
    : "Unknown time";
  const isEdited = !isNaN(updatedDate.getTime()) && updatedDate.getTime() !== createdDate.getTime();

  const [deleteButton, deleteDialog] = useConfirmDialog({
    action: deleteComment.bind(null, id),
    trigger: (
      <Button variant="outline" size="icon">
        <LucideTrash className="w-4 aspect-square" />
      </Button>
    ),
    title: "Delete comment",
    description: "Are you sure you want to delete this comment? This action cannot be undone.",
  });

  return (
    <div className="flex gap-2">
      <Card className="w-full max-w-105">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs font-medium">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="grid">
              <span className="text-sm font-medium">{userName}</span>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{timeAgo}</span>
                {isEdited && (
                  <>
                    <span>•</span>
                    <span>edited</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 whitespace-pre-line">
         {content}
        </CardContent>
      </Card>
      {isCommentOwner && (
        <>
          {deleteButton}
          {deleteDialog}
        </>
      )}
    </div>
  );
};

export default CommentItem;