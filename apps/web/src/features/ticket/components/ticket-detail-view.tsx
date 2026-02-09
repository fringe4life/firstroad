import { TicketCard } from "@/features/ticket/components/ticket-card";
import type { BaseTicket } from "@/features/ticket/types";

interface TicketDetailViewProps {
  ticket: BaseTicket;
  attachmentsSlot?: React.ReactNode;
  commentsSlot?: React.ReactNode;
  /** Slot for desktop actions (sidebar). Wrap in HasAuthSuspense with TicketActionsDesktopSkeleton fallback. */
  actionsSlot?: React.ReactNode;
  /** Slot for mobile actions (bottom bar). Wrap in HasAuthSuspense with TicketActionBarSkeleton fallback. */
  mobileActionsSlot?: React.ReactNode;
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
}: TicketDetailViewProps) => (
  <div className="max-content-widest grid gap-y-4 self-start justify-self-center">
    <TicketCard
      actions={actionsSlot}
      mobileActions={mobileActionsSlot}
      ticket={ticket}
      variant="detail"
    />

    {attachmentsSlot}
    {commentsSlot}
  </div>
);

export { TicketDetailView };
