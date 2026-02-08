import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client";

neonConfig.webSocketConstructor = globalThis.WebSocket;
neonConfig.poolQueryViaFetch = true;

declare global {
  var prisma: PrismaClient | undefined;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}
const adapter = new PrismaNeon({ connectionString });
const db = global.prisma ?? new PrismaClient({ adapter });
if (process.env.NODE_ENV === "development") {
  global.prisma = db;
}

export { db as prisma };
