import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";
import type { Maybe } from "@/types";
import { env } from "./env";

const bunWebSocket = globalThis.WebSocket;
if (!bunWebSocket) {
  throw new Error("WebSocket is unavailable. This build expects Bun runtime.");
}
neonConfig.webSocketConstructor = bunWebSocket;
// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
neonConfig.poolQueryViaFetch = true;
// Type definitions
declare global {
  var prisma: Maybe<PrismaClient>;
}
const connectionString = env.DATABASE_URL;
const adapter = new PrismaNeon({ connectionString });
const db = global.prisma || new PrismaClient({ adapter });
if (process.env.NODE_ENV === "development") {
  global.prisma = db;
}
export { db as prisma };
