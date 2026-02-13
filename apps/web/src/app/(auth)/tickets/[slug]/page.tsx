import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { createAttachment } from "@/features/attachments/actions/create-attachment";
import { deleteAttachment } from "@/features/attachments/actions/delete-attachment";
import { Attachments } from "@/features/attachments/components/attachments";
import { AttachmentsSkeleton } from "@/features/attachments/components/skeletons/attachments-skeleton";
import { presignAttachments } from "@/features/attachments/utils/presign-attachments";
import { HasAuthSuspense } from "@/features/auth/components/has-auth";
import { isOwner } from "@/features/auth/utils/owner";
import { createCommentAttachment } from "@/features/comment/actions/create-comment-attachment";
import { deleteComment } from "@/features/comment/actions/delete-comment";
import { upsertComment } from "@/features/comment/actions/upsert-comment";
import { Comments } from "@/features/comment/components/comments";
import { CommentFormSkeleton } from "@/features/comment/components/skeletons/comment-form-skeleton";
import { CommentListSkeleton } from "@/features/comment/components/skeletons/comment-list-skeleton";
import { getCommentsByTicketSlug } from "@/features/comment/dal/get-comments";
import { getAttachmentsByComment } from "@/features/comment/queries/get-attachments-by-comment";
import { TicketActionBarSkeleton } from "@/features/ticket/components/skeletons/ticket-action-bar-skeleton";
import { TicketActionsDesktopSkeleton } from "@/features/ticket/components/skeletons/ticket-actions-desktop-skeleton";
import { TicketDetailActionsDesktop } from "@/features/ticket/components/ticket-detail-actions-desktop";
import { TicketDetailActionsMobile } from "@/features/ticket/components/ticket-detail-actions-mobile";
import { TicketDetailView } from "@/features/ticket/components/ticket-detail-view";
import { TICKET_NOT_FOUND } from "@/features/ticket/constants";
import { getAllTicketSlugs } from "@/features/ticket/queries/get-all-ticket-slugs";
import { getAttachmentsByTicket } from "@/features/ticket/queries/get-attachments-by-ticket";
import { getTicketBySlug } from "@/features/ticket/queries/get-ticket";
import { ticketsPath } from "@/path";

export const generateStaticParams = async () => await getAllTicketSlugs();

export const generateMetadata = async ({
  params,
}: PageProps<"/tickets/[slug]">): Promise<Metadata> => {
  const { slug } = await params;
  const ticket = await getTicketBySlug(slug);

  if (!ticket) {
    return TICKET_NOT_FOUND;
  }

  const { title, description } = ticket;

  return {
    title,
    description,
  };
};

const TicketDetailPage = async ({ params }: PageProps<"/tickets/[slug]">) => {
  const { slug } = await params;

  const ticketPromise = getTicketBySlug(slug);
  const commentsPromise = getCommentsByTicketSlug(slug, undefined, 3);

  const [ticket, { list, metadata }] = await Promise.all([
    ticketPromise,
    commentsPromise,
  ]);

  if (!ticket) {
    notFound();
  }

  const attachments = await getAttachmentsByTicket(ticket.id);
  const attachmentsWithUrls = presignAttachments(
    ticket.organizationId,
    "ticket",
    ticket.id,
    attachments,
  );

  // Preload attachments for the initial page of comments so CommentItem can render them.
  const commentAttachmentsEntries = await Promise.all(
    (list ?? []).map(async (comment) => {
      const commentAttachments = await getAttachmentsByComment(comment.id);
      const commentAttachmentsWithUrls = presignAttachments(
        ticket.organizationId,
        "comment",
        comment.id,
        commentAttachments,
      );
      return [comment.id, commentAttachmentsWithUrls] as const;
    }),
  );
  const commentAttachmentsMap = new Map(commentAttachmentsEntries);
  const listWithAttachments =
    list?.map((comment) => ({
      ...comment,
      attachments: commentAttachmentsMap.get(comment.id) ?? [],
    })) ?? list;

  return (
    <div className="grid h-full grid-rows-[min-content_1fr] gap-y-8">
      <Breadcrumbs
        breadcrumbs={[
          { title: "Tickets", href: ticketsPath() },
          { title: ticket.title },
        ]}
      />
      <TicketDetailView
        actionsSlot={
          <HasAuthSuspense fallback={<TicketActionsDesktopSkeleton />}>
            {(user) => (
              <TicketDetailActionsDesktop ticket={ticket} user={user} />
            )}
          </HasAuthSuspense>
        }
        attachmentsSlot={
          <HasAuthSuspense fallback={<AttachmentsSkeleton />}>
            {(user) => (
              <Attachments
                attachments={attachmentsWithUrls}
                createAttachmentAction={createAttachment}
                deleteAttachmentAction={deleteAttachment}
                isOwner={isOwner(user, { userId: ticket.userId })}
                ownerId={ticket.id}
              />
            )}
          </HasAuthSuspense>
        }
        commentsSlot={
          <HasAuthSuspense
            fallback={
              <>
                <CommentFormSkeleton />
                <CommentListSkeleton />
              </>
            }
          >
            {(user) => (
              <Comments
                createAttachmentAction={createCommentAttachment}
                deleteCommentAction={deleteComment}
                list={listWithAttachments}
                loadMoreAction={getCommentsByTicketSlug}
                metadata={metadata}
                ticketId={ticket.id}
                ticketSlug={ticket.slug}
                upsertCommentAction={upsertComment}
                userId={user?.id}
                userName={user?.name}
              />
            )}
          </HasAuthSuspense>
        }
        mobileActionsSlot={
          <HasAuthSuspense fallback={<TicketActionBarSkeleton />}>
            {(user) => (
              <TicketDetailActionsMobile ticket={ticket} user={user} />
            )}
          </HasAuthSuspense>
        }
        ticket={ticket}
      />
    </div>
  );
};

export default TicketDetailPage;
