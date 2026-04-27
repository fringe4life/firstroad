import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import type { SortOrder } from "@firstroad/db/client-types";
import { t } from "elysia";
import { LIMITS } from "@/features/pagination/constants";
import { getTicketsApi } from "@/features/ticket/dal/get-tickets-api";
import { getTicketBySlugApi } from "@/features/ticket/queries/get-ticket-api";
import { app } from "@/lib/app";
import { auth } from "@/lib/auth";
import { OpenAPI } from "./better-auth-openapi";

// apply cors to all routes
app.use(
  openapi({
    documentation: {
      components: await OpenAPI.components,
      paths: await OpenAPI.getPaths(),
    },
  }),
);
app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_APP_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
// mount the auth handler with Elysia
app.mount(auth.handler, {
  detail: {
    tags: ["auth"],
    description: "Authentication endpoints from better auth",
  },
});

// export the Elysia app as a Next.js route handlers
export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const DELETE = app.handle;
export const OPTIONS = app.handle;
