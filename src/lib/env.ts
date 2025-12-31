import "server-only";
import { minLength, object, parse, pipe, string, url } from "valibot";

// Environment schema validation
const envSchema = object({
  AUTH_SECRET: pipe(string(), minLength(1, "AUTH_SECRET is required")),
  DATABASE_URL: pipe(
    string(),
    url("DATABASE_URL must be a valid URL"),
    minLength(1, "DATABASE_URL is required"),
  ),
  // DIRECT_URL: pipe(
  //   string(),
  //   url("DIRECT_URL must be a valid URL"),
  //   minLength(1, "DIRECT_URL is required"),
  // ),
  NEXT_PUBLIC_APP_URL: pipe(
    string(),
    url("NEXT_PUBLIC_APP_URL must be a valid URL"),
    minLength(1, "NEXT_PUBLIC_APP_URL is required"),
  ),
  RESEND_API_KEY: pipe(string(), minLength(1, "RESEND_API_KEY is required")),
  NEXT_PUBLIC_RESEND_FROM: pipe(
    string(),
    minLength(
      1,
      "RESEND_FROM is required (e.g. 'Your App <onboarding@resend.dev>' or 'noreply@yourdomain.com')",
    ),
  ),
});

// Export validated environment variables
export const env = parse(envSchema, process.env);
