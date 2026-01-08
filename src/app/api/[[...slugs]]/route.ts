import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { app } from "@/lib/app";
import { auth } from "@/lib/auth";
import { inngestHandler } from "./inngest-plugin";

// apply cors to all routes
app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_APP_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(openapi());
// mount the auth handler with Elysia
app.mount("/auth", auth.handler);

// export the Elysia app as a Next.js route handlers
export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const DELETE = app.handle;
export const OPTIONS = app.handle;

// register inngest
app.use(inngestHandler);
