import type { Prisma } from "@prisma/client";
import type { IsOwner } from "@/features/auth/utils/owner";

// Base ticket type using Prisma's generated type
export type BaseTicket = Prisma.TicketGetPayload<{
  include: {
    userInfo: {
      include: {
        user: {
          select: {
            name: true;
          };
        };
      };
    };
  };
}> &
  IsOwner;
