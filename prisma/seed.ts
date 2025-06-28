import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

const tickets = [
  {
    // id: "1",
    title: "Ticket 1",
    content: "First ticket from DB.",
    status: "DONE" as const,
    bounty: 250099,
    deadline: "2025-7-12",
  },
  {
    // id: "2",
    title: "Ticket 2",
    content: "Second ticket from DB.",
    status: "OPEN" as const,
    bounty: 120099,
    deadline: "2025-9-12",
  },
  {
    // id: "3",
    title: "Ticket 3",
    content: "Third ticket from DB.",
    status: "IN_PROGRESS" as const,
    bounty: 25099,
    deadline: "2025-6-28",
  },
];

const main = async () => {
  await prisma.ticket.deleteMany();

  await prisma.ticket.createMany({
    data: tickets,
  });

  console.log("DB main: Finished");
};

main();
