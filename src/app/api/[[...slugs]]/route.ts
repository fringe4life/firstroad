import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { app } from "@/lib/app";
import { auth } from "@/lib/auth";
import { inngestHandler } from "./inngest-plugin";

// enable cors and mount the auth handler
app
  .use(
    cors({
      origin: process.env.NEXT_PUBLIC_APP_URL,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .mount("/auth", auth.handler);

// export the Elysia app as a Next.js route handlers
export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const DELETE = app.handle;
export const OPTIONS = app.handle;

// register the inngest handler and openapi with Elysia
app.use(inngestHandler);
app.use(openapi());

export type AppRoutes = typeof app;
