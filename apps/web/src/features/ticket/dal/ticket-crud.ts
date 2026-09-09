import { orm } from "@firstroad/db";
import type {
  TicketModel,
  TicketStatus,
  TicketWithUserName,
} from "@firstroad/db/client-types";

interface TicketWriteInput {
  bounty: number;
  deadline: string;
  description: string;
  organizationId: string;
  slug: string;
  title: string;
  userId: string;
}

interface TicketPatchInput {
  bounty?: number;
  deadline?: string;
  description?: string;
  slug?: string;
  status?: TicketStatus;
  title?: string;
  userId?: string;
}

const withUser = () =>
  orm.Ticket.include("user", (user) => user.select("name"));

const requireTicket = <T>(row: T | null): T => {
  if (!row) {
    throw new Error("Ticket not found");
  }
  return row;
};

// biome-ignore lint/suspicious/useAwait: db query
const createTicket = async ({
  data,
  includeUser,
}: {
  data: TicketWriteInput;
  includeUser?: boolean;
}): Promise<TicketModel | TicketWithUserName> => {
  if (includeUser) {
    return withUser().create(data);
  }
  return orm.Ticket.create(data);
};

const updateTicket = async ({
  id,
  data,
  includeUser,
}: {
  id: string;
  data: TicketPatchInput;
  includeUser?: boolean;
}): Promise<TicketModel | TicketWithUserName> => {
  const payload = { ...data, updatedAt: new Date().toISOString() };
  if (includeUser) {
    return requireTicket(await withUser().where({ id }).update(payload));
  }
  return requireTicket(await orm.Ticket.where({ id }).update(payload));
};

const deleteTicketRecord = async (id: string): Promise<void> => {
  await orm.Ticket.where({ id }).delete();
};

export { createTicket, deleteTicketRecord, updateTicket };
