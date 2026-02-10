import { Attachments } from "@/features/attachments/components/attachments";
import { presignAttachments } from "@/features/attachments/utils/presign-attachments";
import { createCommentAttachment } from "@/features/comment/actions/create-comment-attachment";
import { deleteCommentAttachment } from "@/features/comment/actions/delete-comment-attachment";
import { getAttachmentsByComment } from "@/features/comment/queries/get-attachments-by-comment";

interface CommentAttachmentsProps {
  commentId: string;
  ticketId: string;
  organizationId: string;
  isOwner: boolean;
}

const CommentAttachments = async ({
  commentId,
  organizationId,
  isOwner,
}: CommentAttachmentsProps) => {
  const attachments = await getAttachmentsByComment(commentId);
  const attachmentsWithUrls = presignAttachments(
    organizationId,
    "comment",
    commentId,
    attachments,
  );

  return (
    <Attachments
      attachments={attachmentsWithUrls}
      createAttachmentAction={createCommentAttachment}
      deleteAttachmentAction={deleteCommentAttachment}
      isOwner={isOwner}
      ownerId={commentId}
    />
  );
};

export { CommentAttachments };
