import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { app } from "@/lib/app";
import { auth } from "@/lib/auth";
import { OpenAPI } from "./better-auth-openapi";
import { inngestHandler } from "./inngest-plugin";

// apply cors to all routes
app.use(
  openapi({
    documentation: {
      components: await OpenAPI.components,
      paths: await OpenAPI.getPaths(),
    },
    enabled: process.env.NODE_ENV === "development",
  }),
);
app.use(
  cors({
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    origin: process.env.NEXT_PUBLIC_APP_URL,
  }),
);
// mount the auth handler with Elysia
app.mount(auth.handler, {
  detail: {
    description: "Authentication endpoints from better auth",
    tags: ["auth"],
  },
});

app.all("/inngest", ({ request }) => inngestHandler(request), {
  detail: { tags: ["inngest"] },
});

// export the Elysia app as a Next.js route handlers
export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const DELETE = app.handle;
export const OPTIONS = app.handle;
