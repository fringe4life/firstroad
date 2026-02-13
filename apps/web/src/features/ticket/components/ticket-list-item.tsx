"use client";

import { TicketActionsDesktop } from "@/features/ticket/components/ticket-actions-desktop";
import { TicketActionsMobile } from "@/features/ticket/components/ticket-actions-mobile";
import { TicketCard } from "@/features/ticket/components/ticket-card";
import type { BaseTicket, TicketAccess } from "@/features/ticket/types";

interface TicketListItemProps extends TicketAccess {
  ticket: BaseTicket;
}

/**
 * Ticket component for list views
 * Displays ticket card with desktop (sidebar) and mobile (bottom bar) actions
 */
const TicketListItem = ({
  ticket,
  isOwner,
  canCreate,
  canDelete,
  canUpdate,
}: TicketListItemProps) => {
  const { slug, id, status } = ticket;

  return (
    <div
      className="max-content-narrow self-start justify-self-center"
      data-owner={isOwner}
    >
      <TicketCard
        actions={
          <TicketActionsDesktop
            canCreate={canCreate}
            canDelete={canDelete}
            canUpdate={canUpdate}
            isOwner={isOwner}
            ticket={{ id, slug, status }}
            variant="list"
          />
        }
        mobileActions={
          <TicketActionsMobile
            canCreate={canCreate}
            canDelete={canDelete}
            canUpdate={canUpdate}
            isOwner={isOwner}
            onActionClick={(e) => e.stopPropagation()}
            ticket={{ id, slug, status }}
          />
        }
        ticket={ticket}
        variant="list"
      />
    </div>
  );
};

export { TicketListItem };
