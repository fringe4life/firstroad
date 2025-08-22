import { getComments } from "@/features/comment/queries/get-comments";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import CommentDeleteButton from "./comment-delete-button";

type CommentItemProps = {
  comment: Awaited<ReturnType<typeof getComments>>[number];
  buttons?: React.ReactNode[];
};

const CommentItem = ({ comment, buttons = [] }: CommentItemProps) => {
  const { updatedAt, createdAt, content, userInfo } = comment;
  
  const userName = userInfo?.user?.name || "Anonymous";
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  
  // Safely parse dates and handle potential invalid date values
  const createdDate = new Date(createdAt);
  const updatedDate = new Date(updatedAt);
  const timeAgo = !isNaN(createdDate.getTime()) 
    ? formatDistanceToNow(createdDate, { addSuffix: true })
    : "Unknown time";
  const isEdited = !isNaN(updatedDate.getTime()) && updatedDate.getTime() !== createdDate.getTime();

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
      <div className="flex flex-col gap-1">
        {buttons}
        
      </div>
    </div>
  );
};

export default CommentItem;