import { TicketCard } from "@/features/ticket/components/ticket-card";
import { TicketOwnerOptionsFetch } from "@/features/ticket/components/ticket-owner-options";
import type { BaseTicket } from "@/features/ticket/types";

interface TicketDetailViewProps {
  ticket: BaseTicket;
  attachmentsSlot?: React.ReactNode;
  commentsSlot?: React.ReactNode;
}

/**
 * Ticket component for detail pages
 * Uses slots for attachments/comments to preserve SSG compatibility
 * The ticket card is pre-rendered at build time, while slots resolve at request time
 */
const TicketDetailView = ({
  ticket,
  attachmentsSlot,
  commentsSlot,
}: TicketDetailViewProps) => {
  const { userId, slug, id, status, organizationId } = ticket;

  return (
    <div className="max-content-widest grid gap-y-4 self-start justify-self-center">
      <TicketCard
        actions={
          <TicketOwnerOptionsFetch
            isDetail={true}
            ticket={{ userId, slug, id, status, organizationId }}
          />
        }
        ticket={ticket}
        variant="detail"
      />

      {attachmentsSlot}
      {commentsSlot}
    </div>
  );
};

export { TicketDetailView };
