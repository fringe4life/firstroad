import { TicketCard } from "@/features/ticket/components/ticket-card";
import type { BaseTicket } from "@/features/ticket/types";

interface TicketDetailViewProps {
  /** Slot for desktop actions (sidebar). Wrap in HasAuthSuspense with TicketActionsDesktopSkeleton fallback. */
  actionsSlot?: React.ReactNode;
  attachmentsSlot?: React.ReactNode;
  commentsSlot?: React.ReactNode;
  /** Slot for mobile actions (bottom bar). Wrap in HasAuthSuspense with TicketActionBarSkeleton fallback. */
  mobileActionsSlot?: React.ReactNode;
  referencedTicketsSlot?: React.ReactNode;
  ticket: BaseTicket;
}

/**
 * Ticket component for detail pages
 * Uses slots for attachments/comments and for actions (desktop + mobile).
 * Pass actionsSlot and mobileActionsSlot wrapped in HasAuthSuspense so the card renders immediately and actions stream in after auth.
 */
const TicketDetailView = ({
  ticket,
  attachmentsSlot,
  commentsSlot,
  actionsSlot,
  mobileActionsSlot,
  referencedTicketsSlot,
}: TicketDetailViewProps) => (
  <div className="max-content-widest grid min-h-full grid-rows-[min-content_min-content_min-content_1fr] gap-y-4 self-start justify-self-center">
    <TicketCard
      actions={actionsSlot}
      mobileActions={mobileActionsSlot}
      ticket={ticket}
      variant="detail"
    />
    {attachmentsSlot}
    {referencedTicketsSlot}
    {commentsSlot}
  </div>
);

export { TicketDetailView };
