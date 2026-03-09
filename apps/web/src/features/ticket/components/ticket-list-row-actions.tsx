"use client";

import { TicketActionsDesktop } from "@/features/ticket/components/ticket-actions-desktop";
import { TicketActionsMobile } from "@/features/ticket/components/ticket-actions-mobile";
import type { TicketListRowActionsProps } from "@/features/ticket/types";

const TicketListRowActions = ({
  ticket,
  variant,
  isOwner,
  canDelete,
  canUpdate,
}: TicketListRowActionsProps) =>
  variant === "desktop" ? (
    <TicketActionsDesktop
      canDelete={canDelete}
      canUpdate={canUpdate}
      isOwner={isOwner}
      ticket={ticket}
      variant="list"
    />
  ) : (
    <TicketActionsMobile
      canDelete={canDelete}
      canUpdate={canUpdate}
      isOwner={isOwner}
      onActionClick={(e) => e.stopPropagation()}
      ticket={ticket}
    />
  );

export { TicketListRowActions };
