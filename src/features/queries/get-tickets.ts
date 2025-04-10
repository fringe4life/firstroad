import { initialTickets } from "@/data";
import { TICKET } from "../types";

export const getTickets = async (): Promise<TICKET[]> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return new Promise((resolve) => resolve(initialTickets));
};
