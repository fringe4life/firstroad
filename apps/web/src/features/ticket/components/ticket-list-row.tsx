import { TicketCard } from "@/features/ticket/components/ticket-card";
import { TicketListRowActions } from "@/features/ticket/components/ticket-list-row-actions";
import type { TicketWithAccess } from "@/features/ticket/types";

interface TicketListRowProps {
  sortKey: string;
  ticket: TicketWithAccess;
}

const TicketListRow = ({ ticket, sortKey }: TicketListRowProps) => {
  const { id, slug, status } = ticket;

  return (
    <div
      className="max-content-narrow self-start justify-self-center"
      data-owner={ticket.isOwner}
    >
      <TicketCard
        actions={
          <TicketListRowActions
            canCreate={ticket.canCreate}
            canDelete={ticket.canDelete}
            canUpdate={ticket.canUpdate}
            isOwner={ticket.isOwner}
            ticket={{ id, slug, status }}
            variant="desktop"
          />
        }
        mobileActions={
          <TicketListRowActions
            canCreate={ticket.canCreate}
            canDelete={ticket.canDelete}
            canUpdate={ticket.canUpdate}
            isOwner={ticket.isOwner}
            ticket={{ id, slug, status }}
            variant="mobile"
          />
        }
        sortKey={sortKey}
        ticket={ticket}
        variant="list"
      />
    </div>
  );
};

export { TicketListRow };
