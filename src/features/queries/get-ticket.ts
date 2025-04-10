import { initialTickets } from "@/data";
import { TICKET } from "../types";

export const getTicket = async (_id: string): Promise<TICKET | undefined> => {
  const ticket = initialTickets.find(({ id }) => id === _id);
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return new Promise((resolve) => resolve(ticket));
};
