import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { HasAuthSuspense } from "@/features/auth/components/has-auth";
import { deleteComment } from "@/features/comment/actions/delete-comment";
import { upsertComment } from "@/features/comment/actions/upsert-comment";
import { Comments } from "@/features/comment/components/comments";
import { CommentFormSkeleton } from "@/features/comment/components/skeletons/comment-form-skeleton";
import { CommentListSkeleton } from "@/features/comment/components/skeletons/comment-list-skeleton";
import { getCommentsByTicketSlug } from "@/features/comment/dal/get-comments";
import { TICKET_NOT_FOUND } from "@/features/constants";
import { TicketItem } from "@/features/ticket/components/ticket-item";
import { getAllTicketSlugs } from "@/features/ticket/queries/get-all-ticket-slugs";
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

  return (
    <div className="grid h-full w-full grid-rows-[min-content_1fr] gap-y-8">
      <Breadcrumbs
        breadcrumbs={[
          { title: "Tickets", href: ticketsPath() },
          { title: ticket.title },
        ]}
      />
      <TicketItem
        comments={
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
                deleteCommentAction={deleteComment}
                list={list}
                loadMoreAction={getCommentsByTicketSlug}
                metadata={metadata}
                ticketId={ticket.id}
                ticketSlug={ticket.slug}
                upsertCommentAction={upsertComment}
                userId={user?.id}
                userName={user?.name ?? ""}
              />
            )}
          </HasAuthSuspense>
        }
        isDetail={true}
        ticket={ticket}
      />
    </div>
  );
};

export default TicketDetailPage;
