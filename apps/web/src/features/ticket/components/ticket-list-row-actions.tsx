"use client";

import { TicketActionsDesktop } from "@/features/ticket/components/ticket-actions-desktop";
import { TicketActionsMobile } from "@/features/ticket/components/ticket-actions-mobile";
import type { TicketListRowActionsProps } from "@/features/ticket/types";

const TicketListRowActions = ({
  ticket,
  variant,
  isOwner,
  canCreate,
  canDelete,
  canUpdate,
}: TicketListRowActionsProps) =>
  variant === "desktop" ? (
    <TicketActionsDesktop
      canCreate={canCreate}
      canDelete={canDelete}
      canUpdate={canUpdate}
      isOwner={isOwner}
      ticket={ticket}
      variant="list"
    />
  ) : (
    <TicketActionsMobile
      canCreate={canCreate}
      canDelete={canDelete}
      canUpdate={canUpdate}
      isOwner={isOwner}
      onActionClick={(e) => e.stopPropagation()}
      ticket={ticket}
    />
  );

export { TicketListRowActions };
