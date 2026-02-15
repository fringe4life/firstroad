import { neonConfig } from "@neondatabase/serverless";
import { PrismaClient } from "../generated/prisma/client";
import { createAdapter } from "./adapter";

declare global {
  var prisma: PrismaClient | undefined;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

// Neon-specific config (only needed when using Neon adapter)
if (connectionString.includes("neon.tech")) {
  neonConfig.webSocketConstructor = globalThis.WebSocket;
  neonConfig.poolQueryViaFetch = true;
}

const adapter = createAdapter(connectionString);
const db = global.prisma ?? new PrismaClient({ adapter });
if (process.env.NODE_ENV === "development") {
  global.prisma = db;
}

export { db as prisma };
