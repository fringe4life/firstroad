import { createAttachment } from "@/features/attachments/actions/create-attachment";
import { deleteAttachment } from "@/features/attachments/actions/delete-attachment";
import { Attachments } from "@/features/attachments/components/attachments";
import { presignAttachments } from "@/features/attachments/utils/presign-attachments";
import { getAttachmentsByComment } from "@/features/comment/queries/get-attachments-by-comment";

interface CommentAttachmentsProps {
  commentId: string;
  isOwner: boolean;
  organizationId: string;
  ticketId: string;
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
      createAttachmentAction={createAttachment.bind(null, "COMMENT")}
      deleteAttachmentAction={deleteAttachment.bind(null, "COMMENT")}
      isOwner={isOwner}
      ownerId={commentId}
    />
  );
};

export { CommentAttachments };
