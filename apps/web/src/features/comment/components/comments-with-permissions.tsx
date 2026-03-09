import { addCommentsAccess } from "@/features/auth/dto/add-comments-access";
import type { User } from "@/features/auth/types";
import { Comments } from "@/features/comment/components/comments";
import type { CommentWithUserInfo } from "@/features/comment/types";
import { getMemberPermission } from "@/features/memberships/queries/get-member-permission";
import type { PaginatedResult } from "@/features/pagination/types";
import type { List, Maybe } from "@/types";
import { toCommentListPayload } from "../utils/to-comment-list-payload";

interface CommentsWithPermissionsProps {
  createAttachmentAction: Parameters<
    typeof Comments
  >[0]["createAttachmentAction"];
  deleteAttachmentAction: Parameters<
    typeof Comments
  >[0]["deleteAttachmentAction"];
  deleteCommentAction: Parameters<typeof Comments>[0]["deleteCommentAction"];
  listWithAttachments: List<CommentWithUserInfo>;
  loadMoreAction: Parameters<typeof Comments>[0]["loadMoreAction"];
  metadata: PaginatedResult<CommentWithUserInfo>["metadata"];
  ticket: { id: string; slug: string; organizationId: string };
  upsertCommentAction: Parameters<typeof Comments>[0]["upsertCommentAction"];
  user: Maybe<User>;
}

export const CommentsWithPermissions = async ({
  user,
  ticket,
  listWithAttachments,
  metadata,
  loadMoreAction,
  createAttachmentAction,
  deleteAttachmentAction,
  deleteCommentAction,
  upsertCommentAction,
}: CommentsWithPermissionsProps) => {
  const list = listWithAttachments ?? [];

  if (!user) {
    const listWithAccess = list.map((comment) => ({
      ...comment,
      isOwner: false,
      canCreate: false,
      canUpdate: false,
      canDelete: false,
    }));
    const listPayload = listWithAccess.map(toCommentListPayload);
    return (
      <Comments
        canCreate={false}
        createAttachmentAction={createAttachmentAction}
        deleteAttachmentAction={deleteAttachmentAction}
        deleteCommentAction={deleteCommentAction}
        list={listPayload}
        loadMoreAction={loadMoreAction}
        metadata={metadata}
        ticketId={ticket.id}
        ticketSlug={ticket.slug}
        upsertCommentAction={upsertCommentAction}
      />
    );
  }

  const [permission, listWithAccess] = await Promise.all([
    getMemberPermission(user.id, ticket.organizationId, "COMMENT"),
    addCommentsAccess(list, user, ticket.organizationId),
  ]);

  const listPayload = (listWithAccess ?? []).map(toCommentListPayload);

  return (
    <Comments
      canCreate={permission?.canCreate ?? false}
      createAttachmentAction={createAttachmentAction}
      deleteAttachmentAction={deleteAttachmentAction}
      deleteCommentAction={deleteCommentAction}
      list={listPayload}
      loadMoreAction={loadMoreAction}
      loadMoreOrganizationId={ticket.organizationId}
      loadMoreUserId={user.id}
      metadata={metadata}
      ticketId={ticket.id}
      ticketSlug={ticket.slug}
      upsertCommentAction={upsertCommentAction}
      userId={user.id}
      userName={user.name}
    />
  );
};
