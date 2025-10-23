import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Comment } from "@/features/comment/types";
import TimeAgo from "./time-ago";

type CommentItemProps = {
  comment: Comment;
  buttons?: React.ReactNode;
};

const CommentItem = ({ comment, buttons }: CommentItemProps) => {
  const { updatedAt, createdAt, content, userInfo } = comment;

  const userName = userInfo?.user?.name || "Anonymous";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Time display is now handled by the TimeAgo client component

  return (
    <div className="flex gap-2">
      <Card className="w-full max-w-105 gap-0">
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
        </CardContent>
      </Card>
      <div className="flex flex-col gap-1">{buttons}</div>
    </div>
  );
};

export default CommentItem;
