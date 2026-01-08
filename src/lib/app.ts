import Elysia from "elysia";

export const app = new Elysia({ prefix: "/api" });

export type AppRoutes = typeof app;
