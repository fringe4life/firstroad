import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { serve } from "inngest/bun";
import { eventEmailOTP } from "@/features/auth/events/event-email-otp";
import { eventEmailVerification } from "@/features/auth/events/event-email-verification";
import { eventWelcomeEmail } from "@/features/auth/events/event-welcome-email";
import { eventPasswordChanged } from "@/features/password/events/event-password-changed";
import { eventPasswordReset } from "@/features/password/events/event-password-reset";
import { auth } from "@/lib/auth";
import { inngest } from "@/lib/inngest";

const app = new Elysia()
  .use(
    cors({
      origin: process.env.NEXT_PUBLIC_APP_URL,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .mount("/auth", auth.handler);

export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const DELETE = app.handle;
export const OPTIONS = app.handle;

const functions = [
  eventEmailVerification,
  eventPasswordReset,
  eventEmailOTP,
  eventWelcomeEmail,
  eventPasswordChanged,
];

const handler = serve({
  client: inngest,
  functions,
});

const inngestHandler = app.all("/api/inngest", ({ request }) =>
  handler(request),
);

// register the handler with Elysia
app.use(inngestHandler);

export type AppRoutes = typeof app;
