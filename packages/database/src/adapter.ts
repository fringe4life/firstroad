import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Creates the appropriate Prisma driver adapter based on DATABASE_URL.
 * - Neon URLs (containing "neon.tech") → PrismaNeon (serverless HTTP/WebSocket)
 * - Local/other Postgres → PrismaPg (standard TCP)
 */
export function createAdapter(connectionString: string) {
  const isNeon = connectionString.includes("neon.tech");
  if (isNeon) {
    return new PrismaNeon({ connectionString });
  }
  return new PrismaPg({ connectionString });
}
