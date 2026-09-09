import { Pool as NeonPool, neonConfig } from "@neondatabase/serverless";
import postgres from "@prisma/orm-postgres/runtime";
import { Pool as PgPool } from "pg";
import type { Contract } from "./contract.d";
import contractJson from "./contract.json" with { type: "json" };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const isNeon = connectionString.includes("neon.tech");
if (isNeon) {
  neonConfig.webSocketConstructor = globalThis.WebSocket;
  neonConfig.poolQueryViaFetch = true;
}

const localPool = new PgPool({ connectionString });

/** Shared pg pool for Better Auth and raw SQL scripts. */
export const pool: PgPool | NeonPool = isNeon
  ? new NeonPool({ connectionString })
  : localPool;

export const db = postgres<Contract>({
  contractJson,
  // Prisma Next pins @types/pg@8.20; monorepo may resolve 8.21 — same runtime API.
  pg: (isNeon ? pool : localPool) as never,
});

/** Flat ORM accessor for the public schema (typed; prefer over `db.orm.public`). */
export const orm = db.orm.public;
