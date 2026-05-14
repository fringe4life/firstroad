import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "./prisma",
  migrations: {
    seed: "bun run prisma/seed.ts",
  },
  datasource: {
    // @ts-expect-error
    url: process.env.DATABASE_URL,
  },
});
