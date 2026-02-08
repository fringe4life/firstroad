import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "./prisma",
  migrations: {
    seed: "bun run prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "postgresql://localhost:5432/dummy",
  },
});
