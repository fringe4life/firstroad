import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import type { SortOrder } from "@firstroad/db/client-types";
import { t } from "elysia";
import { LIMITS } from "@/features/pagination/constants";
import { getTicketsApi } from "@/features/ticket/dal/get-tickets-api";
import { getTicketBySlugApi } from "@/features/ticket/queries/get-ticket-api";
import { app } from "@/lib/app";
import { auth } from "@/lib/auth";
import { inngestHandler } from "./inngest-plugin";

// apply cors to all routes
app.use(openapi());
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

app.get(
  "/tickets",
  async ({ query, status }) => {
    const { search, sortKey, sortValue, page, limit } = query;
    const tickets = await getTicketsApi({
      search,
      sortKey,
      sortValue: sortValue as SortOrder,
      page,
      limit,
    });
    if (!tickets) {
      return status(404, "Tickets not found");
    }
    return tickets;
  },
  {
    query: t.Object({
      search: t.Optional(t.Union([t.String(), t.Undefined()])),
      sortKey: t.String({
        enum: ["bounty", "createdAt"],
        default: "createdAt",
      }),
      sortValue: t.String({ enum: ["asc", "desc"], default: "desc" }),
      page: t.Number({ default: 0, min: 0 }),
      limit: t.Number({ enum: LIMITS, default: 10, min: 10, max: 100 }),
    }),
    detail: {
      tags: ["tickets"],
      description: "List tickets with pagination, search, and sorting",
    },
  },
);

app.get(
  "/tickets/:slug",
  async ({ params, status }) => {
    const { slug } = params;
    const ticket = await getTicketBySlugApi(slug);
    if (!ticket) {
      return status(404, "Ticket not found");
    }
    return ticket;
  },
  {
    params: t.Object({
      slug: t.String(),
    }),
    detail: {
      tags: ["tickets", "ticket"],
      description: "Get a single ticket by slug",
    },
  },
);

// export the Elysia app as a Next.js route handlers
export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const DELETE = app.handle;
export const OPTIONS = app.handle;

// register inngest
app.use(inngestHandler);
